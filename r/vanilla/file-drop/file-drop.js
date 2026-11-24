import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 104857.6) / 10} MB`;
}

const UPLOAD_ICON = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-5">
  <path d="M12 16V5m0 0L8 9m4-4 4 4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
</svg>`;

const FILE_ICON = `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4 shrink-0">
  <path d="M6 2.8h5.2L15 6.6v10.6H6z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
  <path d="M11 2.8v4h4" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />
</svg>`;

const CHECK_ICON = `<svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4">
  <path data-check-path d="M4.5 10.4 8 14l7.5-8" stroke="currentColor" stroke-width="1.8"
    stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />
</svg>`;

export function createFileDrop(root, options = {}) {
  const {
    onFiles,
    onError,
    accept,
    multiple = false,
    maxSize,
    disabled = false,
    progress,
    status,
    fileName,
    title = "Drop a file or browse",
    hint = "SVG, PNG or JPG",
    icon = "",
    className = "",
  } = options;
  let dragging = false;
  let selected = [];
  let error = null;

  root.innerHTML = `
    <div data-slot="file-drop" role="button" tabindex="${disabled ? "-1" : "0"}"
      aria-disabled="${disabled ? "true" : "false"}" aria-label="${title}"
      class="group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${disabled ? "pointer-events-none opacity-50" : ""} ${className}">
      <input data-input type="file" ${accept ? `accept="${accept}"` : ""} ${multiple ? "multiple" : ""} ${disabled ? "disabled" : ""} class="sr-only" />
      <span data-icon-box class="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm">
        ${icon || UPLOAD_ICON}
      </span>
      <span class="flex flex-col gap-1">
        <span class="text-[13px] font-medium text-foreground">${title}</span>
        <span data-hint class="text-[13px] leading-4 text-muted-foreground">${hint}</span>
      </span>
      <span data-file class="hidden w-full flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 text-left">
        <span class="flex items-center gap-2 text-[13px] text-foreground">
          ${FILE_ICON}
          <span data-name class="min-w-0 flex-1 truncate"></span>
          <span data-size class="shrink-0 tabular-nums text-muted-foreground"></span>
          <span data-done class="hidden size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            ${CHECK_ICON}
          </span>
        </span>
        <span data-progress-track class="hidden h-1 overflow-hidden rounded-full bg-border">
          <span data-progress class="block h-full rounded-full bg-primary" style="width:0%"></span>
        </span>
      </span>
      <span data-error class="hidden text-[13px] leading-4 text-destructive"></span>
    </div>`;

  const host = root.querySelector("[data-slot]");
  const input = root.querySelector("[data-input]");
  const iconBox = root.querySelector("[data-icon-box]");
  const fileRow = root.querySelector("[data-file]");
  const nameEl = root.querySelector("[data-name]");
  const sizeEl = root.querySelector("[data-size]");
  const doneEl = root.querySelector("[data-done]");
  const trackEl = root.querySelector("[data-progress-track]");
  const progressEl = root.querySelector("[data-progress]");
  const errorEl = root.querySelector("[data-error]");
  let iconControl;

  function resolvedStatus() {
    return options.status ?? (error ? "error" : "idle");
  }

  function stateBorder() {
    if (resolvedStatus() === "error") return "border-destructive/60 bg-destructive/5";
    if (dragging) return "border-primary/70 bg-accent/60";
    if (resolvedStatus() === "done") return "border-emerald-500/40 bg-emerald-500/5";
    return "border-border bg-muted/20 hover:border-border/80 hover:bg-accent/40";
  }

  function paint() {
    const current = resolvedStatus();
    host.className = `group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${stateBorder()} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`;

    const shownName = options.fileName ?? selected[0]?.name;
    const shownSize = selected[0] ? formatSize(selected[0].size) : null;
    fileRow.style.display = shownName ? "flex" : "none";
    nameEl.textContent = shownName ?? "";
    sizeEl.textContent = shownName && shownSize ? shownSize : "";
    const complete = current === "done";
    doneEl.style.display = complete ? "flex" : "none";
    if (complete) {
      const path = doneEl.querySelector("[data-check-path]");
      if (path) {
        if (reduce()) {
          path.style.strokeDashoffset = "0";
        } else {
          animate(path, { pathLength: [0, 1] }, { duration: 0.32, ease: [0.23, 1, 0.32, 1] });
        }
      }
    }

    const progressValue = options.progress;
    const safeProgress =
      typeof progressValue === "number"
        ? Math.min(100, Math.max(0, progressValue))
        : null;
    trackEl.style.display = shownName && safeProgress !== null ? "block" : "none";
    if (safeProgress !== null) {
      animate(
        progressEl,
        { width: `${safeProgress}%` },
        reduce() ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 },
      );
    }

    errorEl.style.display = error ? "block" : "none";
    errorEl.textContent = error ?? "";
  }

  function moveIcon(active) {
    if (reduce()) return;
    iconControl?.stop?.();
    iconControl = animate(
      iconBox,
      active ? { y: -3, scale: 1.04 } : { y: 0, scale: 1 },
      { type: "spring", stiffness: 380, damping: 24 },
    );
  }

  function acceptFiles(list) {
    if (!list || disabled) return;
    const files = Array.from(list);
    if (!files.length) return;
    if (!multiple && files.length > 1) files.splice(1);
    if (maxSize !== undefined) {
      const oversized = files.find((file) => file.size > maxSize);
      if (oversized) {
        error = `${oversized.name} is larger than ${formatSize(maxSize)}.`;
        paint();
        onError?.(error);
        return;
      }
    }
    error = null;
    selected = files;
    paint();
    onFiles?.(files);
  }

  function open() {
    if (disabled) return;
    input?.click();
  }

  function onClick() {
    open();
  }
  function onKey(event) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  }
  function onDragEnter(event) {
    event.preventDefault();
    if (disabled) return;
    dragging = true;
    paint();
    moveIcon(true);
  }
  function onDragOver(event) {
    event.preventDefault();
    if (disabled) return;
    if (!dragging) {
      dragging = true;
      paint();
      moveIcon(true);
    }
  }
  function onDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    dragging = false;
    paint();
    moveIcon(false);
  }
  function onDrop(event) {
    event.preventDefault();
    dragging = false;
    paint();
    moveIcon(false);
    acceptFiles(event.dataTransfer?.files);
  }
  function onChange(event) {
    acceptFiles(event.target.files);
    event.target.value = "";
  }

  host.addEventListener("click", onClick);
  host.addEventListener("keydown", onKey);
  host.addEventListener("dragenter", onDragEnter);
  host.addEventListener("dragover", onDragOver);
  host.addEventListener("dragleave", onDragLeave);
  host.addEventListener("drop", onDrop);
  input?.addEventListener("change", onChange);

  paint();

  return {
    element: host,
    setProgress(value) {
      options.progress = value;
      paint();
    },
    setStatus(value) {
      options.status = value;
      paint();
    },
    setFileName(value) {
      options.fileName = value;
      paint();
    },
    destroy() {
      iconControl?.stop?.();
      host.removeEventListener("click", onClick);
      host.removeEventListener("keydown", onKey);
      host.removeEventListener("dragenter", onDragEnter);
      host.removeEventListener("dragover", onDragOver);
      host.removeEventListener("dragleave", onDragLeave);
      host.removeEventListener("drop", onDrop);
      input?.removeEventListener("change", onChange);
      root.innerHTML = "";
    },
  };
}
