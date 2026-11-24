import type { RecipeOptions } from "../types";
import { getRecipe } from "../recipes/catalog";

const EASE_OUT = "cubic-bezier(.23,1,.32,1)";
const EASE_SOFT = "cubic-bezier(.215,.61,.355,1)";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function springDuration(
  spring: { stiffness: number; damping: number; mass?: number } | undefined,
  fallback = 260,
): number {
  if (!spring) return fallback;
  const stiffness = Math.max(40, spring.stiffness);
  const damping = Math.max(4, spring.damping);
  const estimated = 1000 / Math.sqrt(stiffness) * 6 + (40 - damping) * 3;
  return Math.round(clamp(estimated, 160, 700));
}

export function resolveDuration(recipeId: string, options: RecipeOptions): number {
  if (typeof options.duration === "number") return Math.round(clamp(options.duration, 80, 4000));
  const recipe = getRecipe(recipeId);
  if (recipe?.defaults.duration !== undefined) return recipe.defaults.duration;
  return springDuration(options.spring ?? recipe?.defaults.spring, 260);
}

export function resolveEasing(options: RecipeOptions): string {
  return options.easing ?? EASE_OUT;
}

export function resolveDistance(options: RecipeOptions, fallback = 16): number {
  return options.distance ?? fallback;
}

export function resolveScale(options: RecipeOptions, fallback = 0.92): number {
  return options.scale ?? fallback;
}

export function resolveIntensity(options: RecipeOptions, fallback = 1): number {
  return clamp(options.intensity ?? fallback, 0.05, 2);
}

function addComposite(frames: Keyframe[], enabled: boolean): Keyframe[] {
  if (!enabled) return frames;
  return frames.map((frame) =>
    typeof frame.transform === "string" ? { ...frame, composite: "add" } : frame,
  );
}

export function keyframesFor(
  recipeId: string,
  rect: { width: number; height: number },
  options: RecipeOptions,
  reduced: boolean,
  composite = false,
): Keyframe[] {
  const recipe = getRecipe(recipeId);
  const distance = resolveDistance(options, recipe?.defaults.distance ?? 16);
  const scale = resolveScale(options, recipe?.defaults.scale ?? 0.94);
  const intensity = resolveIntensity(options, recipe?.defaults.intensity ?? 1);
  const stagger = options.stagger ?? recipe?.defaults.stagger ?? 50;

  const frames = ((): Keyframe[] => {
    switch (recipeId) {
      case "fade":
        return [{ opacity: 0 }, { opacity: 1 }];
      case "blur":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, filter: `blur(${Math.round(10 * intensity)}px)` },
              { opacity: 1, filter: "blur(0px)" },
            ];
      case "slide":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateY(${Math.round(distance)}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ];
      case "zoom":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `scale(${scale})` },
              { opacity: 1, transform: "scale(1)" },
            ];
      case "stagger":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateY(${Math.round(distance)}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ];
      case "press":
        if (reduced) return [{ transform: "scale(1)" }, { transform: "scale(1)" }];
        return [
          { transform: "scale(1)", offset: 0 },
          { transform: `scale(${scale})`, offset: 0.18 },
          { transform: "scale(1)", offset: 0.36 },
          { transform: `scale(${scale})`, offset: 0.62 },
          { transform: "scale(1)", offset: 1 },
        ];
      case "magnetic": {
        if (reduced) return [{ transform: "translate(0px,0px)" }, { transform: "translate(0px,0px)" }];
        const reach = Math.min(distance, 120) * (0.25 + intensity * 0.5);
        return [
          { transform: "translate(0px,0px)", offset: 0 },
          { transform: `translate(${reach}px,${-reach * 0.4}px)`, offset: 0.3 },
          { transform: `translate(${-reach * 0.7}px,${reach * 0.3}px)`, offset: 0.62 },
          { transform: "translate(0px,0px)", offset: 1 },
        ];
      }
      case "tilt": {
        if (reduced) return [{ transform: "none" }, { transform: "none" }];
        const deg = Math.min(20, Math.max(2, intensity * 10));
        const perspective = options.distance ?? 800;
        return [
          { transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`, offset: 0 },
          {
            transform: `perspective(${perspective}px) rotateX(${-deg * 0.7}deg) rotateY(${deg * 0.8}deg)`,
            offset: 0.35,
          },
          {
            transform: `perspective(${perspective}px) rotateX(${deg * 0.5}deg) rotateY(${-deg * 0.6}deg)`,
            offset: 0.7,
          },
          { transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`, offset: 1 },
        ];
      }
      case "image-zoom": {
        if (reduced) return [{ transform: "scale(1)" }, { transform: "scale(1)" }];
        const zoom = options.scale ?? 1.6;
        return [
          { transform: "scale(1)" },
          { transform: `scale(${zoom})` },
          { transform: "scale(1)" },
        ];
      }
      case "highlight": {
        if (reduced) {
          return [
            { backgroundSize: "100% 40%" },
            { backgroundSize: "100% 40%" },
          ];
        }
        return [
          { backgroundSize: "0% 40%" },
          { backgroundSize: "100% 40%" },
        ];
      }
      case "typing":
        return reduced
          ? [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 0 0)" }]
          : [
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0 0 0)" },
            ];
      case "gradient":
        return reduced
          ? [{ backgroundPosition: "0% 50%" }, { backgroundPosition: "0% 50%" }]
          : [
              { backgroundPosition: "0% 50%" },
              { backgroundPosition: "200% 50%" },
            ];
      case "flip":
        if (reduced) return [{ opacity: 0 }, { opacity: 1 }];
        return [
          { transform: "perspective(900px) rotateY(0deg)" },
          { transform: "perspective(900px) rotateY(180deg)" },
          { transform: "perspective(900px) rotateY(0deg)" },
        ];
      case "focus-ring": {
        const spread = reduced ? 3 : 5;
        return [
          { boxShadow: "0 0 0 0 rgba(124,92,255,0)" },
          { boxShadow: `0 0 0 ${spread}px rgba(124,92,255,.45), 0 0 24px rgba(124,92,255,.35)` },
          { boxShadow: `0 0 0 ${spread}px rgba(124,92,255,.45), 0 0 24px rgba(124,92,255,.35)` },
        ];
      }
      case "scroll-fade":
        return [
          { maskImage: "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)" },
          { maskImage: "linear-gradient(to bottom, black, black)" },
        ];
      case "accordion":
        return reduced
          ? [{ opacity: 1 }, { opacity: 1 }]
          : [
              { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
              { clipPath: "inset(0 0 0 0)", opacity: 1 },
            ];
      case "dialog":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateY(${resolveDistance(options, 8)}px) scale(${scale})`, filter: "blur(8px)" },
              { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
            ];
      case "toast":
        return reduced
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: `translateY(${resolveDistance(options, -16)}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ];
      case "switch":
        if (reduced) return [{ transform: "translateX(0px)" }, { transform: "translateX(0px)" }];
        return [
          { transform: "translateX(0px) scaleX(1)" },
          { transform: `translateX(${resolveDistance(options, 8)}px) scaleX(1.08)` },
          { transform: `translateX(${resolveDistance(options, 8)}px) scaleX(1)` },
        ];
      case "checkbox":
        return reduced
          ? [{ transform: "scale(1)" }, { transform: "scale(1)" }]
          : [
              { transform: `scale(${scale})` },
              { transform: "scale(1.06)" },
              { transform: "scale(1)" },
            ];
      default:
        return [{ opacity: 0 }, { opacity: 1 }];
    }
  })();

  if (
    (recipeId === "stagger" || recipeId === "split") &&
    !reduced &&
    options.stagger !== undefined
  ) {
    return frames.map((frame, index) => ({
      ...frame,
      delay: index === 0 ? 0 : Math.min(stagger, 80),
    }));
  }

  const compositeIds = new Set([
    "slide",
    "zoom",
    "press",
    "magnetic",
    "tilt",
    "image-zoom",
    "flip",
    "dialog",
    "toast",
    "switch",
    "checkbox",
  ]);
  return composite && compositeIds.has(recipeId) ? addComposite(frames, true) : frames;
}

export function timingFor(
  recipeId: string,
  options: RecipeOptions,
  reduced: boolean,
): KeyframeAnimationOptions {
  const duration = resolveDuration(recipeId, options);
  const loop = options.loop ?? false;
  const repeating = ["magnetic", "tilt", "image-zoom", "flip", "switch", "checkbox"].includes(
    recipeId,
  );
  const iterations = loop ? Number.POSITIVE_INFINITY : repeating ? 2 : 1;
  if (reduced) {
    return {
      duration: Math.min(duration, 160),
      easing: "linear",
      iterations,
      fill: "none",
    };
  }
  const easing =
    recipeId === "typing"
      ? `steps(${Math.max(6, Math.round((options.duration ?? 1000) / 40))}, end)`
      : recipeId === "accordion"
        ? EASE_SOFT
        : resolveEasing(options);
  return {
    duration,
    easing,
    iterations,
    fill: "none",
  };
}

export const KEYFRAME_EASING = EASE_OUT;
