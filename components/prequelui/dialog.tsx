"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Slot,
  dialogSpring,
  exitTween,
  flipTransform,
  overlayTween,
  uprightTransform,
  useMounted,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

type Side = "top" | "bottom" | "left" | "right";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: Side;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialog(component: string) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error(`${component} must be used inside <Dialog>.`);
  return context;
}

export type DialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
  side?: Side;
  children?: React.ReactNode;
};

export function Dialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = true,
  side = "top",
  children,
}: DialogProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInternal(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );
  return (
    <DialogContext.Provider value={{ open, setOpen, side }}>
      <div data-slot="dialog" data-modal={modal ? "" : undefined}>
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export function DialogTrigger({ asChild = false, children, onClick, ...props }: DialogTriggerProps) {
  const dialog = useDialog("DialogTrigger");
  const handle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) dialog.setOpen(true);
  };
  if (asChild) {
    return (
      <Slot onClick={handle} aria-haspopup="dialog" aria-expanded={dialog.open}>
        {children}
      </Slot>
    );
  }
  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      aria-haspopup="dialog"
      aria-expanded={dialog.open}
      onClick={handle}
      {...props}
    >
      {children}
    </button>
  );
}

export type DialogContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: Side;
  showClose?: boolean;
  hideOverlay?: boolean;
  transition?: Transition;
  exitTransition?: Transition;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
};

export function DialogContent({
  side,
  showClose = true,
  hideOverlay = false,
  transition,
  exitTransition,
  onEscapeKeyDown,
  className,
  children,
  ...props
}: DialogContentProps) {
  const dialog = useDialog("DialogContent");
  const { open, setOpen } = dialog;
  const reduce = useReduceMotion();
  const mounted = useMounted();
  const ref = React.useRef<HTMLDivElement>(null);
  const edge = side ?? dialog.side;
  const enter = useTempoTransition(transition ?? dialogSpring);
  const leave = useTempoTransition(exitTransition ?? exitTween);

  React.useEffect(() => {
    if (!open || !mounted) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => ref.current?.focus(), 20);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented) setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [open, setOpen, mounted, onEscapeKeyDown]);

  if (!mounted) return null;

  const transform = flipTransform(edge);

  return createPortal(
    <AnimatePresence>
      {dialog.open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {hideOverlay ? null : (
            <motion.button
              type="button"
              aria-label="Close dialog"
              initial={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
              animate={{ backgroundColor: "rgba(0,0,0,0.14)", backdropFilter: "blur(4px)" }}
              exit={{ backgroundColor: "rgba(0,0,0,0)", backdropFilter: "blur(0px)" }}
              transition={overlayTween}
              onClick={() => dialog.setOpen(false)}
              className="absolute inset-0"
            />
          )}
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            data-slot="dialog-content"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, filter: "blur(4px)", transform }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, filter: "blur(0px)", transform: uprightTransform(edge) }
            }
            exit={
              reduce
                ? { opacity: 0, transition: leave }
                : { opacity: 0, filter: "blur(4px)", transition: leave }
            }
            transition={reduce ? { duration: 0.2 } : enter}
            className={cn(
              "relative z-10 w-full max-w-[400px] rounded-xl border bg-popover p-5 text-popover-foreground shadow-2xl outline-none",
              className,
            )}
            {...(props as Record<string, unknown>)}
          >
            {showClose ? (
              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => dialog.setOpen(false)}
                className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function DialogClose({
  asChild = false,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const dialog = useDialog("DialogClose");
  const handle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) dialog.setOpen(false);
  };
  if (asChild) {
    return <Slot onClick={handle}>{children}</Slot>;
  }
  return (
    <button type="button" onClick={handle} {...props}>
      {children}
    </button>
  );
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("pr-6 text-[15px] font-medium", className)} {...props} />;
}

export function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-2 text-[13px] leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-5 flex justify-end gap-2", className)} {...props} />;
}
