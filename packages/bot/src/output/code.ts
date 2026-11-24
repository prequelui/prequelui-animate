import type { Framework, Recipe, RecipeOptions, TargetSnapshot } from "../types";
import { resolveDistance, resolveDuration, resolveEasing, resolveScale, keyframesFor, timingFor } from "../preview/keyframes";

function pascal(value: string): string {
  const cleaned = value
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  if (!cleaned) return "";
  return /^\d/.test(cleaned) ? `Motion${cleaned}` : cleaned;
}

export function componentName(target: TargetSnapshot): string {
  const fromText = target.text ? pascal(target.text) : "";
  if (fromText.length >= 2) return fromText;
  const kind = target.kind === "list-item" ? "ListItem" : pascal(target.kind);
  return `Prequel${kind || "Element"}`;
}

function label(target: TargetSnapshot): string {
  const text = (target.text ?? "").replace(/\s+/g, " ").trim();
  if (!text || text === "[redacted]") return "Your element";
  return text.slice(0, 48).replace(/[<>{}]/g, "");
}

function motionTag(target: TargetSnapshot): string {
  const allowed = new Set([
    "div",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "main",
    "nav",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "a",
    "button",
    "img",
    "form",
    "label",
    "dialog",
    "figure",
    "figcaption",
  ]);
  return allowed.has(target.tag) ? target.tag : "div";
}

function spring(options: RecipeOptions, recipe: Recipe): string {
  const source = options.spring ?? recipe.defaults.spring ?? { stiffness: 350, damping: 28 };
  const mass = source.mass ? `, mass: ${source.mass}` : "";
  const visual =
    typeof options.duration === "number"
      ? `, visualDuration: ${(options.duration / 1000).toFixed(2)}`
      : "";
  return `{ type: "spring", stiffness: ${Math.round(source.stiffness)}, damping: ${Math.round(source.damping)}${mass}${visual} }`;
}

function reactProps(recipe: Recipe, options: RecipeOptions): string {
  const duration = resolveDuration(recipe.id, options);
  const ease = resolveEasing(options);
  const distance = resolveDistance(options, recipe.defaults.distance ?? 16);
  const scale = resolveScale(options, recipe.defaults.scale ?? 0.94);
  switch (recipe.id) {
    case "press":
      return `      whileTap={{ scale: ${scale} }}\n      transition={${spring(options, recipe)}}`;
    case "ripple":
      return `      whileTap={{ scale: 0.98 }}\n      transition={{ duration: 0.2, ease: ${JSON.stringify(ease)} }}`;
    case "tilt":
      return `      whileHover={{ rotateX: -6, rotateY: 8 }}\n      style={{ transformPerspective: 800 }}\n      transition={${spring(options, recipe)}}`;
    case "magnetic":
      return `      whileHover={{ x: ${Math.round(distance * 0.25)}, y: -4 }}\n      transition={${spring(options, recipe)}}`;
    case "shine":
      return `      whileHover={{ scale: 1.01 }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: ${JSON.stringify(ease)} }}`;
    case "image-zoom":
      return `      whileHover={{ scale: ${options.scale ?? 1.6} }}\n      transition={${spring(options, recipe)}}`;
    case "flip":
      return `      whileHover={{ rotateY: 180 }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: ${JSON.stringify(ease)} }}`;
    case "underline":
      return `      whileHover={{ scaleX: 1 }}\n      initial={{ scaleX: 0 }}\n      style={{ originX: 0 }}\n      transition={${spring(options, recipe)}}`;
    case "focus-ring":
      return `      whileFocus={{ boxShadow: "0 0 0 5px rgba(124,92,255,.45)" }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: ${JSON.stringify(ease)} }}`;
    case "count":
    case "odometer":
      return `      initial={{ opacity: 0 }}\n      animate={{ opacity: 1 }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)} }}`;
    case "typing":
      return `      initial={{ clipPath: "inset(0 100% 0 0)" }}\n      animate={{ clipPath: "inset(0 0 0 0)" }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: "steps(24, end)" }}`;
    case "gradient":
      return `      animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: "linear", repeat: Infinity }}`;
    case "highlight":
      return `      initial={{ backgroundSize: "0% 40%" }}\n      animate={{ backgroundSize: "100% 40%" }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: ${JSON.stringify(ease)} }}`;
    default:
      return `      initial={{ opacity: 0, y: ${Math.round(distance)} }}\n      animate={{ opacity: 1, y: 0 }}\n      transition={{ duration: ${(duration / 1000).toFixed(2)}, ease: ${JSON.stringify(ease)} }}`;
  }
}

function reactSnippet(recipe: Recipe, options: RecipeOptions, target: TargetSnapshot): string {
  const name = componentName(target);
  const tag = motionTag(target);
  const props = reactProps(recipe, options);
  return `// PrequelUI · ${recipe.id} (${recipe.registry[0]}) · tuned ${new Date().toISOString().slice(0, 10)}
import { motion } from "motion/react";

export function ${name}() {
  return (
    <motion.${tag}
${props}
    >
      ${label(target)}
    </motion.${tag}>
  );
}
`;
}

function cssBlock(recipe: Recipe, options: RecipeOptions): string {
  const duration = resolveDuration(recipe.id, options);
  const ease = resolveEasing(options);
  const distance = resolveDistance(options, recipe.defaults.distance ?? 16);
  const scale = resolveScale(options, recipe.defaults.scale ?? 0.94);
  const base = `.pb-${recipe.id} {`;
  const enter: Record<string, string> = {
    fade: `  opacity: 0;\n  transition: opacity ${duration}ms ${ease};`,
    blur: `  opacity: 0;\n  filter: blur(10px);\n  transition: opacity ${duration}ms ${ease}, filter ${duration}ms ${ease};`,
    slide: `  opacity: 0;\n  transform: translateY(${distance}px);\n  transition: opacity ${duration}ms ${ease}, transform ${duration}ms ${ease};`,
    zoom: `  opacity: 0;\n  transform: scale(${scale});\n  transition: opacity ${duration}ms ${ease}, transform ${duration}ms ${ease};`,
    stagger: `  opacity: 0;\n  transform: translateY(${distance}px);\n  transition: opacity ${duration}ms ${ease}, transform ${duration}ms ${ease};`,
    dialog: `  opacity: 0;\n  transform: translateY(8px) scale(${scale});\n  filter: blur(8px);\n  transition: all ${duration}ms ${ease};`,
    toast: `  opacity: 0;\n  transform: translateY(-16px);\n  transition: opacity ${duration}ms ${ease}, transform ${duration}ms ${ease};`,
    press: `  transform: scale(1);\n  transition: transform ${duration}ms ${ease};`,
    tilt: `  transform: perspective(800px) rotateX(0) rotateY(0);\n  transition: transform ${duration}ms ${ease};`,
    magnetic: `  transform: translate(0, 0);\n  transition: transform ${duration}ms ${ease};`,
    shine: `  position: relative;\n  overflow: hidden;`,
    "image-zoom": `  transform: scale(1);\n  transition: transform ${duration}ms ${ease};`,
    flip: `  transform: perspective(900px) rotateY(0);\n  transition: transform ${duration}ms ${ease};`,
    underline: `  position: relative;`,
    "focus-ring": `  transition: box-shadow ${duration}ms ${ease};`,
    accordion: `  clip-path: inset(0 0 100% 0);\n  opacity: .4;\n  transition: clip-path ${duration}ms ${ease}, opacity ${duration}ms ${ease};`,
    switch: `  transition: transform ${duration}ms ${ease};`,
    checkbox: `  transition: transform ${duration}ms ${ease};`,
    typing: `  clip-path: inset(0 100% 0 0);\n  transition: clip-path ${duration}ms steps(24, end);`,
    gradient: `  background-size: 200% 100%;\n  animation: pb-gradient ${duration}ms linear infinite;`,
    highlight: `  background-image: linear-gradient(transparent 60%, rgba(124,92,255,.3) 60%);\n  background-repeat: no-repeat;\n  background-size: 0% 100%;\n  transition: background-size ${duration}ms ${ease};`,
    count: `  font-variant-numeric: tabular-nums;`,
    odometer: `  font-variant-numeric: tabular-nums;`,
  };
  const enterBody = enter[recipe.id] ?? `  opacity: 0;\n  transition: opacity ${duration}ms ${ease};`;
  const active: Record<string, string> = {
    press: `\n.pb-${recipe.id}:active { transform: scale(${scale}); }`,
    tilt: `\n.pb-${recipe.id}:hover { transform: perspective(800px) rotateX(-6deg) rotateY(8deg); }`,
    magnetic: `\n.pb-${recipe.id}:hover { transform: translate(${Math.round(distance * 0.25)}px, -4px); }`,
    flip: `\n.pb-${recipe.id}:hover { transform: perspective(900px) rotateY(180deg); }`,
    "image-zoom": `\n.pb-${recipe.id}:hover { transform: scale(${options.scale ?? 1.6}); }`,
    shine: `\n.pb-${recipe.id}::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%) skewX(-15deg); background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent); transition: transform ${duration}ms ${ease}; }\n.pb-${recipe.id}:hover::after { transform: translateX(100%) skewX(-15deg); }`,
    "focus-ring": `\n.pb-${recipe.id}:focus-visible { box-shadow: 0 0 0 5px rgba(124,92,255,.45); outline: none; }`,
    switch: `\n.pb-${recipe.id}:active { transform: translateX(${distance}px) scaleX(1.08); }`,
    checkbox: `\n.pb-${recipe.id}:active { transform: scale(${scale}); }`,
    underline: `\n.pb-${recipe.id}::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px; background: currentColor; transform: scaleX(0); transform-origin: left; transition: transform ${duration}ms ${ease}; }\n.pb-${recipe.id}:hover::after { transform: scaleX(1); }`,
  };
  const activeBody = active[recipe.id] ?? "";
  const reduced =
    recipe.reduced === "off"
      ? `@media (prefers-reduced-motion: reduce) {\n  .pb-${recipe.id}, .pb-${recipe.id}::after { animation: none; transition: none; transform: none; }\n}`
      : `@media (prefers-reduced-motion: reduce) {\n  .pb-${recipe.id} { transition: opacity 120ms linear; transform: none; filter: none; }\n}`;
  return `${base}\n${enterBody}\n}\n.pb-${recipe.id}.is-in {\n  opacity: 1;\n  transform: none;\n  filter: none;\n  clip-path: inset(0 0 0 0);\n  background-size: 100% 100%;\n}\n${activeBody}\n${reduced}`;
}

function vueSnippet(recipe: Recipe, options: RecipeOptions, target: TargetSnapshot): string {
  const tag = motionTag(target) === "img" ? "img" : motionTag(target);
  return `<!-- PrequelUI · ${recipe.id} (${recipe.registry[0]}) -->
<script setup>
import { onMounted, ref } from "vue";

const shown = ref(false);
onMounted(() => requestAnimationFrame(() => { shown.value = true; }));
</script>

<template>
  <${tag} class="pb-${recipe.id}" :class="{ 'is-in': shown }">
    ${label(target)}
  </${tag}>
</template>

<style>
${cssBlock(recipe, options)}
</style>
`;
}

function svelteSnippet(recipe: Recipe, options: RecipeOptions, target: TargetSnapshot): string {
  const tag = motionTag(target) === "img" ? "img" : motionTag(target);
  const entrance = ["fade", "slide", "blur", "zoom", "stagger"].includes(recipe.id);
  const transition =
    recipe.id === "slide" || recipe.id === "stagger"
      ? `fly`
      : recipe.id === "zoom"
        ? `scale`
        : `fade`;
  const importLine = entrance ? `  import { ${transition} } from "svelte/transition";\n` : "";
  const params =
    recipe.id === "slide" || recipe.id === "stagger"
      ? `{ y: ${resolveDistance(options)}, duration: ${resolveDuration(recipe.id, options)} }`
      : recipe.id === "zoom"
        ? `{ start: ${resolveScale(options)}, duration: ${resolveDuration(recipe.id, options)} }`
        : `{ duration: ${resolveDuration(recipe.id, options)} }`;
  const directive = entrance ? ` in:${transition}=${"{"}${params}${"}"}` : "";
  return `<!-- PrequelUI · ${recipe.id} (${recipe.registry[0]}) -->
<script>
${importLine}  let show = $state(true);
</script>

{#if show}
  <${tag} class="pb-${recipe.id}"${directive}>
    ${label(target)}
  </${tag}>
{/if}

<style>
${cssBlock(recipe, options)}
</style>
`;
}

function solidSnippet(recipe: Recipe, options: RecipeOptions, target: TargetSnapshot): string {
  const tag = motionTag(target) === "img" ? "img" : motionTag(target);
  return `// PrequelUI · ${recipe.id} (${recipe.registry[0]})
import { createSignal, onMount } from "solid-js";

export function ${componentName(target)}() {
  const [shown, setShown] = createSignal(false);
  onMount(() => requestAnimationFrame(() => setShown(true)));

  return (
    <${tag} class="pb-${recipe.id}" classList={{ "is-in": shown() }}>
      ${label(target)}
    </${tag}>
  );
}

/* CSS
${cssBlock(recipe, options)}
*/
`;
}

function vanillaSnippet(recipe: Recipe, options: RecipeOptions, target: TargetSnapshot): string {
  const rect = { width: target.box.w, height: target.box.h };
  const frames = keyframesFor(recipe.id, rect, options, false, false);
  const timing = timingFor(recipe.id, options, false);
  return `// PrequelUI · ${recipe.id} (${recipe.registry[0]})
const el = document.querySelector(${JSON.stringify(target.selector)});

el?.animate(
  ${JSON.stringify(frames, null, 2)},
  ${JSON.stringify(timing, null, 2)},
);
`;
}

export function generateCode(
  recipe: Recipe,
  options: RecipeOptions,
  target: TargetSnapshot,
  framework: Framework,
): string {
  switch (framework) {
    case "react":
      return reactSnippet(recipe, options, target);
    case "vue":
      return vueSnippet(recipe, options, target);
    case "svelte":
      return svelteSnippet(recipe, options, target);
    case "solid":
      return solidSnippet(recipe, options, target);
    case "vanilla":
    default:
      return vanillaSnippet(recipe, options, target);
  }
}

export function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        () => true,
        () => fallbackCopy(text),
      );
    }
  } catch {}
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    area.style.pointerEvents = "none";
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    return copied;
  } catch {
    return false;
  }
}
