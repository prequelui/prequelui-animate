import {
  CATEGORY_LABELS,
  FRAMEWORK_IDS,
  loadCatalog,
} from "./registry.mjs";
import {
  FRAMEWORK_CHOICES,
  FRAMEWORK_LABELS,
  installCommandFor,
  installCommands,
  normalizeFramework,
} from "./commands.mjs";
import { analyzeQuery, normalize, scoreItem } from "./taxonomy.mjs";

const CATEGORY_ALIASES = new Map();
for (const [id, label] of Object.entries(CATEGORY_LABELS)) {
  CATEGORY_ALIASES.set(normalize(id), id);
  CATEGORY_ALIASES.set(normalize(label), id);
  CATEGORY_ALIASES.set(normalize(label.replace(/\s+/g, "")), id);
}
CATEGORY_ALIASES.set("prequel ui", "prequel");
CATEGORY_ALIASES.set("animated icons", "icons");
CATEGORY_ALIASES.set("animated icon", "icons");
CATEGORY_ALIASES.set("background", "backgrounds");
CATEGORY_ALIASES.set("textarea", "components");

export const CATEGORY_IDS = Object.keys(CATEGORY_LABELS);

function resolveCategory(value) {
  if (!value) return null;
  return CATEGORY_ALIASES.get(normalize(value)) ?? null;
}

function cleanName(value) {
  return String(value ?? "")
    .trim()
    .replace(/^@prequelui\//i, "")
    .replace(/^prequelui\//i, "")
    .replace(/\.(json|tsx|ts|vue|svelte|js|mjs|md)$/i, "");
}

function catalogueSummary(item, framework) {
  const install = framework
    ? installCommandFor(item, framework)
    : installCommandFor(item, "react");
  return {
    name: item.slug,
    title: item.title,
    description: item.description,
    category: item.category,
    categoryLabel: item.categoryLabel,
    kind: item.kind,
    tags: item.tags.slice(0, 10),
    frameworks: FRAMEWORK_IDS.filter((id) => item.frameworks[id]),
    docsUrl: item.docsUrl,
    install: install.available === false ? null : install.command,
  };
}

export function resolveComponent(catalog, rawName) {
  const cleaned = cleanName(rawName);
  if (!cleaned) return null;
  const lowered = cleaned.toLowerCase();
  const dashed = normalize(cleaned).replace(/\s+/g, "-");
  const candidates = [lowered, dashed, `prequel-${dashed}`];

  for (const candidate of candidates) {
    const item = catalog.byName.get(candidate);
    if (item) return item;
  }

  for (const item of catalog.items) {
    if (item.iconSlug && normalize(item.iconSlug) === normalize(cleaned)) {
      return item;
    }
  }

  const analysis = analyzeQuery(cleaned);
  let best = null;
  let bestScore = 0;
  for (const item of catalog.items) {
    const result = scoreItem(item, analysis);
    if (result.score > bestScore) {
      best = item;
      bestScore = result.score;
    }
  }
  return bestScore >= 8 ? best : null;
}

function notFound(kind, rawName) {
  return {
    found: false,
    query: rawName,
    message: `No component matched "${rawName}". Try a broad name such as "button", "dialog" or "blur", or call search_components with a usage.`,
    hint:
      kind === "suggest"
        ? "Use suggest_components with a plain-language request."
        : "Use search_components to browse by name, usage or category.",
  };
}

export async function searchComponents(args = {}, options = {}) {
  const catalog = await loadCatalog(options);
  const categoryId = resolveCategory(args.category);
  if (args.category && !categoryId) {
    return {
      error: `Unknown category "${args.category}".`,
      categories: CATEGORY_IDS,
    };
  }

  const limit = Math.min(Math.max(Number(args.limit) || 10, 1), 50);
  let pool = catalog.items;
  if (categoryId) pool = pool.filter((item) => item.category === categoryId);

  const text = [args.query, args.usage].filter(Boolean).join(" ");
  const analysis = analyzeQuery(text);
  const hasQuery = analysis.tokens.length > 0 || Boolean(analysis.normalized);

  const scored = pool.map((item, index) => ({
    item,
    index,
    ...scoreItem(item, analysis),
  }));

  const filtered = hasQuery ? scored.filter((entry) => entry.score > 0) : scored;
  filtered.sort(
    (a, b) => b.score - a.score || a.index - b.index,
  );

  const results = filtered.slice(0, limit).map((entry, index) => ({
    rank: index + 1,
    ...catalogueSummary(entry.item, args.framework),
    score: entry.score,
    reasons: entry.reasons,
  }));

  return {
    query: args.query ?? null,
    usage: args.usage ?? null,
    category: categoryId,
    totalInScope: pool.length,
    count: results.length,
    results,
  };
}

export async function describeComponent(args = {}, options = {}) {
  const catalog = await loadCatalog(options);
  const item = resolveComponent(catalog, args.name);
  if (!item) return notFound("describe", args.name);

  const related = catalog.items
    .filter((entry) => entry.category === item.category && entry.slug !== item.slug)
    .slice(0, 6)
    .map((entry) => ({
      name: entry.slug,
      title: entry.title,
      description: entry.description,
    }));

  return {
    found: true,
    name: item.slug,
    title: item.title,
    description: item.description,
    category: item.category,
    categoryLabel: item.categoryLabel,
    kind: item.kind,
    tags: item.tags,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
    frameworks: FRAMEWORK_IDS.filter((id) => item.frameworks[id]),
    docsUrl: item.docsUrl,
    install: installCommands(item, catalog.siteUrl),
    related,
  };
}

export async function getInstallCommand(args = {}, options = {}) {
  const catalog = await loadCatalog(options);
  const item = resolveComponent(catalog, args.name);
  if (!item) return notFound("install", args.name);

  let requested = null;
  if (args.framework) {
    requested = normalizeFramework(args.framework);
    if (!requested) {
      return {
        error: `Unknown framework "${args.framework}".`,
        frameworks: FRAMEWORK_CHOICES,
      };
    }
  }

  const result = installCommandFor(item, requested, catalog.siteUrl);
  return {
    name: item.slug,
    title: item.title,
    category: item.category,
    kind: item.kind,
    docsUrl: item.docsUrl,
    ...result,
    labels: FRAMEWORK_LABELS,
  };
}

const FALLBACK_SLUGS = ["fade", "slide", "blur", "tilt", "button"];

export async function suggestComponents(args = {}, options = {}) {
  const catalog = await loadCatalog(options);
  const request = String(args.request ?? "").trim();
  if (!request) {
    return {
      error: "Describe what you want to build, for example: 'animated entrance for my pricing page'.",
    };
  }

  const requested = args.framework ? normalizeFramework(args.framework) : null;
  if (args.framework && !requested) {
    return {
      error: `Unknown framework "${args.framework}".`,
      frameworks: FRAMEWORK_CHOICES,
    };
  }

  const limit = Math.min(Math.max(Number(args.limit) || 3, 1), 3);
  const analysis = analyzeQuery(request);
  const scored = catalog.items
    .map((item, index) => ({
      item,
      index,
      ...scoreItem(item, analysis),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const picked = [];
  const pickedSlugs = new Set();
  for (const entry of scored) {
    if (picked.length >= limit) break;
    if (pickedSlugs.has(entry.item.slug)) continue;
    picked.push(entry);
    pickedSlugs.add(entry.item.slug);
  }

  if (picked.length < limit) {
    for (const slug of FALLBACK_SLUGS) {
      if (picked.length >= limit) break;
      if (pickedSlugs.has(slug)) continue;
      const item = catalog.byName.get(slug);
      if (!item) continue;
      picked.push({ item, index: 0, score: 0, reasons: ["popular starting point"] });
      pickedSlugs.add(slug);
    }
  }

  const results = picked.map((entry, index) => {
    const summary = catalogueSummary(entry.item, requested);
    const available = requested ? entry.item.frameworks[requested] : true;
    return {
      rank: index + 1,
      ...summary,
      reason:
        entry.reasons.length > 0
          ? entry.reasons.slice(0, 2).join("; ")
          : "Matches the request",
      frameworkAvailable: available,
      install:
        requested && !available
          ? installCommandFor(entry.item, "react").command
          : summary.install,
      note:
        requested && !available
          ? `${entry.item.title} is not available for ${FRAMEWORK_LABELS[requested]}; the React command is shown.`
          : undefined,
    };
  });

  return {
    request,
    framework: requested,
    count: results.length,
    results,
  };
}
