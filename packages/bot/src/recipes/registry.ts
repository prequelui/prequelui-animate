import type { Framework } from "../types";

export const SITE_URL = "https://animate.prequelui.terravidhal.me";

export const FRAMEWORK_LABELS: Record<Framework, string> = {
  react: "React",
  vue: "Vue 3",
  svelte: "Svelte 5",
  solid: "Solid",
  vanilla: "JavaScript",
};

const SHADCN_CLI: Record<Exclude<Framework, "vanilla">, string> = {
  react: "shadcn@latest",
  vue: "shadcn-vue@latest",
  svelte: "shadcn-svelte@latest",
  solid: "shadcn-solid@latest",
};

const PRIMITIVE_TITLES: Record<string, string> = {
  accordion: "Accordion",
  "alert-dialog": "Alert Dialog",
  carousel: "Carousel",
  checkbox: "Checkbox",
  "code-block": "Code Block",
  collapsible: "Collapsible",
  combobox: "Combobox",
  "context-menu": "Context Menu",
  dialog: "Dialog",
  drawer: "Drawer",
  "dropdown-menu": "Dropdown Menu",
  "hover-card": "Hover Card",
  "input-otp": "Input OTP",
  menubar: "Menubar",
  "navigation-menu": "Navigation Menu",
  pagination: "Pagination",
  popover: "Popover",
  "preview-link-card": "Preview Link Card",
  progress: "Progress",
  questionnaire: "Questionnaire",
  "radio-group": "Radio Group",
  select: "Select",
  sheet: "Sheet",
  sidebar: "Sidebar",
  slider: "Slider",
  switch: "Switch",
  tabs: "Tabs",
  toast: "Toast",
  "toggle-group": "Toggle Group",
  toggle: "Toggle",
  tooltip: "Tooltip",
};

const EFFECT_TITLES: Record<string, string> = {
  button: "Button",
  "copy-button": "Copy Button",
  "flip-button": "Flip Button",
  "github-stars-button": "GitHub Stars Button",
  "icon-button": "Icon Button",
  "liquid-button": "Liquid Button",
  "ripple-button": "Ripple Button",
  "theme-toggler-button": "Theme Toggler Button",
  "gradient-text": "Gradient Text",
  "highlight-text": "Highlight Text",
  "morphing-text": "Morphing Text",
  "rolling-text": "Rolling Text",
  "rotating-text": "Rotating Text",
  "shimmering-text": "Shimmering Text",
  "sliding-text": "Sliding Text",
  "splitting-text": "Splitting Text",
  "swapping-text": "Swapping Text",
  "typing-text": "Typing Text",
  "counting-number": "Counting Number",
  "scrolling-number": "Scrolling Number",
  "sliding-number": "Sliding Number",
  "auto-height": "Auto Height",
  blur: "Blur",
  click: "Click",
  effect: "Effect",
  fade: "Fade",
  highlight: "Highlight",
  "image-zoom": "Image Zoom",
  magnetic: "Magnetic",
  particles: "Particles",
  "scroll-fade": "Scroll Fade",
  shine: "Shine",
  slide: "Slide",
  "theme-toggler": "Theme Toggler",
  tilt: "Tilt",
  zoom: "Zoom",
  glyph: "Glyph",
  hole: "Hole",
  stars: "Stars",
  fireworks: "Fireworks",
  "gravity-stars": "Gravity Stars",
  hexagon: "Hexagon",
  bubble: "Bubble",
  topography: "Topography",
  "avatar-group": "Avatar Group",
  "bottom-navigation": "Bottom Navigation",
};

const BASE_SLUGS = new Set(["carousel", "code-block", "input-otp"]);

export type RegistryItem = {
  slug: string;
  title: string;
  frameworks: Framework[];
  base: boolean;
  docsHref: string;
};

function docsHref(slug: string): string {
  if (PRIMITIVE_TITLES[slug]) {
    const group = BASE_SLUGS.has(slug) ? "prequel" : "base-ui";
    return `/docs/primitives/${group}/${slug}`;
  }
  return `/docs/primitives/prequel/${slug}`;
}

function item(slug: string): RegistryItem {
  const primitive = Boolean(PRIMITIVE_TITLES[slug]);
  return {
    slug,
    title: PRIMITIVE_TITLES[slug] ?? EFFECT_TITLES[slug] ?? slug,
    frameworks: primitive
      ? ["react", "vue", "svelte", "solid", "vanilla"]
      : ["react"],
    base: BASE_SLUGS.has(slug),
    docsHref: docsHref(slug),
  };
}

export const REGISTRY: Record<string, RegistryItem> = Object.fromEntries(
  [...Object.keys(PRIMITIVE_TITLES), ...Object.keys(EFFECT_TITLES)].map((slug) => [
    slug,
    item(slug),
  ]),
);

export function registryItem(slug: string): RegistryItem | null {
  return REGISTRY[slug] ?? null;
}

export function registryUrlFor(slug: string, framework: Framework, siteUrl = SITE_URL): string | null {
  const entry = registryItem(slug);
  if (!entry || !entry.frameworks.includes(framework)) return null;
  const base = siteUrl.replace(/\/+$/, "");
  if (framework === "vanilla") {
    return `${base}/r/vanilla/${slug}.json`;
  }
  if (framework === "react") {
    if (entry.base) return `${base}/r/react/${slug}.json`;
    return `${base}/r/${slug}.json`;
  }
  return `${base}/r/${framework}/${slug}.json`;
}

export function installCommands(
  slug: string,
  siteUrl = SITE_URL,
): Partial<Record<Framework, string>> {
  const entry = registryItem(slug);
  if (!entry) return {};
  const commands: Partial<Record<Framework, string>> = {};
  for (const framework of entry.frameworks) {
    if (framework === "vanilla") {
      commands.vanilla = `npx degit prequelui/animate/web/registry/vanilla/${slug} components/prequelui/${slug}`;
      continue;
    }
    const url = registryUrlFor(slug, framework, siteUrl);
    if (url) commands[framework] = `npx ${SHADCN_CLI[framework]} add ${url}`;
  }
  return commands;
}

export function installCommandFor(
  slug: string,
  framework: Framework,
  siteUrl = SITE_URL,
): { command: string | null; available: boolean; note: string | null; all: Partial<Record<Framework, string>> } {
  const all = installCommands(slug, siteUrl);
  const command = all[framework] ?? null;
  if (command) return { command, available: true, note: null, all };
  const react = all.react ?? null;
  return {
    command: react,
    available: false,
    note: `This motion ships for React only. The preview still works in ${FRAMEWORK_LABELS[framework]}.`,
    all,
  };
}

export function docsUrlFor(slug: string, siteUrl = SITE_URL): string {
  const entry = registryItem(slug);
  const path = entry?.docsHref ?? `/docs/primitives/prequel/${slug}`;
  return `${siteUrl.replace(/\/+$/, "")}${path}`;
}
