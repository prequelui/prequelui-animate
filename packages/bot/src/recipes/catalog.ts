import type { ProposalContext, Recipe, TargetSnapshot } from "../types";

const numberPattern = /(?:\d[\d\s,.\u202f]*\d|\d)/;

function hasNumber(target: TargetSnapshot): boolean {
  return Boolean(target.text && numberPattern.test(target.text));
}

function fitsScreen(target: TargetSnapshot, ctx: ProposalContext): boolean {
  return target.box.w <= ctx.viewportW * 0.8 && target.box.h <= ctx.viewportH * 0.7;
}

function leafText(target: TargetSnapshot): boolean {
  return target.isTextLeaf && !target.hasFormField;
}

export const RECIPES: Recipe[] = [
  {
    id: "fade",
    title: "Fade",
    family: "opacity",
    registry: ["fade"],
    trigger: "enter",
    properties: ["opacity"],
    defaults: { duration: 200, easing: "cubic-bezier(.23,1,.32,1)" },
    preview: "direct",
    reduced: "same",
    description: "A quiet opacity entrance that never distracts.",
    compatible: () => true,
  },
  {
    id: "blur",
    title: "Blur in",
    family: "filter",
    registry: ["blur"],
    trigger: "enter",
    properties: ["opacity", "filter"],
    defaults: { duration: 260, spring: { stiffness: 200, damping: 20 }, distance: 10 },
    preview: "direct",
    reduced: "fade",
    description: "Softens the edge of the element, then brings it into focus.",
    compatible: () => true,
  },
  {
    id: "slide",
    title: "Slide up",
    family: "transform",
    registry: ["slide"],
    trigger: "enter",
    properties: ["transform", "opacity"],
    defaults: { duration: 220, spring: { stiffness: 200, damping: 20 }, distance: 16 },
    preview: "direct",
    reduced: "fade",
    description: "Lifts the element into place from below.",
    compatible: () => true,
  },
  {
    id: "zoom",
    title: "Zoom in",
    family: "scale",
    registry: ["zoom"],
    trigger: "enter",
    properties: ["transform", "opacity"],
    defaults: { duration: 220, spring: { stiffness: 200, damping: 20 }, scale: 0.92 },
    preview: "direct",
    reduced: "fade",
    description: "Settles the element from a slightly smaller size.",
    compatible: () => true,
  },
  {
    id: "stagger",
    title: "Cascade",
    family: "stagger",
    registry: ["effect"],
    trigger: "enter",
    properties: ["transform", "opacity"],
    defaults: { duration: 240, spring: { stiffness: 200, damping: 20 }, distance: 12, stagger: 60 },
    preview: "direct",
    reduced: "fade",
    description: "Sends the children in one after another.",
    compatible: (target) => target.childCount >= 2 || ["list", "section", "table", "form"].includes(target.kind),
  },
  {
    id: "press",
    title: "Press",
    family: "press",
    registry: ["button"],
    trigger: "press",
    properties: ["transform"],
    defaults: { spring: { stiffness: 550, damping: 30 }, scale: 0.97 },
    preview: "simulated",
    reduced: "off",
    description: "A short, firm squish that answers every tap.",
    compatible: (target) => target.kind === "button" && target.box.w >= 24 && target.box.h >= 24,
  },
  {
    id: "ripple",
    title: "Ripple",
    family: "ripple",
    registry: ["ripple-button"],
    trigger: "click",
    properties: ["transform", "opacity"],
    defaults: { duration: 600, easing: "cubic-bezier(.4,0,.2,1)", scale: 1 },
    preview: "injected",
    reduced: "fade",
    description: "A ring spreads from the click and fades away.",
    compatible: (target) => target.kind === "button",
  },
  {
    id: "magnetic",
    title: "Magnetic",
    family: "pointer",
    registry: ["magnetic"],
    trigger: "hover",
    properties: ["transform"],
    defaults: { spring: { stiffness: 100, damping: 10, mass: 0.5 }, distance: 120, intensity: 0.5 },
    preview: "simulated",
    reduced: "off",
    description: "The element leans toward the pointer without following it.",
    compatible: (target, ctx) =>
      ["button", "link", "icon", "card"].includes(target.kind) &&
      target.box.h <= 160 &&
      target.box.w <= ctx.viewportW * 0.5 &&
      fitsScreen(target, ctx),
  },
  {
    id: "tilt",
    title: "Tilt",
    family: "pointer3d",
    registry: ["tilt"],
    trigger: "hover",
    properties: ["transform"],
    defaults: { spring: { stiffness: 300, damping: 25, mass: 0.5 }, intensity: 10, distance: 800 },
    preview: "simulated",
    reduced: "off",
    description: "A gentle 3D lean that follows the cursor across the surface.",
    compatible: (target, ctx) =>
      ["card", "image", "badge", "avatar"].includes(target.kind) &&
      target.box.w >= 120 &&
      target.box.h >= 80 &&
      fitsScreen(target, ctx),
  },
  {
    id: "shine",
    title: "Shine",
    family: "shine",
    registry: ["shine"],
    trigger: "hover",
    properties: ["transform", "opacity"],
    defaults: { duration: 1200, easing: "cubic-bezier(.4,0,.2,1)", intensity: 0.3 },
    preview: "injected",
    reduced: "instant",
    description: "A soft band of light crosses the surface once.",
    compatible: (target) => ["card", "badge", "avatar", "button", "image"].includes(target.kind),
  },
  {
    id: "image-zoom",
    title: "Image zoom",
    family: "media",
    registry: ["image-zoom"],
    trigger: "hover",
    properties: ["transform"],
    defaults: { spring: { stiffness: 200, damping: 28 }, scale: 1.6 },
    preview: "simulated",
    reduced: "off",
    description: "The image grows slowly as if you moved closer.",
    compatible: (target) => target.kind === "image" || target.kind === "media",
  },
  {
    id: "highlight",
    title: "Marker",
    family: "text-highlight",
    registry: ["highlight-text"],
    trigger: "enter",
    properties: ["background-size"],
    defaults: { duration: 2000, easing: "ease-in-out" },
    preview: "text",
    reduced: "instant",
    description: "A highlighter sweeps behind the words.",
    compatible: (target) =>
      ["text", "heading", "list-item"].includes(target.kind) &&
      leafText(target) &&
      target.textLength > 0 &&
      target.textLength <= 240,
  },
  {
    id: "split",
    title: "Split in",
    family: "text-split",
    registry: ["splitting-text"],
    trigger: "enter",
    properties: ["transform", "opacity"],
    defaults: { duration: 700, easing: "cubic-bezier(.23,1,.32,1)", distance: 150, stagger: 50 },
    preview: "text",
    reduced: "fade",
    description: "Letters slide in from the side in a tight cascade.",
    compatible: (target) =>
      ["heading", "text"].includes(target.kind) &&
      leafText(target) &&
      target.textLength > 0 &&
      target.textLength <= 160,
  },
  {
    id: "typing",
    title: "Typing",
    family: "text-typing",
    registry: ["typing-text"],
    trigger: "enter",
    properties: ["clip-path"],
    defaults: { duration: 1000, easing: "steps(24, end)" },
    preview: "text",
    reduced: "instant",
    description: "Reveals the sentence one character at a time.",
    compatible: (target) =>
      ["heading", "text"].includes(target.kind) &&
      leafText(target) &&
      target.textLength > 0 &&
      target.textLength <= 200,
  },
  {
    id: "gradient",
    title: "Gradient drift",
    family: "text-gradient",
    registry: ["gradient-text"],
    trigger: "loop",
    properties: ["background-position"],
    defaults: { duration: 6000, easing: "linear" },
    preview: "text",
    reduced: "instant",
    description: "A slow colour drift across the letters.",
    compatible: (target) =>
      ["heading", "text"].includes(target.kind) && target.textLength > 1 && target.textLength <= 80,
  },
  {
    id: "count",
    title: "Count up",
    family: "numeric",
    registry: ["counting-number"],
    trigger: "enter",
    properties: ["text"],
    defaults: { duration: 900, spring: { stiffness: 90, damping: 50 } },
    preview: "numeric",
    reduced: "instant",
    description: "Runs the number up from zero to its final value.",
    compatible: (target) => ["stat", "text", "heading"].includes(target.kind) && hasNumber(target),
  },
  {
    id: "odometer",
    title: "Odometer",
    family: "numeric-roll",
    registry: ["sliding-number"],
    trigger: "enter",
    properties: ["text", "transform"],
    defaults: { duration: 900, spring: { stiffness: 200, damping: 20, mass: 0.4 } },
    preview: "numeric",
    reduced: "instant",
    description: "Rolls each digit to its final position.",
    compatible: (target) => ["stat", "text", "heading"].includes(target.kind) && hasNumber(target),
  },
  {
    id: "flip",
    title: "Flip",
    family: "flip",
    registry: ["flip-button"],
    trigger: "hover",
    properties: ["transform"],
    defaults: { duration: 500, easing: "cubic-bezier(.23,1,.32,1)" },
    preview: "simulated",
    reduced: "fade",
    description: "Turns the face over to show its back.",
    compatible: (target) => ["button", "card", "badge"].includes(target.kind),
  },
  {
    id: "underline",
    title: "Underline",
    family: "underline",
    registry: ["highlight"],
    trigger: "hover",
    properties: ["transform"],
    defaults: { spring: { stiffness: 500, damping: 40 } },
    preview: "injected",
    reduced: "instant",
    description: "A line grows under the label and follows its width.",
    compatible: (target) => ["link", "nav", "list-item"].includes(target.kind),
  },
  {
    id: "icon-burst",
    title: "Icon burst",
    family: "burst",
    registry: ["icon-button"],
    trigger: "click",
    properties: ["transform", "opacity"],
    defaults: { duration: 800, easing: "cubic-bezier(.23,1,.32,1)", distance: 30 },
    preview: "injected",
    reduced: "off",
    description: "Six tiny sparks jump away from the icon.",
    compatible: (target) =>
      (target.kind === "icon" || target.kind === "button") &&
      target.box.w <= 96 &&
      target.box.h <= 96,
  },
  {
    id: "focus-ring",
    title: "Focus glow",
    family: "focus",
    registry: ["highlight"],
    trigger: "focus",
    properties: ["box-shadow", "opacity"],
    defaults: { duration: 160, easing: "cubic-bezier(.23,1,.32,1)" },
    preview: "simulated",
    reduced: "instant",
    description: "A clear ring and halo appear without moving the field.",
    compatible: (target) => ["input", "button", "link"].includes(target.kind),
  },
  {
    id: "scroll-fade",
    title: "Edge fade",
    family: "scroll",
    registry: ["scroll-fade"],
    trigger: "scroll",
    properties: ["mask-image"],
    defaults: { duration: 200, easing: "linear" },
    preview: "direct",
    reduced: "instant",
    description: "Fades the edges of a long surface while it scrolls.",
    compatible: (target) =>
      ["section", "list", "table"].includes(target.kind) && target.box.h >= 160,
  },
  {
    id: "accordion",
    title: "Unfold",
    family: "layout",
    registry: ["accordion"],
    trigger: "click",
    properties: ["clip-path", "opacity"],
    defaults: { duration: 350, easing: "cubic-bezier(.215,.61,.355,1)" },
    preview: "simulated",
    reduced: "instant",
    description: "Opens from the top with height, opacity and a quiet blur.",
    compatible: (target) =>
      ["card", "section", "list", "form"].includes(target.kind) && target.box.h >= 60,
  },
  {
    id: "dialog",
    title: "Dialog",
    family: "overlay",
    registry: ["dialog"],
    trigger: "enter",
    properties: ["transform", "opacity", "filter"],
    defaults: { spring: { stiffness: 150, damping: 25 }, scale: 0.96, distance: 8 },
    preview: "direct",
    reduced: "fade",
    description: "Tips into view while the page behind it blurs.",
    compatible: (target) => ["modal", "section", "card"].includes(target.kind),
  },
  {
    id: "toast",
    title: "Toast",
    family: "feedback",
    registry: ["toast"],
    trigger: "enter",
    properties: ["transform", "opacity"],
    defaults: { spring: { stiffness: 280, damping: 24 }, distance: -16 },
    preview: "direct",
    reduced: "fade",
    description: "Drops in from above with a firm landing.",
    compatible: (target) => ["toast", "section", "card"].includes(target.kind),
  },
  {
    id: "switch",
    title: "Switch",
    family: "toggle",
    registry: ["switch"],
    trigger: "click",
    properties: ["transform"],
    defaults: { spring: { stiffness: 300, damping: 25 }, distance: 8 },
    preview: "simulated",
    reduced: "instant",
    description: "The thumb stretches, travels and settles.",
    compatible: (target) =>
      ["input", "button", "card"].includes(target.kind) &&
      target.box.w <= 220 &&
      target.box.h <= 100,
  },
  {
    id: "checkbox",
    title: "Check",
    family: "check",
    registry: ["checkbox"],
    trigger: "click",
    properties: ["transform", "opacity"],
    defaults: { spring: { stiffness: 500, damping: 24 }, scale: 0.9 },
    preview: "simulated",
    reduced: "instant",
    description: "The box gives, fills and the check draws itself.",
    compatible: (target) =>
      ["input", "button", "icon"].includes(target.kind) && target.box.w <= 140 && target.box.h <= 140,
  },
];

export const RECIPE_MAP: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.id, recipe]),
);

export function getRecipe(id: string): Recipe | null {
  return RECIPE_MAP[id] ?? null;
}

export function recipeDefaults(recipe: Recipe): {
  duration: number;
  intensity: number;
  distance: number;
  scale: number;
  stagger: number;
  stiffness: number;
  damping: number;
  mass: number;
} {
  const spring = recipe.defaults.spring ?? { stiffness: 350, damping: 28 };
  return {
    duration: recipe.defaults.duration ?? 220,
    intensity: recipe.defaults.intensity ?? 1,
    distance: recipe.defaults.distance ?? 16,
    scale: recipe.defaults.scale ?? 0.94,
    stagger: recipe.defaults.stagger ?? 50,
    stiffness: spring.stiffness,
    damping: spring.damping,
    mass: spring.mass ?? 1,
  };
}
