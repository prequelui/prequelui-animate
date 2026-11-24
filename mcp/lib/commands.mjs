import { DEFAULT_SITE_URL, FRAMEWORK_IDS } from "./registry.mjs";

export const FRAMEWORK_LABELS = {
  react: "React",
  vue: "Vue 3",
  svelte: "Svelte 5",
  solid: "Solid",
  vanilla: "JavaScript",
};

const SHADCN_CLI = {
  react: "shadcn@latest",
  vue: "shadcn-vue@latest",
  svelte: "shadcn-svelte@latest",
  solid: "shadcn@latest",
};

const FRAMEWORK_PACKAGES = {
  react: ["motion", "lucide-react"],
  vue: ["motion", "@lucide/vue"],
  svelte: ["motion", "lucide-svelte"],
  solid: ["motion", "lucide-solid"],
  vanilla: ["motion"],
};

const ALIASES = {
  react: "react",
  reactjs: "react",
  vue: "vue",
  vue3: "vue",
  svelte: "svelte",
  svelte5: "svelte",
  solid: "solid",
  solidjs: "solid",
  js: "vanilla",
  javascript: "vanilla",
  vanilla: "vanilla",
  none: "vanilla",
};

export const FRAMEWORK_CHOICES = [...FRAMEWORK_IDS, "javascript"];

export function normalizeFramework(value) {
  if (!value) return null;
  const key = String(value).trim().toLowerCase().replace(/[\s._-]+/g, "");
  return ALIASES[key] ?? null;
}

export function isFramework(value) {
  return normalizeFramework(value) !== null;
}

export function registryUrlFor(item, framework, siteUrl = DEFAULT_SITE_URL) {
  const base = siteUrl.replace(/\/+$/, "");
  if (framework === "react") {
    if (item.kind === "icon" || item.category === "icons") {
      return `${base}/r/react/icons/${item.iconSlug}.json`;
    }
    if (item.category === "linear") {
      return `${base}/r/react/linear/${item.slug.replace(/^linear-/, "")}.json`;
    }
    if (item.category === "categories") {
      const slug =
        item.slug === "category-core" || item.slug === "category-row"
          ? item.slug
          : item.slug.replace(/^category-/, "");
      return `${base}/r/react/categories/${slug}.json`;
    }
    if (item.base) return `${base}/r/react/${item.slug}.json`;
    return `${base}/r/${item.slug}.json`;
  }
  if (framework === "vanilla") return null;
  return `${base}/r/${framework}/${item.slug}.json`;
}

export function installCommands(item, siteUrl = DEFAULT_SITE_URL) {
  const commands = {};
  const base = siteUrl.replace(/\/+$/, "");
  for (const framework of FRAMEWORK_IDS) {
    if (!item.frameworks?.[framework]) continue;
    if (framework === "vanilla") {
      commands.vanilla = `curl -fsSL --create-dirs ${base}/r/vanilla/${item.slug}/${item.slug}.js -o components/prequelui/${item.slug}.js`;
      continue;
    }
    commands[framework] = `npx ${SHADCN_CLI[framework]} add ${registryUrlFor(item, framework, siteUrl)}`;
  }
  return commands;
}

export function packageList(framework) {
  return FRAMEWORK_PACKAGES[framework] ?? [];
}

export function installCommandFor(item, framework, siteUrl = DEFAULT_SITE_URL) {
  const requested = normalizeFramework(framework);
  const commands = installCommands(item, siteUrl);
  const available = Object.keys(commands);

  if (!requested) {
    return {
      requested: framework ?? null,
      command: commands.react ?? null,
      framework: "react",
      label: FRAMEWORK_LABELS.react,
      packages: packageList("react"),
      available,
      all: commands,
    };
  }

  if (!commands[requested]) {
    return {
      requested,
      framework: requested,
      label: FRAMEWORK_LABELS[requested],
      available: false,
      command: null,
      packages: packageList(requested),
      availableFrameworks: available,
      note:
        available.length === 1
          ? `This component ships for ${FRAMEWORK_LABELS[available[0]]} only.`
          : `This component does not ship for ${FRAMEWORK_LABELS[requested]}. Available: ${available
              .map((id) => FRAMEWORK_LABELS[id])
              .join(", ")}.`,
      all: commands,
    };
  }

  return {
    requested,
    framework: requested,
    label: FRAMEWORK_LABELS[requested],
    available: true,
    command: commands[requested],
    packages: packageList(requested),
    availableFrameworks: available,
    all: commands,
  };
}
