"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type FileDropStatus = "idle" | "uploading" | "done" | "error";

export type FileDropProps = Omit<
  React.ComponentProps<"div">,
  "onDrop" | "onChange"
> & {
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
  icon?: React.ReactNode;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 104857.6) / 10} MB`;
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path
        d="M12 16V5m0 0L8 9m4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4 shrink-0">
      <path
        d="M6 2.8h5.2L15 6.6v10.6H6z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M11 2.8v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="size-4">
      <motion.path
        d="M4.5 10.4 8 14l7.5-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
      />
    </svg>
  );
}

export function FileDrop({
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
  icon,
  className,
  children,
  onClick,
  ...props
}: FileDropProps) {
  const reduce = useReduceMotion();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const [selected, setSelected] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const resolvedStatus: FileDropStatus = status ?? (error ? "error" : "idle");
  const shownName = fileName ?? selected[0]?.name;
  const shownSize = selected[0] ? formatSize(selected[0].size) : null;
  const safeProgress =
    typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : null;

  const acceptFiles = React.useCallback(
    (list: FileList | null) => {
      if (!list || disabled) return;
      const files = Array.from(list);
      if (!files.length) return;
      if (!multiple && files.length > 1) files.splice(1);
      if (maxSize !== undefined) {
        const oversized = files.find((file) => file.size > maxSize);
        if (oversized) {
          const message = `${oversized.name} is larger than ${formatSize(maxSize)}.`;
          setError(message);
          onError?.(message);
          return;
        }
      }
      setError(null);
      setSelected(files);
      onFiles?.(files);
    },
    [disabled, maxSize, multiple, onError, onFiles],
  );

  const open = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const stateBorder =
    resolvedStatus === "error"
      ? "border-destructive/60 bg-destructive/5"
      : dragging
        ? "border-primary/70 bg-accent/60"
        : resolvedStatus === "done"
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-border bg-muted/20 hover:border-border/80 hover:bg-accent/40";

  return (
    <div
      data-slot="file-drop"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={title}
      onClick={(event) => {
        onClick?.(event);
        open();
      }}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        acceptFiles(event.dataTransfer.files);
      }}
      className={cn(
        "group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        stateBorder,
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      {...props}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          acceptFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {children ?? (
        <>
          <motion.span
            className="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm"
            initial={false}
            animate={
              dragging && !reduce
                ? { y: -3, scale: 1.04 }
                : { y: 0, scale: 1 }
            }
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
          >
            {icon ?? <UploadIcon />}
          </motion.span>
          <span className="flex flex-col gap-1">
            <span className="text-[13px] font-medium text-foreground">{title}</span>
            <span className="text-[13px] leading-4 text-muted-foreground">{hint}</span>
          </span>

          {shownName ? (
            <span className="flex w-full flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 text-left">
              <span className="flex items-center gap-2 text-[13px] text-foreground">
                <FileIcon />
                <span className="min-w-0 flex-1 truncate">{shownName}</span>
                {shownSize ? (
                  <span className="shrink-0 tabular-nums text-muted-foreground">
                    {shownSize}
                  </span>
                ) : null}
                {resolvedStatus === "done" ? (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckIcon />
                  </span>
                ) : null}
              </span>
              {safeProgress !== null ? (
                <span className="block h-1 overflow-hidden rounded-full bg-border">
                  <motion.span
                    className="block h-full rounded-full bg-primary"
                    initial={false}
                    animate={{ width: `${safeProgress}%` }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 220, damping: 26 }
                    }
                  />
                </span>
              ) : null}
            </span>
          ) : null}

          {error ? (
            <span className="text-[13px] leading-4 text-destructive">{error}</span>
          ) : null}
        </>
      )}
    </div>
  );
}
