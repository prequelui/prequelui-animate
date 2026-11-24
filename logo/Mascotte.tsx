"use client";

import * as React from "react";

export type MascotMood = "auto" | "idle" | "happy" | "surprised" | "sleeping";
type VisualMood = Exclude<MascotMood, "auto">;

export type MascotteProps = {
  size?: number;
  mood?: MascotMood;
  className?: string;
  title?: string;
};

const STATE_LABELS: Record<VisualMood, string> = {
  idle: "idle",
  happy: "greeting",
  surprised: "surprised",
  sleeping: "resting",
};

const STYLES = `
.prequel-mascot {
  --pm-disc: #ffffff;
  --pm-ink: #0a0a0a;
  --pm-rim: rgba(10, 10, 10, 0.22);
  --pm-glint: #ffffff;
  --pm-halo: rgba(10, 10, 10, 0.16);
  --pm-halo-y: calc(var(--pm-size) * 0.05);
  --pm-halo-blur: calc(var(--pm-size) * 0.09);
  --pm-look-x: 0;
  --pm-look-y: 0;
  position: relative;
  display: inline-grid;
  place-items: stretch;
  width: var(--pm-size);
  height: var(--pm-size);
  flex: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  vertical-align: middle;
  line-height: 0;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}
.prequel-mascot[data-pm-dark="true"] {
  --pm-disc: #fafafa;
  --pm-ink: #0a0a0a;
  --pm-rim: rgba(255, 255, 255, 0.26);
  --pm-glint: #fafafa;
  --pm-halo: rgba(255, 255, 255, 0.13);
  --pm-halo-y: 0px;
  --pm-halo-blur: calc(var(--pm-size) * 0.095);
}
.prequel-mascot[data-pm-interactive="true"] { cursor: pointer; }
.prequel-mascot[data-pm-interactive="true"]:focus-visible {
  outline: 2px solid rgba(10, 10, 10, 0.42);
  outline-offset: calc(var(--pm-size) * 0.05);
}
.prequel-mascot[data-pm-dark="true"][data-pm-interactive="true"]:focus-visible {
  outline-color: rgba(255, 255, 255, 0.55);
}
.prequel-mascot__body {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: 50% 70%;
  transition: transform 0.34s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}
.prequel-mascot__svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 var(--pm-halo-y) var(--pm-halo-blur) var(--pm-halo));
  animation: prequel-mascot-breathe 5.6s ease-in-out infinite;
}
.prequel-mascot__disc {
  fill: var(--pm-disc);
  stroke: var(--pm-rim);
  stroke-width: 1.1;
  transition: fill 0.3s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.prequel-mascot__eyes {
  transform: translate(calc(var(--pm-look-x) * 1px), calc(var(--pm-look-y) * 1px));
  transition: transform 0.16s ease-out;
}
.prequel-mascot__eyes-open {
  transform: scaleY(1);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.1s ease, opacity 0.16s cubic-bezier(0.22, 1, 0.36, 1);
}
.prequel-mascot[data-pm-blink="true"] .prequel-mascot__eyes-open { transform: scaleY(0.07); }
.prequel-mascot__eye { fill: var(--pm-ink); }
.prequel-mascot__glint { fill: var(--pm-glint); }
.prequel-mascot__eyes-round,
.prequel-mascot__eyes-sleep {
  opacity: 0;
  transform: scale(0.82);
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.15s cubic-bezier(0.22, 1, 0.36, 1), transform 0.24s cubic-bezier(0.34, 1.42, 0.64, 1);
}
.prequel-mascot__eyes-sleep {
  fill: none;
  stroke: var(--pm-ink);
  stroke-width: 2.4;
  stroke-linecap: round;
}
.prequel-mascot__mouth {
  fill: none;
  stroke: var(--pm-ink);
  stroke-width: 2.4;
  stroke-linecap: round;
  opacity: 0;
  transition: opacity 0.16s cubic-bezier(0.22, 1, 0.36, 1);
}
.prequel-mascot__mouth--neutral { opacity: 1; }
.prequel-mascot__mouth--o { fill: var(--pm-ink); stroke: none; }
.prequel-mascot[data-pm-state="happy"] .prequel-mascot__eyes-open { transform: scale(1.035); }
.prequel-mascot[data-pm-state="happy"] .prequel-mascot__mouth--neutral { opacity: 0; }
.prequel-mascot[data-pm-state="happy"] .prequel-mascot__mouth--happy { opacity: 1; }
.prequel-mascot[data-pm-state="happy"] .prequel-mascot__body { transform: translateY(-2.2%) scale(1.01); }
.prequel-mascot[data-pm-state="surprised"] .prequel-mascot__eyes-open { opacity: 0; }
.prequel-mascot[data-pm-state="surprised"] .prequel-mascot__eyes-round { opacity: 1; transform: scale(1); }
.prequel-mascot[data-pm-state="surprised"] .prequel-mascot__mouth--neutral { opacity: 0; }
.prequel-mascot[data-pm-state="surprised"] .prequel-mascot__mouth--o { opacity: 1; }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__eyes-open { opacity: 0; }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__eyes-sleep { opacity: 1; transform: scale(1); }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__mouth--neutral { opacity: 0; }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__mouth--sleep { opacity: 1; }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__body { transform: translateY(1.4%) scale(0.988); }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__svg { animation-duration: 7.6s; }
.prequel-mascot__zzz {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transition: opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.prequel-mascot__zzz text {
  fill: #6e6e68;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 7.5px;
  font-weight: 600;
}
.prequel-mascot[data-pm-dark="true"] .prequel-mascot__zzz text { fill: #a2a29b; }
.prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__zzz {
  opacity: 0.8;
  animation: prequel-mascot-z 3.6s ease-in-out infinite;
}
.prequel-mascot--pop .prequel-mascot__body { animation: prequel-mascot-pop 0.56s cubic-bezier(0.34, 1.42, 0.64, 1); }
.prequel-mascot[data-pm-live="false"] .prequel-mascot__svg,
.prequel-mascot[data-pm-live="false"] .prequel-mascot__zzz { animation: none !important; }
@keyframes prequel-mascot-breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1.2%) scale(1.005); }
}
@keyframes prequel-mascot-pop {
  0% { transform: scale(1); }
  28% { transform: translateY(-3%) scale(1.045); }
  62% { transform: translateY(0) scale(0.987); }
  100% { transform: scale(1); }
}
@keyframes prequel-mascot-z {
  0%, 100% { transform: translate(0, 0); opacity: 0.5; }
  50% { transform: translate(0.9px, -1.7px); opacity: 0.9; }
}
@media (prefers-reduced-motion: reduce) {
  .prequel-mascot__body,
  .prequel-mascot[data-pm-state="happy"] .prequel-mascot__body,
  .prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__body { transform: none; }
  .prequel-mascot__svg,
  .prequel-mascot__zzz,
  .prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__zzz,
  .prequel-mascot--pop .prequel-mascot__body { animation: none !important; }
  .prequel-mascot[data-pm-state="sleeping"] .prequel-mascot__zzz { opacity: 0.8; }
  .prequel-mascot__eyes { transform: none; }
  .prequel-mascot__body,
  .prequel-mascot__eyes,
  .prequel-mascot__eyes-open,
  .prequel-mascot__eyes-round,
  .prequel-mascot__eyes-sleep,
  .prequel-mascot__mouth,
  .prequel-mascot__zzz { transition-duration: 0.001ms; }
}
`;

function usePrefersDark() {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const read = () => {
      const explicit = root.getAttribute("data-theme");
      if (explicit === "dark" || explicit === "light") {
        setDark(explicit === "dark");
        return;
      }
      if (root.classList.contains("dark")) {
        setDark(true);
        return;
      }
      if (root.classList.contains("light")) {
        setDark(false);
        return;
      }
      setDark(media.matches);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    media.addEventListener("change", read);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", read);
    };
  }, []);

  return dark;
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(media.matches);
    read();
    media.addEventListener("change", read);
    return () => media.removeEventListener("change", read);
  }, []);

  return reduced;
}

export function Mascotte({
  size = 96,
  mood = "auto",
  className,
  title = "PrequelUI companion",
}: MascotteProps) {
  const interactive = mood === "auto";
  const [autoMood, setAutoMood] = React.useState<VisualMood>("idle");
  const [blinking, setBlinking] = React.useState(false);
  const dark = usePrefersDark();
  const reduced = useReducedMotion();
  const rootRef = React.useRef<HTMLSpanElement | null>(null);
  const hoveredRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const effective: VisualMood = mood === "auto" ? autoMood : mood;
  const effectiveRef = React.useRef<VisualMood>(effective);
  const surpriseTimer = React.useRef<number | null>(null);
  const popTimer = React.useRef<number | null>(null);
  const previousDark = React.useRef(dark);

  React.useEffect(() => {
    effectiveRef.current = effective;
  }, [effective]);

  React.useEffect(() => {
    return () => {
      if (surpriseTimer.current) window.clearTimeout(surpriseTimer.current);
      if (popTimer.current) window.clearTimeout(popTimer.current);
    };
  }, []);

  React.useEffect(() => {
    if (!interactive) return;

    let last = Date.now();
    let stamp = 0;
    let timer = 0;

    const sleep = () => {
      const remaining = 8000 - (Date.now() - last);
      if (remaining > 80) {
        timer = window.setTimeout(sleep, remaining);
        return;
      }
      setAutoMood("sleeping");
    };

    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(sleep, 8000);
    };

    const activity = () => {
      last = Date.now();
      if (last - stamp < 170) return;
      stamp = last;
      setAutoMood((previous) =>
        previous === "sleeping"
          ? hoveredRef.current || focusedRef.current
            ? "happy"
            : "idle"
          : previous,
      );
      schedule();
    };

    schedule();
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, activity, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, activity));
    };
  }, [interactive]);

  React.useEffect(() => {
    if (!interactive || reduced || (effective !== "idle" && effective !== "happy")) {
      setBlinking(false);
      return;
    }

    let alive = true;
    let next = 0;
    let off = 0;
    let double = 0;

    const schedule = () => {
      next = window.setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        off = window.setTimeout(() => {
          if (alive) setBlinking(false);
        }, 108);
        if (Math.random() < 0.14) {
          double = window.setTimeout(() => {
            if (!alive) return;
            setBlinking(true);
            off = window.setTimeout(() => {
              if (alive) setBlinking(false);
            }, 108);
          }, 235);
        }
        schedule();
      }, 2400 + Math.random() * 3400);
    };

    schedule();

    return () => {
      alive = false;
      window.clearTimeout(next);
      window.clearTimeout(off);
      window.clearTimeout(double);
      setBlinking(false);
    };
  }, [interactive, reduced, effective]);

  React.useEffect(() => {
    if (previousDark.current === dark) return;
    previousDark.current = dark;
    if (!interactive || reduced) return;
    setBlinking(true);
    const timer = window.setTimeout(() => setBlinking(false), 160);
    return () => window.clearTimeout(timer);
  }, [dark, interactive, reduced]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (!interactive || reduced) {
      root.style.setProperty("--pm-look-x", "0");
      root.style.setProperty("--pm-look-y", "0");
      return;
    }

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let hasPointer = false;

    const update = () => {
      frame = 0;
      if (!hasPointer) return;
      if (effectiveRef.current === "sleeping") {
        root.style.setProperty("--pm-look-x", "0");
        root.style.setProperty("--pm-look-y", "0");
        return;
      }
      const rect = root.getBoundingClientRect();
      if (!rect.width) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointerX - centerX;
      const dy = pointerY - centerY;
      const distance = Math.hypot(dx, dy);
      if (distance < 1) {
        root.style.setProperty("--pm-look-x", "0");
        root.style.setProperty("--pm-look-y", "0");
        return;
      }
      const reach = rect.width * 0.55 + 28;
      const strength = Math.min(1, distance / reach);
      root.style.setProperty("--pm-look-x", ((dx / distance) * 2.3 * strength).toFixed(2));
      root.style.setProperty("--pm-look-y", ((dy / distance) * 2.3 * strength).toFixed(2));
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      hasPointer = true;
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [interactive, reduced]);

  const handleEnter = () => {
    hoveredRef.current = true;
    if (!interactive) return;
    setAutoMood((previous) => (previous === "surprised" ? previous : "happy"));
  };

  const handleLeave = () => {
    hoveredRef.current = false;
    if (!interactive || focusedRef.current) return;
    setAutoMood((previous) => (previous === "happy" ? "idle" : previous));
  };

  const handleFocus = () => {
    if (!interactive) return;
    const root = rootRef.current;
    if (!root || !root.matches(":focus-visible")) return;
    focusedRef.current = true;
    setAutoMood((previous) => (previous === "surprised" ? previous : "happy"));
  };

  const handleBlur = () => {
    focusedRef.current = false;
    if (!interactive || hoveredRef.current) return;
    setAutoMood((previous) => (previous === "happy" ? "idle" : previous));
  };

  const handleClick = () => {
    if (!interactive) return;
    setAutoMood("surprised");

    const root = rootRef.current;
    if (root && !reduced) {
      root.classList.remove("prequel-mascot--pop");
      void root.offsetWidth;
      root.classList.add("prequel-mascot--pop");
      if (popTimer.current) window.clearTimeout(popTimer.current);
      popTimer.current = window.setTimeout(() => {
        root.classList.remove("prequel-mascot--pop");
      }, 620);
    }

    if (surpriseTimer.current) window.clearTimeout(surpriseTimer.current);
    surpriseTimer.current = window.setTimeout(() => {
      setAutoMood(hoveredRef.current || focusedRef.current ? "happy" : "idle");
    }, 900);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;
    event.preventDefault();
    handleClick();
  };

  const label = interactive
    ? `${title}, ${STATE_LABELS[effective]}. Press Enter or Space to surprise it.`
    : `${title}, ${STATE_LABELS[effective]}`;

  return (
    <>
      <style>{STYLES}</style>
      <span
        ref={rootRef}
        role={interactive ? "button" : "img"}
        tabIndex={interactive ? 0 : undefined}
        aria-label={label}
        className={className ? `prequel-mascot ${className}` : "prequel-mascot"}
        data-pm-state={effective}
        data-pm-dark={dark ? "true" : "false"}
        data-pm-live={interactive ? "true" : "false"}
        data-pm-interactive={interactive ? "true" : "false"}
        data-pm-blink={blinking ? "true" : "false"}
        style={{ "--pm-size": `${size}px` } as React.CSSProperties}
        onPointerEnter={interactive ? handleEnter : undefined}
        onPointerLeave={interactive ? handleLeave : undefined}
        onFocus={interactive ? handleFocus : undefined}
        onBlur={interactive ? handleBlur : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        onClick={interactive ? handleClick : undefined}
      >
        <span className="prequel-mascot__body">
          <svg
            className="prequel-mascot__svg"
            viewBox="0 0 64 64"
            aria-hidden="true"
            focusable="false"
          >
            <circle className="prequel-mascot__disc" cx="32" cy="32" r="27" />
            <g className="prequel-mascot__eyes" aria-hidden="true">
              <g className="prequel-mascot__eyes-open">
                <g className="prequel-mascot__eye">
                  <rect x="22.9" y="24.4" width="4.7" height="7.2" rx="2.35" />
                  <circle className="prequel-mascot__glint" cx="24.2" cy="26.5" r="0.95" />
                </g>
                <g className="prequel-mascot__eye">
                  <rect x="36.4" y="24.4" width="4.7" height="7.2" rx="2.35" />
                  <circle className="prequel-mascot__glint" cx="37.7" cy="26.5" r="0.95" />
                </g>
              </g>
              <g className="prequel-mascot__eyes-round">
                <g className="prequel-mascot__eye">
                  <circle cx="25.25" cy="28" r="3.45" />
                  <circle className="prequel-mascot__glint" cx="24.1" cy="26.9" r="1" />
                </g>
                <g className="prequel-mascot__eye">
                  <circle cx="38.75" cy="28" r="3.45" />
                  <circle className="prequel-mascot__glint" cx="37.6" cy="26.9" r="1" />
                </g>
              </g>
              <g className="prequel-mascot__eyes-sleep">
                <path d="M22.7 28.3q2.55 2.3 5.1 0" />
                <path d="M36.2 28.3q2.55 2.3 5.1 0" />
              </g>
            </g>
            <g className="prequel-mascot__mouths" aria-hidden="true">
              <path
                className="prequel-mascot__mouth prequel-mascot__mouth--neutral"
                d="M26.2 39.4Q32 43 37.8 39.4"
              />
              <path
                className="prequel-mascot__mouth prequel-mascot__mouth--happy"
                d="M25.3 38.7Q32 44.8 38.7 38.7"
              />
              <ellipse
                className="prequel-mascot__mouth prequel-mascot__mouth--o"
                cx="32"
                cy="41.3"
                rx="2.5"
                ry="3.1"
              />
              <path
                className="prequel-mascot__mouth prequel-mascot__mouth--sleep"
                d="M29.2 40.6q2.8 1.2 5.6 0"
              />
            </g>
            <g className="prequel-mascot__zzz" aria-hidden="true">
              <text x="51.8" y="11.4">z</text>
            </g>
          </svg>
        </span>
      </span>
    </>
  );
}

export default Mascotte;
