"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ComboboxOption = { value: string; label: string };
export type ComboboxProps = {
  options?: ComboboxOption[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
};

const FALLBACK: ComboboxOption[] = [
  { value: "base-ui", label: "Base UI" },
  { value: "radix-ui", label: "Radix UI" },
  { value: "react-aria", label: "React Aria" },
  { value: "reka-ui", label: "Reka UI" },
];

const soft = [0.215, 0.61, 0.355, 1] as const;

export function Combobox({
  options = FALLBACK,
  placeholder = "Pick a library",
  defaultValue = "",
  onChange,
  className,
}: ComboboxProps) {
  const [value, setValue] = React.useState(defaultValue);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);

  const filtered = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (option: ComboboxOption) => {
    setValue(option.value);
    setQuery(option.label);
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div ref={root} className={cn("relative w-56 text-[13px]", className)}>
      <div className="flex h-9 items-center rounded-lg border bg-background px-2.5">
        <input
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-list"
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActive((index) => Math.min(filtered.length - 1, index + 1));
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              setActive((index) => Math.max(0, index - 1));
            } else if (event.key === "Enter" && filtered[active]) {
              choose(filtered[active]);
            } else if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="combobox-list"
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2, transition: { duration: 0.15, ease: [0, 0, 0.58, 1] } }}
            transition={{ duration: 0.22, ease: soft }}
            className="absolute top-full z-40 mt-1.5 w-full rounded-xl border bg-background p-1 shadow-xl"
          >
            {filtered.length === 0 && (
              <li className="px-2 py-2 text-muted-foreground">No result</li>
            )}
            {filtered.map((option, index) => (
              <motion.li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                initial={reduce ? false : { opacity: 0, y: -4, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.2, ease: soft, delay: index * 0.03 }}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(option)}
                className="relative flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
              >
                {option.label}
                {option.value === value && <Check className="size-3.5" />}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
