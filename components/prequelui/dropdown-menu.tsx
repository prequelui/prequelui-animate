"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { easeSoft, menuTween, useReduceMotion, useTempoTransition } from "./motion";

type Align = "start" | "center" | "end";

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  align: Align;
  sideOffset: number;
};

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenu(component: string) {
  const context = React.useContext(MenuContext);
  if (!context) throw new Error(`${component} must be used inside <DropdownMenu>.`);
  return context;
}

export type DropdownMenuProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: Align;
  sideOffset?: number;
  children?: React.ReactNode;
};

export function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  sideOffset = 8,
  children,
}: DropdownMenuProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internal;
  const root = React.useRef<HTMLSpanElement>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInternal(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <MenuContext.Provider value={{ open, setOpen, align, sideOffset }}>
      <span ref={root} data-slot="dropdown-menu" className="relative inline-flex">
        {children}
      </span>
    </MenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild = false,
  className,
  children,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const menu = useMenu("DropdownMenuTrigger");
  const handle = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) menu.setOpen(!menu.open);
  };
  if (asChild) {
    return (
      <span
        onClick={(event) => {
          handle(event as unknown as React.MouseEvent<HTMLButtonElement>);
        }}
        aria-haspopup="menu"
        aria-expanded={menu.open}
      >
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={menu.open}
      data-state={menu.open ? "open" : "closed"}
      onClick={handle}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

const alignClasses: Record<Align, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

export type DropdownMenuContentProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: Align;
  sideOffset?: number;
  transition?: Transition;
};

export function DropdownMenuContent({
  align,
  sideOffset,
  transition,
  className,
  children,
  ...props
}: DropdownMenuContentProps) {
  const menu = useMenu("DropdownMenuContent");
  const reduce = useReduceMotion();
  const edge = align ?? menu.align;
  const offset = sideOffset ?? menu.sideOffset;
  const enter = useTempoTransition(transition ?? menuTween);
  const indexed = React.Children.toArray(children).map((child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<{ index?: number }>, { index })
      : child,
  );

  return (
    <AnimatePresence>
      {menu.open ? (
        <motion.div
          role="menu"
          data-slot="dropdown-menu-content"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: -4, filter: "blur(2px)" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.15 } }
              : { opacity: 0, scale: 0.95, y: -2, filter: "blur(2px)", transition: { duration: 0.15 } }
          }
          transition={reduce ? { duration: 0.2 } : enter}
          style={{ transformOrigin: edge === "end" ? "top right" : edge === "center" ? "top center" : "top left", marginTop: offset }}
          className={cn(
            "absolute top-full z-50 min-w-[180px] rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg",
            alignClasses[edge],
            className,
          )}
          {...(props as Record<string, unknown>)}
        >
          {indexed}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export type DropdownMenuItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  inset?: boolean;
  index?: number;
  onSelect?: () => void;
};

export function DropdownMenuItem({
  inset = false,
  index = 0,
  onSelect,
  className,
  children,
  onClick,
  ...props
}: DropdownMenuItemProps) {
  const menu = useMenu("DropdownMenuItem");
  return (
    <motion.button
      type="button"
      role="menuitem"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.18, ease: easeSoft }}
      onClick={(event) => {
        onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
        if (!event.defaultPrevented) {
          onSelect?.();
          menu.setOpen(false);
        }
      }}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none",
        inset && "pl-8",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  );
}

export function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2.5 py-1.5 text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground", className)}
      {...props}
    />
  );
}
