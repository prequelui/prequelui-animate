"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export type CodeBlockProps = {
  code: string;
  filename?: string;
  language?: string;
  typing?: boolean;
  className?: string;
};

export function CodeBlock({
  code,
  filename = "example.ts",
  language = "ts",
  typing = true,
  className,
}: CodeBlockProps) {
  const reduce = useReducedMotion();
  const [length, setLength] = React.useState(typing && !reduce ? 0 : code.length);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!typing || reduce) {
      setLength(code.length);
      return;
    }
    setLength(0);
    const timer = window.setInterval(() => {
      setLength((value) => {
        if (value >= code.length) {
          window.clearInterval(timer);
          return value;
        }
        return value + 1;
      });
    }, 14);
    return () => window.clearInterval(timer);
  }, [code, reduce, typing]);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const area = document.createElement("textarea");
      area.value = code;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-code", className)}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="font-mono text-[13px] text-muted-foreground">{filename}</span>
        <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy code"} className="relative flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={copied ? "check" : "copy"} initial={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 0.5, filter: "blur(2px)" }} transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }} className="flex items-center justify-center">
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <pre className="overflow-auto p-4 font-mono text-[13px] leading-6">
        <code>
          {code.slice(0, length)}
          {length < code.length && <span className="animate-pulse">▍</span>}
        </code>
      </pre>
      <span className="sr-only">{language}</span>
    </div>
  );
}
