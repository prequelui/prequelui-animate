import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(HERE, "..", "..");

export const DEFAULT_WEB_DIR = process.env.PREQUELUI_WEB_DIR
  ? path.resolve(process.env.PREQUELUI_WEB_DIR)
  : path.join(REPO_ROOT, "web");

export const DEFAULT_REGISTRY_DIR = process.env.PREQUELUI_REGISTRY_DIR
  ? path.resolve(process.env.PREQUELUI_REGISTRY_DIR)
  : path.join(DEFAULT_WEB_DIR, "public", "r");

export const DEFAULT_SITE_URL = (
  process.env.PREQUELUI_SITE_URL ||
  "https://prequeluianimate.terravidhal.me"
).replace(/\/+$/, "");

export const FRAMEWORK_IDS = ["react", "vue", "svelte", "solid", "vanilla"];

export const CATEGORY_LABELS = {
  components: "Components",
  prequel: "PrequelUI",
  buttons: "Buttons",
  texts: "Texts",
  numbers: "Numbers",
  effects: "Effects",
  backgrounds: "Backgrounds",
  icons: "Icons",
  linear: "Linear",
  categories: "Categories",
};

const CATEGORY_USE_CASES = {
  components: ["ui", "layout", "navigation", "menu", "form", "dialog", "overlay"],
  prequel: ["behaviour", "interaction", "site", "experience"],
  buttons: ["action", "cta", "press", "click", "submit"],
  texts: ["headline", "hero", "marketing", "copy", "title", "entrance"],
  numbers: ["stats", "metrics", "counter", "dashboard", "pricing"],
  effects: ["entrance", "reveal", "hover", "click", "scroll", "interaction"],
  backgrounds: ["hero", "section", "landing", "decor", "ambient"],
  icons: ["icon", "symbol", "micro-interaction", "button", "glyph"],
  linear: ["illustration", "isometric", "hero", "empty-state", "decor"],
  categories: ["pictogram", "category", "collection", "icon", "illustration"],
};

const SLUG_TAGS = {
  accordion: ["faq", "collapse", "disclosure", "panel"],
  "alert-dialog": ["confirm", "delete", "warning", "modal"],
  carousel: ["slider", "gallery", "swiper", "images"],
  checkbox: ["form", "check", "selection", "todo"],
  "code-block": ["code", "snippet", "syntax", "copy"],
  collapsible: ["collapse", "disclosure", "faq"],
  combobox: ["autocomplete", "search", "select", "form"],
  "context-menu": ["right-click", "menu", "actions"],
  dialog: ["modal", "popup", "overlay", "form"],
  drawer: ["panel", "sheet", "side", "mobile"],
  "dropdown-menu": ["menu", "actions", "select"],
  "hover-card": ["preview", "profile", "hover"],
  "input-otp": ["code", "verification", "2fa", "form"],
  menubar: ["menu", "app", "navigation"],
  "navigation-menu": ["nav", "header", "dropdown"],
  pagination: ["pages", "list", "table"],
  popover: ["popup", "anchored", "form"],
  "preview-link-card": ["link", "preview", "hover", "card"],
  progress: ["loading", "bar", "percentage", "upload"],
  questionnaire: ["form", "steps", "survey", "onboarding"],
  "radio-group": ["form", "choice", "option"],
  select: ["dropdown", "form", "choice"],
  sheet: ["modal", "side", "panel", "mobile"],
  sidebar: ["nav", "layout", "dashboard"],
  slider: ["range", "value", "form"],
  switch: ["toggle", "setting", "form"],
  tabs: ["navigation", "panel", "switch"],
  toast: ["notification", "message", "feedback"],
  toggle: ["button", "state", "format"],
  "toggle-group": ["group", "toolbar", "format"],
  tooltip: ["hint", "hover", "label"],
  button: ["cta", "action", "press", "submit"],
  "copy-button": ["copy", "clipboard", "code"],
  "flip-button": ["hover", "flip", "card"],
  "github-stars-button": ["github", "stars", "social", "count"],
  "icon-button": ["icon", "action", "toolbar"],
  "liquid-button": ["hover", "fill", "cta"],
  "ripple-button": ["click", "ripple", "material"],
  "theme-toggler-button": ["theme", "dark", "light", "toggle"],
  "gradient-text": ["gradient", "hero", "headline", "marketing", "pricing"],
  "highlight-text": ["marker", "emphasis", "pricing", "marketing"],
  "morphing-text": ["morph", "headline", "dynamic"],
  "rolling-text": ["flip", "headline", "counter"],
  "rotating-text": ["rotate", "hero", "words"],
  "shimmering-text": ["shimmer", "loading", "headline"],
  "sliding-text": ["slide", "headline", "link"],
  "splitting-text": ["stagger", "headline", "hero", "entrance"],
  "swapping-text": ["swap", "dynamic", "headline"],
  "typing-text": ["type", "code", "hero", "caret"],
  "counting-number": ["counter", "stats", "metric", "pricing"],
  "scrolling-number": ["counter", "stats", "band"],
  "sliding-number": ["odometer", "counter", "stats"],
  "auto-height": ["height", "reflow", "accordion", "panel"],
  blur: ["entrance", "reveal", "filter"],
  click: ["ripple", "ring", "click"],
  effect: ["entrance", "reveal", "fade", "slide", "zoom"],
  fade: ["entrance", "opacity", "reveal"],
  highlight: ["marker", "selection", "menu"],
  "image-zoom": ["image", "zoom", "gallery"],
  magnetic: ["pointer", "magnet", "hover"],
  particles: ["burst", "like", "confetti"],
  "scroll-fade": ["scroll", "mask", "overflow"],
  shine: ["shine", "hover", "card", "pricing"],
  slide: ["entrance", "direction", "reveal"],
  "theme-toggler": ["theme", "dark", "light"],
  tilt: ["3d", "card", "pricing", "hover"],
  zoom: ["entrance", "scale", "reveal"],
};

const PREQUEL_BASE_SLUGS = new Set(["carousel", "code-block", "input-otp"]);

function sliceArray(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) return "";
  const open = source.indexOf("[", start);
  if (open < 0) return "";
  const end = source.indexOf("\n];", open);
  return source.slice(open, end < 0 ? undefined : end);
}

function collect(regex, source, bucket, category, out) {
  for (const match of source.matchAll(regex)) {
    bucket.add(match[1]);
    out.set(match[1], category);
  }
}

async function parseCatalog(webDir) {
  const file = path.join(webDir, "lib", "catalog.ts");
  const source = await readFile(file, "utf8");
  const categories = new Map();
  const sets = {
    components: new Set(),
    prequel: new Set(),
    buttons: new Set(),
    texts: new Set(),
    numbers: new Set(),
    effects: new Set(),
    backgrounds: new Set(),
    icons: new Set(),
  };

  const sections = [
    ["components", /base\("([a-z0-9-]+)"/g],
    ["prequel", /anim\("prequel",\s*"([a-z0-9-]+)"/g],
    ["buttons", /anim\("buttons",\s*"([a-z0-9-]+)"/g],
    ["texts", /anim\("texts",\s*"([a-z0-9-]+)"/g],
    ["numbers", /anim\("numbers",\s*"([a-z0-9-]+)"/g],
    ["effects", /anim\("effects",\s*"([a-z0-9-]+)"/g],
    ["backgrounds", /bg\("([a-z0-9-]+)"/g],
    ["icons", /slug:\s*"([a-z0-9-]+)"[\s\S]*?href:\s*"\/icons"/g],
  ];

  for (const [category, regex] of sections) {
    const marker =
      category === "icons" ? "export const icons" : `export const ${category}`;
    const block = sliceArray(source, marker);
    if (block) collect(regex, block, sets[category], category, categories);
  }

  return { categories, sets };
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

async function readFrameworkSets(registryDir) {
  const sets = {};
  for (const framework of FRAMEWORK_IDS) {
    const names = new Set();
    try {
      const entries = await readdir(path.join(registryDir, framework));
      for (const entry of entries) {
        if (entry.endsWith(".json") && entry !== "registry.json") {
          names.add(entry.slice(0, -5));
        }
      }
    } catch {
      // Framework folder is optional.
    }
    sets[framework] = names;
  }

  const icons = new Set();
  try {
    const entries = await readdir(path.join(registryDir, "react", "icons"));
    for (const entry of entries) {
      if (entry.endsWith(".json") && entry !== "registry.json") {
        icons.add(entry.slice(0, -5));
      }
    }
  } catch {
    // Icon catalogue is optional.
  }
  sets.icons = icons;
  return sets;
}

function words(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
}

function deriveTags(item, category) {
  const tags = new Set([
    category,
    CATEGORY_LABELS[category] ?? category,
    ...(CATEGORY_USE_CASES[category] ?? []),
    ...(SLUG_TAGS[item.slug] ?? []),
  ]);
  if (item.meta?.collection) tags.add(item.meta.collection);
  if (item.meta?.family) tags.add(item.meta.family);
  for (const word of words(item.title)) tags.add(word);
  for (const word of words(item.description)) tags.add(word);
  return [...tags];
}

function docsPathFor(slug, category) {
  if (category === "icons") return "/icons";
  if (category === "linear") return "/icons?tab=linear";
  if (category === "categories") return "/icons?tab=categories";
  if (category === "backgrounds") return `/docs/backgrounds/${slug}`;
  if (category === "components") {
    return `/docs/primitives/${PREQUEL_BASE_SLUGS.has(slug) ? "prequel" : "base-ui"}/${slug}`;
  }
  return `/docs/primitives/prequel/${slug}`;
}

function iconSlugFromName(name) {
  return name.startsWith("prequel-") ? name.slice("prequel-".length) : name;
}

function classify(item, categories, catalogSets, reactIcons) {
  const byCatalog = categories.get(item.name);
  if (byCatalog) return byCatalog;
  if (item.name.startsWith("prequel-")) return "icons";
  if (item.name.startsWith("linear-")) return "linear";
  if (item.name.startsWith("category-")) return "categories";
  if (catalogSets.backgrounds?.has(item.name)) return "backgrounds";
  if (catalogSets.buttons?.has(item.name)) return "buttons";
  if (catalogSets.texts?.has(item.name)) return "texts";
  if (catalogSets.numbers?.has(item.name)) return "numbers";
  if (catalogSets.effects?.has(item.name)) return "effects";
  if (reactIcons.has(iconSlugFromName(item.name))) return "icons";
  return "components";
}

function filePaths(item) {
  return (item.files ?? []).map((file) => file.path).filter(Boolean);
}

function buildItem(item, context) {
  const { categories, catalogSets, frameworkSets, reactIcons, siteUrl } = context;
  const category = classify(item, categories, catalogSets, reactIcons);
  const iconSlug = category === "icons" ? iconSlugFromName(item.name) : null;
  const base = category !== "icons" && frameworkSets.react.has(item.name);
  const frameworks = {};
  for (const framework of FRAMEWORK_IDS) frameworks[framework] = false;
  frameworks.react = true;
  for (const framework of ["vue", "svelte", "solid", "vanilla"]) {
    frameworks[framework] = frameworkSets[framework].has(item.name);
  }

  const docsPath = docsPathFor(item.name, category);
  const payload = {
    ...item,
    slug: item.name,
    title: item.title ?? item.name,
    description: item.description ?? "",
    category,
    categoryLabel: CATEGORY_LABELS[category] ?? category,
    kind:
      category === "icons"
        ? "icon"
        : category === "linear" || category === "categories"
          ? "illustration"
          : base
            ? "primitive"
            : "component",
    base,
    iconSlug,
    frameworks,
    docsPath,
    docsUrl: `${siteUrl}${docsPath}`,
    files: filePaths(item),
    registryDependencies: item.registryDependencies ?? [],
    dependencies: item.dependencies ?? [],
  };
  payload.tags = deriveTags(payload, category);
  return payload;
}

const CACHE = new Map();

export async function loadCatalog(options = {}) {
  const webDir = path.resolve(options.webDir ?? DEFAULT_WEB_DIR);
  const registryDir = path.resolve(options.registryDir ?? DEFAULT_REGISTRY_DIR);
  const siteUrl = (options.siteUrl ?? DEFAULT_SITE_URL).replace(/\/+$/, "");
  const key = `${webDir}|${registryDir}|${siteUrl}`;
  if (CACHE.has(key)) return CACHE.get(key);

  const promise = (async () => {
    const [index, parsedCatalog, frameworkSets] = await Promise.all([
      readJson(path.join(registryDir, "registry.json")),
      parseCatalog(webDir).catch(() => ({ categories: new Map(), sets: {} })),
      readFrameworkSets(registryDir),
    ]);

    const frameworkIndexes = await Promise.all(
      FRAMEWORK_IDS.map(async (framework) => {
        try {
          return await readJson(path.join(registryDir, framework, "registry.json"));
        } catch {
          return { items: [] };
        }
      }),
    );

    const rawByName = new Map();
    for (const frameworkIndex of frameworkIndexes) {
      for (const item of frameworkIndex.items ?? []) {
        if (item?.name && !rawByName.has(item.name)) rawByName.set(item.name, item);
      }
    }
    for (const item of index.items ?? []) {
      if (item?.name && !rawByName.has(item.name)) rawByName.set(item.name, item);
    }

    const catalogSets = parsedCatalog.sets ?? {};
    for (const category of Object.keys(CATEGORY_LABELS)) {
      if (!catalogSets[category]) catalogSets[category] = new Set();
    }
    for (const framework of FRAMEWORK_IDS) {
      if (!frameworkSets[framework]) frameworkSets[framework] = new Set();
    }

    const context = {
      categories: parsedCatalog.categories,
      catalogSets,
      frameworkSets,
      reactIcons: frameworkSets.icons ?? new Set(),
      siteUrl,
    };

    const dependencyLibraries = new Set([
      "icon-core",
      "icon-library",
      "linear-core",
    ]);
    const rawItems = [...rawByName.values()].filter(
      (item) => !dependencyLibraries.has(item.name),
    );
    const items = rawItems.map((item) => buildItem(item, context));
    const byName = new Map();
    for (const item of items) {
      byName.set(item.slug, item);
      byName.set(item.name, item);
    }

    const counts = {
      total: items.length,
      byCategory: Object.fromEntries(
        Object.keys(CATEGORY_LABELS).map((category) => [
          category,
          items.filter((item) => item.category === category).length,
        ]),
      ),
      frameworks: Object.fromEntries(
        FRAMEWORK_IDS.map((framework) => [
          framework,
          items.filter((item) => item.frameworks[framework]).length,
        ]),
      ),
    };

    return {
      webDir,
      registryDir,
      siteUrl,
      name: index.name ?? "prequelui-animate",
      homepage: index.homepage ?? siteUrl,
      items,
      byName,
      counts,
    };
  })();

  CACHE.set(key, promise);
  return promise;
}

export function clearCatalogCache() {
  CACHE.clear();
}
