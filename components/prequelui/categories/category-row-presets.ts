import { categoryBySlug } from "./categories.generated";
import type { CategoryPictogramDefinition } from "./category-core";
import type { CategoryRowItem } from "./category-row";

export type CategoryRowFramework = "react" | "vue" | "svelte" | "solid" | "vanilla";

export type CategoryRowPresetId = "shop" | "media" | "saas";

export type CategoryRowPresetItem = {
  slug: string;
  label: string;
  href?: string;
  badge?: string;
};

export type CategoryRowPreset = {
  id: CategoryRowPresetId;
  title: string;
  description: string;
  ariaLabel: string;
  componentName: string;
  items: CategoryRowPresetItem[];
};

/*
 * Copy-ready examples. They only reference stable pictogram slugs, so the rows
 * survive a site redesign and can be dropped into any layout.
 */
export const categoryRowPresets: CategoryRowPreset[] = [
  {
    id: "shop",
    title: "Shop",
    description:
      "A storefront row that mixes browsing, food, checkout and wallet entries.",
    ariaLabel: "Shop categories",
    componentName: "ShopCategories",
    items: [
      { slug: "storefront", label: "Shop", href: "/shop" },
      { slug: "grocery", label: "Grocery", href: "/grocery" },
      { slug: "coffee", label: "Coffee", href: "/coffee" },
      { slug: "shopping-bag", label: "Bags", href: "/bags" },
      { slug: "price-tag", label: "Deals", href: "/deals" },
      { slug: "bank-card", label: "Payment", href: "/payment" },
      { slug: "wallet", label: "Wallet", href: "/wallet" },
    ],
  },
  {
    id: "media",
    title: "Media",
    description:
      "A media row spanning photo, music, audio, film, theatre, art and books.",
    ariaLabel: "Media categories",
    componentName: "MediaCategories",
    items: [
      { slug: "camera", label: "Photo", href: "/photo" },
      { slug: "music-note", label: "Music", href: "/music" },
      { slug: "vinyl", label: "Vinyl", href: "/vinyl" },
      { slug: "equalizer", label: "Audio", href: "/audio" },
      { slug: "clapper", label: "Film", href: "/film" },
      { slug: "theater", label: "Theatre", href: "/theatre" },
      { slug: "art-frame", label: "Art", href: "/art" },
      { slug: "library", label: "Books", href: "/books" },
    ],
  },
  {
    id: "saas",
    title: "SaaS",
    description:
      "A SaaS row for developer tools, design, devices and security.",
    ariaLabel: "SaaS categories",
    componentName: "SaasCategories",
    items: [
      { slug: "code", label: "Code", href: "/code" },
      { slug: "terminal", label: "API", href: "/api" },
      { slug: "branches", label: "Branches", href: "/branches" },
      { slug: "layers", label: "Design", href: "/design" },
      { slug: "palette", label: "Themes", href: "/themes" },
      { slug: "smartphone", label: "Mobile", href: "/mobile" },
      { slug: "laptop", label: "Desktop", href: "/desktop" },
      { slug: "shield", label: "Security", href: "/security" },
    ],
  },
];

function identifier(slug: string) {
  return slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, index) =>
      index === 0
        ? part.charAt(0).toLowerCase() + part.slice(1)
        : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join("");
}

function definitionOf(slug: string): CategoryPictogramDefinition {
  const definition = categoryBySlug[slug];
  if (!definition) throw new Error(`Unknown category pictogram "${slug}"`);
  return definition;
}

export function resolveCategoryRowPreset(
  preset: CategoryRowPreset,
): CategoryRowItem[] {
  // The live preview is a gallery demo, not a second storefront: keep the
  // example hrefs in the copy-ready code, but render the row as non-navigating
  // buttons so no demo click can land on a 404.
  return preset.items.map((item) => ({
    definition: definitionOf(item.slug),
    label: item.label,
    badge: item.badge,
  }));
}

function componentName(slug: string) {
  const definition = definitionOf(slug);
  const pascal = definition.name
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `Prequel${pascal}Pictogram`;
}

function modulePath(framework: CategoryRowFramework, slug: string) {
  if (framework === "vue") {
    return `@/components/prequelui/categories/${componentName(slug)}.vue`;
  }
  if (framework === "svelte") {
    return `$lib/components/prequelui/categories/${componentName(slug)}.svelte`;
  }
  if (framework === "solid") {
    return `@/components/prequelui/categories/pictogram-${slug}`;
  }
  if (framework === "vanilla") {
    return `./components/prequelui/categories/pictogram-${slug}.js`;
  }
  return `@/components/prequelui/categories/pictogram-${slug}`;
}

function itemProps(
  item: CategoryRowPreset["items"][number],
  quote: '"' | "'",
) {
  const props = [
    `definition: ${identifier(item.slug)}`,
    `label: ${quote}${item.label}${quote}`,
    item.href ? `href: ${quote}${item.href}${quote}` : null,
    item.badge ? `badge: ${quote}${item.badge}${quote}` : null,
  ].filter(Boolean);
  return `{ ${props.join(", ")} }`;
}

export function categoryRowPresetCode(
  preset: CategoryRowPreset,
  framework: CategoryRowFramework = "react",
) {
  const imports = preset.items
    .map(
      (item) =>
        `import { definition as ${identifier(item.slug)} } from "${modulePath(framework, item.slug)}";`,
    )
    .join("\n");

  if (framework === "vue") {
    const rows = preset.items
      .map((item) => `      ${itemProps(item, "'")},`)
      .join("\n");
    return `<script setup>
import CategoryRow from "@/components/prequelui/categories/category-row.vue";
${imports}
</script>

<template>
  <CategoryRow
    aria-label="${preset.ariaLabel}"
    :items="[
${rows}
    ]"
  />
</template>`;
  }

  if (framework === "svelte") {
    const rows = preset.items
      .map((item) => `    ${itemProps(item, '"')},`)
      .join("\n");
    return `<script>
  import CategoryRow from "$lib/components/prequelui/categories/category-row.svelte";
  ${imports.replace(/\n/g, "\n  ")}
</script>

<CategoryRow
  ariaLabel="${preset.ariaLabel}"
  items={[
${rows}
  ]}
/>`;
  }

  const rows = preset.items
    .map((item) => `        ${itemProps(item, '"')},`)
    .join("\n");

  if (framework === "vanilla") {
    return `import { createCategoryRow } from "./components/prequelui/categories/category-row.js";
${imports}

const row = createCategoryRow(document.querySelector("#categories"), {
  ariaLabel: "${preset.ariaLabel}",
  items: [
${rows}
  ],
});`;
  }

  return `import { CategoryRow } from "@/components/prequelui/categories/category-row";
${imports}

export function ${preset.componentName}() {
  return (
    <CategoryRow
      ariaLabel="${preset.ariaLabel}"
      items={[
${rows}
      ]}
    />
  );
}`;
}
