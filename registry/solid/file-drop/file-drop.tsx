import { Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type FileDropStatus = "idle" | "uploading" | "done" | "error";

export type FileDropProps = {
  onFiles?: (files: File[]) => void;
  onError?: (message: string) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  progress?: number;
  status?: FileDropStatus;
  fileName?: string;
  title?: string;
  hint?: string;
  icon?: JSX.Element;
  class?: string;
  children?: JSX.Element;
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 104857.6) / 10} MB`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-5">
      <path
        d="M12 16V5m0 0L8 9m4-4 4 4"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4 shrink-0">
      <path
        d="M6 2.8h5.2L15 6.6v10.6H6z"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
      <path
        d="M11 2.8v4h4"
        stroke="currentColor"
        stroke-width="1.4"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  let path: SVGPathElement | undefined;
  onMount(() => {
    if (!path) return;
    if (reduce()) {
      path.style.strokeDashoffset = "0";
      return;
    }
    animate(
      path,
      { strokeDashoffset: [1, 0] },
      { duration: 0.32, ease: [0.23, 1, 0.32, 1] },
    );
  });
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4">
      <path
        ref={(node: SVGPathElement) => (path = node)}
        d="M4.5 10.4 8 14l7.5-8"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="1"
        stroke-dashoffset="1"
      />
    </svg>
  );
}

export function FileDrop(props: FileDropProps) {
  let input: HTMLInputElement | undefined;
  let icon: HTMLSpanElement | undefined;
  let bar: HTMLSpanElement | undefined;
  const [dragging, setDragging] = createSignal(false);
  const [selected, setSelected] = createSignal<File[]>([]);
  const [error, setError] = createSignal<string | null>(null);
  let iconControls: ReturnType<typeof animate> | undefined;
  let barControls: ReturnType<typeof animate> | undefined;

  const resolvedStatus = createMemo<FileDropStatus>(
    () => props.status ?? (error() ? "error" : "idle"),
  );
  const shownName = () => props.fileName ?? selected()[0]?.name;
  const shownSize = () =>
    selected()[0] ? formatSize(selected()[0].size) : null;
  const safeProgress = () =>
    typeof props.progress === "number"
      ? Math.min(100, Math.max(0, props.progress))
      : null;

  const stateBorder = createMemo(() => {
    if (resolvedStatus() === "error")
      return "border-destructive/60 bg-destructive/5";
    if (dragging()) return "border-primary/70 bg-accent/60";
    if (resolvedStatus() === "done")
      return "border-emerald-500/40 bg-emerald-500/5";
    return "border-border bg-muted/20 hover:border-border/80 hover:bg-accent/40";
  });

  const acceptFiles = (list: FileList | null) => {
    if (!list || props.disabled) return;
    const files = Array.from(list);
    if (!files.length) return;
    if (!props.multiple && files.length > 1) files.splice(1);

    if (props.maxSize !== undefined) {
      const oversized = files.find((file) => file.size > props.maxSize!);
      if (oversized) {
        const message = `${oversized.name} is larger than ${formatSize(props.maxSize)}.`;
        setError(message);
        props.onError?.(message);
        return;
      }
    }

    setError(null);
    setSelected(files);
    props.onFiles?.(files);
  };

  const open = () => {
    if (props.disabled) return;
    input?.click();
  };

  const lift = (value: boolean) => {
    if (!icon) return;
    iconControls?.stop?.();
    const lifted = value && !reduce();
    iconControls = animate(
      icon,
      { y: lifted ? -3 : 0, scale: lifted ? 1.04 : 1 },
      { type: "spring", stiffness: 380, damping: 24 },
    );
  };

  const onKey = (event: KeyboardEvent) => {
    if (props.disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  const onChange = (event: Event) => {
    const target = event.currentTarget as HTMLInputElement;
    acceptFiles(target.files);
    target.value = "";
  };

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    if (props.disabled) return;
    if (!dragging()) {
      setDragging(true);
      lift(true);
    }
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    if (props.disabled) return;
    if (!dragging()) {
      setDragging(true);
      lift(true);
    }
  };

  const onDragLeave = (event: DragEvent) => {
    const current = event.currentTarget as HTMLElement;
    if (current.contains(event.relatedTarget as Node)) return;
    if (!dragging()) return;
    setDragging(false);
    lift(false);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    lift(false);
    acceptFiles(event.dataTransfer?.files ?? null);
  };

  createEffect(() => {
    const value = safeProgress();
    queueMicrotask(() => {
      if (!bar || value === null) return;
      barControls?.stop?.();
      barControls = animate(
        bar,
        { width: `${value}%` },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 220, damping: 26 },
      );
    });
  });

  onCleanup(() => {
    iconControls?.stop?.();
    barControls?.stop?.();
  });

  return (
    <div
      data-slot="file-drop"
      role="button"
      tabIndex={props.disabled ? -1 : 0}
      aria-disabled={props.disabled || undefined}
      aria-label={props.title ?? "Drop a file or browse"}
      class={`group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${stateBorder()} ${props.disabled ? "pointer-events-none opacity-50" : ""} ${props.class ?? ""}`}
      onClick={open}
      onKeyDown={onKey}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input
        ref={(node: HTMLInputElement) => (input = node)}
        type="file"
        accept={props.accept}
        multiple={props.multiple}
        disabled={props.disabled}
        class="sr-only"
        onClick={(event: MouseEvent) => event.stopPropagation()}
        onChange={onChange}
      />

      <Show
        when={props.children}
        fallback={
          <>
            <span
              ref={(node: HTMLSpanElement) => (icon = node)}
              class="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm"
            >
              {props.icon ?? <UploadIcon />}
            </span>

            <span class="flex flex-col gap-1">
              <span class="text-[13px] font-medium text-foreground">
                {props.title ?? "Drop a file or browse"}
              </span>
              <span class="text-[13px] leading-4 text-muted-foreground">
                {props.hint ?? "SVG, PNG or JPG"}
              </span>
            </span>

            <Show when={shownName()}>
              <span class="flex w-full flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 text-left">
                <span class="flex items-center gap-2 text-[13px] text-foreground">
                  <FileIcon />
                  <span class="min-w-0 flex-1 truncate">{shownName()}</span>
                  <Show when={shownSize()}>
                    <span class="shrink-0 tabular-nums text-muted-foreground">
                      {shownSize()}
                    </span>
                  </Show>
                  <Show when={resolvedStatus() === "done"}>
                    <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckIcon />
                    </span>
                  </Show>
                </span>
                <Show when={safeProgress() !== null}>
                  <span class="block h-1 overflow-hidden rounded-full bg-border">
                    <span
                      ref={(node: HTMLSpanElement) => (bar = node)}
                      class="block h-full rounded-full bg-primary"
                      style={{ width: "0%" }}
                    />
                  </span>
                </Show>
              </span>
            </Show>

            <Show when={error()}>
              <span class="text-[13px] leading-4 text-destructive">
                {error()}
              </span>
            </Show>
          </>
        }
      >
        {props.children}
      </Show>
    </div>
  );
}
