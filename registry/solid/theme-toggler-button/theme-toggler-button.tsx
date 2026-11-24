import { Monitor, Moon, Sun } from "lucide-solid";
import { animate } from "motion";
import { createMemo } from "solid-js";
import type { JSX } from "solid-js";

type ThemeSelection = "light" | "dark" | "system";

export type ThemeTogglerButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ThemeSelection;
  resolvedTheme?: "light" | "dark";
  modes?: ThemeSelection[];
  onThemeChange?: (theme: ThemeSelection) => void;
};

export function ThemeTogglerButton(props: ThemeTogglerButtonProps) {
  let button: HTMLButtonElement | undefined;
  const modes = () => props.modes ?? ["light", "dark", "system"];
  const current = () => props.theme ?? "light";
  const next = createMemo(() => {
    let index = modes().indexOf(current());
    if (index === -1) index = modes().indexOf(props.resolvedTheme ?? "light");
    if (index === -1) return modes()[0] ?? props.resolvedTheme ?? "light";
    return modes()[(index + 1) % modes().length]!;
  });

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const press = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 0.97 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const release = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const iconClass = (name: string) =>
    `absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
      current() === name
        ? "rotate-0 scale-100 opacity-100 blur-0"
        : "-rotate-90 scale-50 opacity-0 blur-[2px]"
    }`;

  return (
    <button
      {...props}
      ref={button}
      type={props.type ?? "button"}
      data-slot="theme-toggler-button"
      data-theme={current()}
      aria-label={`Switch to ${next()} theme`}
      class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
      onClick={(event) => {
        if (typeof props.onClick === "function") props.onClick(event);
        if (!event.defaultPrevented) props.onThemeChange?.(next());
      }}
      onPointerDown={(event) => {
        if (typeof props.onPointerDown === "function") props.onPointerDown(event);
        press();
      }}
      onPointerUp={(event) => {
        if (typeof props.onPointerUp === "function") props.onPointerUp(event);
        release();
      }}
      onPointerLeave={(event) => {
        if (typeof props.onPointerLeave === "function") props.onPointerLeave(event);
        release();
      }}
    >
      <span class="relative inline-flex size-4 items-center justify-center">
        <Sun aria-hidden="true" class={iconClass("light")} />
        <Moon aria-hidden="true" class={iconClass("dark")} />
        <Monitor aria-hidden="true" class={iconClass("system")} />
      </span>
      {props.children ?? current()}
    </button>
  );
}
