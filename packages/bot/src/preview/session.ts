import type { Recipe, RecipeOptions } from "../types";
import { keyframesFor, timingFor } from "./keyframes";

type SavedProp = { value: string; priority: string };

const EASE_OUT = "cubic-bezier(.23,1,.32,1)";

function setProp(el: Element, saved: Map<string, SavedProp>, name: string, value: string, priority = "") {
  const style = (el as HTMLElement).style;
  if (!style) return;
  if (!saved.has(name)) {
    saved.set(name, { value: style.getPropertyValue(name), priority: style.getPropertyPriority(name) });
  }
  style.setProperty(name, value, priority);
}

function restoreProps(el: Element, saved: Map<string, SavedProp>) {
  const style = (el as HTMLElement).style;
  if (!style) return;
  for (const [name, entry] of saved) {
    if (entry.value) style.setProperty(name, entry.value, entry.priority);
    else style.removeProperty(name);
  }
  saved.clear();
}

export class PreviewSession {
  private target: Element | null = null;
  private recipe: Recipe | null = null;
  private options: RecipeOptions = {};
  private animations: Animation[] = [];
  private injected: HTMLElement[] = [];
  private savedProps = new Map<string, SavedProp>();
  private savedNodes: Node[] | null = null;
  private savedText: string | null = null;
  private raf = 0;
  private reduced = false;
  private playing = false;

  get active(): boolean {
    return this.playing;
  }

  get element(): Element | null {
    return this.target;
  }

  get current(): Recipe | null {
    return this.recipe;
  }

  play(target: Element, recipe: Recipe, options: RecipeOptions, reduced: boolean): void {
    this.stop();
    this.target = target;
    this.recipe = recipe;
    this.options = { ...options };
    this.reduced = reduced;
    this.playing = true;
    if (!target.isConnected) {
      this.playing = false;
      return;
    }
    try {
      const computed = getComputedStyle(target);
      if (computed.willChange && computed.willChange !== "auto") {
        this.savedProps.set("will-change", { value: computed.willChange, priority: "" });
      }
      setProp(target, this.savedProps, "will-change", "transform, opacity, filter");
      if (recipe.preview === "text") this.playText(target, recipe);
      else if (recipe.preview === "numeric") this.playNumeric(target, recipe);
      else if (recipe.preview === "injected") this.playInjected(target, recipe);
      else this.playDirect(target, recipe);
    } catch {
      this.stop();
    }
  }

  private supportsComposite(): boolean {
    try {
      const animation = document.createElement("div").animate(
        [{ transform: "translateX(0px)", composite: "add" }],
        { duration: 1 },
      );
      animation.cancel();
      return true;
    } catch {
      return false;
    }
  }

  private playDirect(target: Element, recipe: Recipe) {
    const rect = target.getBoundingClientRect();
    const composite = this.supportsComposite();
    const isStagger = recipe.id === "stagger";
    if (isStagger && target.children.length > 1 && !this.reduced) {
      const stagger = this.options.stagger ?? recipe.defaults.stagger ?? 60;
      const distance = this.options.distance ?? recipe.defaults.distance ?? 12;
      const children = Array.from(target.children).slice(0, 40);
      children.forEach((child, index) => {
        const animation = child.animate(
          [
            { opacity: 0, transform: `translateY(${distance}px)` },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: this.options.duration ?? recipe.defaults.duration ?? 240,
            delay: index * stagger,
            easing: this.options.easing ?? EASE_OUT,
            fill: "none",
          },
        );
        this.animations.push(animation);
      });
      return;
    }
    const frames = keyframesFor(recipe.id, rect, this.options, this.reduced, composite);
    const timing = timingFor(recipe.id, this.options, this.reduced);
    if (recipe.id === "highlight") this.prepareHighlight(target);
    if (recipe.id === "gradient") this.prepareGradient(target);
    const animation = target.animate(frames, timing);
    this.animations.push(animation);
  }

  private prepareHighlight(target: Element) {
    const computed = getComputedStyle(target);
    if (computed.backgroundImage === "none") {
      setProp(
        target,
        this.savedProps,
        "background-image",
        "linear-gradient(transparent 60%, rgba(124,92,255,.32) 60%)",
      );
    }
    setProp(target, this.savedProps, "background-repeat", "no-repeat");
  }

  private prepareGradient(target: Element) {
    setProp(
      target,
      this.savedProps,
      "background-image",
      "linear-gradient(90deg, #7c5cff, #22d3ee, #f472b6, #7c5cff)",
    );
    setProp(target, this.savedProps, "background-size", "200% 100%");
    setProp(target, this.savedProps, "-webkit-background-clip", "text");
    setProp(target, this.savedProps, "background-clip", "text");
    setProp(target, this.savedProps, "color", "transparent");
  }

  private playText(target: Element, recipe: Recipe) {
    if (recipe.id === "split") {
      this.savedNodes = Array.from(target.childNodes);
      const text = target.textContent ?? "";
      const fragment = document.createDocumentFragment();
      const spans: HTMLSpanElement[] = [];
      for (const char of Array.from(text)) {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00a0" : char;
        span.style.display = "inline-block";
        span.style.willChange = "transform, opacity";
        fragment.appendChild(span);
        spans.push(span);
      }
      target.replaceChildren(fragment);
      const stagger = this.options.stagger ?? recipe.defaults.stagger ?? 50;
      const distance = this.options.distance ?? recipe.defaults.distance ?? 150;
      spans.forEach((span, index) => {
        this.animations.push(
          span.animate(
            [
              { opacity: 0, transform: `translateX(${this.reduced ? 0 : distance}px)` },
              { opacity: 1, transform: "translateX(0)" },
            ],
            {
              duration: this.reduced ? 120 : this.options.duration ?? recipe.defaults.duration ?? 700,
              delay: this.reduced ? 0 : index * Math.min(40, stagger),
              easing: this.options.easing ?? EASE_OUT,
              fill: "none",
            },
          ),
        );
      });
      return;
    }
    if (recipe.id === "highlight") this.prepareHighlight(target);
    if (recipe.id === "gradient") this.prepareGradient(target);
    const rect = target.getBoundingClientRect();
    const frames = keyframesFor(recipe.id, rect, this.options, this.reduced, false);
    this.animations.push(target.animate(frames, timingFor(recipe.id, this.options, this.reduced)));
  }

  private playNumeric(target: Element, recipe: Recipe) {
    this.savedNodes = Array.from(target.childNodes);
    this.savedText = target.textContent;
    const raw = target.textContent ?? "";
    const match = /(-?\d[\d\s,.\u202f]*)/.exec(raw);
    if (!match) {
      this.playDirect(target, recipe);
      return;
    }
    const numeric = Number(match[1].replace(/[\s,\u202f]/g, ""));
    if (!Number.isFinite(numeric)) {
      this.playDirect(target, recipe);
      return;
    }
    const before = raw.slice(0, match.index);
    const after = raw.slice(match.index + match[1].length);
    const duration = this.reduced ? 0 : this.options.duration ?? recipe.defaults.duration ?? 900;
    const decimals = match[1].includes(",") || match[1].includes(".") ? 1 : 0;
    const formatter = new Intl.NumberFormat(undefined, {
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    });
    const started = performance.now();
    const tick = (now: number) => {
      if (!this.playing || !this.target) return;
      const progress = duration <= 0 ? 1 : Math.min(1, (now - started) / duration);
      const value = numeric * (1 - Math.pow(1 - progress, 3));
      this.target.textContent = before + formatter.format(value) + after;
      if (progress < 1) this.raf = requestAnimationFrame(tick);
      else this.raf = 0;
    };
    this.raf = requestAnimationFrame(tick);
  }

  private playInjected(target: Element, recipe: Recipe) {
    const rect = target.getBoundingClientRect();
    const computed = getComputedStyle(target);
    if (computed.position === "static") {
      setProp(target, this.savedProps, "position", "relative");
    }
    if (recipe.id === "shine") {
      setProp(target, this.savedProps, "overflow", "hidden");
      const shine = document.createElement("span");
      shine.setAttribute("data-prequel-preview", "shine");
      shine.style.cssText = `position:absolute;inset:-20%;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);transform:translateX(-120%) skewX(-15deg);`;
      target.appendChild(shine);
      this.injected.push(shine);
      this.animations.push(
        shine.animate(
          [
            { transform: "translateX(-120%) skewX(-15deg)" },
            { transform: "translateX(120%) skewX(-15deg)" },
          ],
          {
            duration: this.reduced ? 120 : this.options.duration ?? recipe.defaults.duration ?? 1200,
            easing: this.options.easing ?? "cubic-bezier(.4,0,.2,1)",
            iterations: 1,
          },
        ),
      );
      return;
    }
    if (recipe.id === "ripple") {
      setProp(target, this.savedProps, "overflow", "hidden");
      const size = Math.max(rect.width, rect.height);
      const ring = document.createElement("span");
      ring.setAttribute("data-prequel-preview", "ripple");
      ring.style.cssText = `position:absolute;left:50%;top:50%;width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;border-radius:9999px;background:currentColor;opacity:.18;pointer-events:none;transform:scale(0);`;
      target.appendChild(ring);
      this.injected.push(ring);
      this.animations.push(
        ring.animate(
          [
            { transform: "scale(0)", opacity: 0.28 },
            { transform: "scale(1)", opacity: 0 },
          ],
          {
            duration: this.reduced ? 120 : this.options.duration ?? 600,
            easing: "cubic-bezier(.4,0,.2,1)",
            iterations: 1,
          },
        ),
      );
      return;
    }
    if (recipe.id === "underline") {
      const line = document.createElement("span");
      line.setAttribute("data-prequel-preview", "underline");
      line.style.cssText = `position:absolute;left:0;right:0;bottom:-2px;height:2px;background:currentColor;transform-origin:left;pointer-events:none;`;
      target.appendChild(line);
      this.injected.push(line);
      this.animations.push(
        line.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
          duration: this.reduced ? 120 : this.options.duration ?? 320,
          easing: this.options.easing ?? EASE_OUT,
        }),
      );
      return;
    }
    if (recipe.id === "icon-burst") {
      const count = 6;
      const radius = this.options.distance ?? recipe.defaults.distance ?? 30;
      for (let index = 0; index < count; index += 1) {
        const dot = document.createElement("span");
        const angle = (index / count) * Math.PI * 2;
        dot.setAttribute("data-prequel-preview", "spark");
        dot.style.cssText = `position:absolute;left:50%;top:50%;width:4px;height:4px;margin:-2px;border-radius:9999px;background:currentColor;pointer-events:none;`;
        target.appendChild(dot);
        this.injected.push(dot);
        this.animations.push(
          dot.animate(
            [
              { transform: "translate(0,0) scale(1)", opacity: 1 },
              {
                transform: `translate(${Math.cos(angle) * radius}px,${Math.sin(angle) * radius}px) scale(0)`,
                opacity: 0,
              },
            ],
            { duration: this.reduced ? 120 : this.options.duration ?? 800, easing: EASE_OUT },
          ),
        );
      }
      return;
    }
    this.playDirect(target, recipe);
  }

  replay() {
    if (!this.target || !this.recipe) return;
    this.play(this.target, this.recipe, this.options, this.reduced);
  }

  pause() {
    for (const animation of this.animations) {
      try {
        animation.pause();
      } catch {}
    }
  }

  resume() {
    for (const animation of this.animations) {
      try {
        animation.play();
      } catch {}
    }
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    for (const animation of this.animations) {
      try {
        animation.cancel();
      } catch {}
    }
    this.animations = [];
    for (const node of this.injected) node.remove();
    this.injected = [];
    if (this.target) {
      restoreProps(this.target, this.savedProps);
      if (this.savedNodes) {
        try {
          this.target.replaceChildren(...this.savedNodes);
        } catch {}
      }
      if (this.savedText !== null && !this.savedNodes) {
        try {
          this.target.textContent = this.savedText;
        } catch {}
      }
    }
    this.savedNodes = null;
    this.savedText = null;
    this.target = null;
    this.recipe = null;
    this.playing = false;
  }
}
