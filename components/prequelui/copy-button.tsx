"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import {
  blurIcon,
  swapTween,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

type CopyContextValue = { copied: boolean };

const CopyContext = React.createContext<CopyContextValue | null>(null);

function useCopyState() {
  const value = React.useContext(CopyContext);
  if (!value) throw new Error("CopyButtonIcon must be used inside CopyButton");
  return value;
}

export type CopyButtonProps = ButtonProps & {
  content: string;
  copied?: boolean;
  defaultCopied?: boolean;
  onCopiedChange?: (copied: boolean, content?: string) => void;
  delay?: number;
};

export function CopyButton({
  content,
  copied,
  defaultCopied = false,
  onCopiedChange,
  delay = 3000,
  onClick,
  className,
  ...props
}: CopyButtonProps) {
  const [inner, setInner] = React.useState(defaultCopied);
  const isCopied = copied ?? inner;
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  const setCopied = (value: boolean) => {
    if (copied === undefined) setInner(value);
    onCopiedChange?.(value, content);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !content || isCopied) return;
    navigator.clipboard
      ?.writeText(content)
      .then(() => {
        setCopied(true);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setCopied(false), delay);
      })
      .catch(() => {
        setCopied(true);
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setCopied(false), delay);
      });
  };

  return (
    <CopyContext.Provider value={{ copied: isCopied }}>
      <Button
        data-slot="copy-button"
        data-copied={isCopied ? "" : undefined}
        onClick={handleClick}
        className={cn(
          "border bg-background text-foreground hover:bg-accent",
          className,
        )}
        {...props}
      />
    </CopyContext.Provider>
  );
}

export type CopyButtonIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  icon: React.ReactNode;
  copiedIcon: React.ReactNode;
  transition?: Transition;
};

export function CopyButtonIcon({
  icon,
  copiedIcon,
  transition,
  className,
  ...props
}: CopyButtonIconProps) {
  const { copied } = useCopyState();
  const reduce = useReduceMotion();
  const tween = useTempoTransition(transition ?? swapTween);
  const hidden = reduce
    ? { opacity: 0, filter: blurIcon }
    : { opacity: 0, scale: 0.5, filter: blurIcon };
  const shown = reduce
    ? { opacity: 1, filter: "blur(0px)" }
    : { opacity: 1, scale: 1, filter: "blur(0px)" };

  return (
    <span
      data-slot="copy-button-icon"
      className={cn("relative inline-flex size-4 items-center justify-center", className)}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "copied" : "copy"}
          aria-hidden="true"
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={tween}
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          {copied ? copiedIcon : icon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function useCopyButton() {
  return useCopyState();
}
