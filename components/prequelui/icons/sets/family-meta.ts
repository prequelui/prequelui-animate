export type FamilyKey = "tabler" | "phosphor" | "heroicons";

export type FamilyMeta = {
  key: FamilyKey;
  label: string;
  prefix: string;
  guideSlug: string;
  guideHref: string;
  count: number;
  categories: number;
  license: string;
  source: string;
  sourceUrl: string;
  licenseFile: string;
  description: string;
};

export const FAMILY_META: Record<FamilyKey, FamilyMeta> = {
  tabler: {
    key: "tabler",
    label: "Tabler",
    prefix: "Tabler",
    guideSlug: "tabler-icons",
    guideHref: "/icons/guide/tabler-icons",
    count: 150,
    categories: 7,
    license: "MIT",
    source: "github.com/tabler/tabler-icons",
    sourceUrl: "https://github.com/tabler/tabler-icons",
    licenseFile: "/iconsets/licenses/tabler-LICENSE.txt",
    description:
      "The Tabler outline family: a 24 px grid, 2 px strokes and a pragmatic interface vocabulary.",
  },
  phosphor: {
    key: "phosphor",
    label: "Phosphor",
    prefix: "Phosphor",
    guideSlug: "phosphor-icons",
    guideHref: "/icons/guide/phosphor-icons",
    count: 120,
    categories: 7,
    license: "MIT",
    source: "github.com/phosphor-icons/core",
    sourceUrl: "https://github.com/phosphor-icons/core",
    licenseFile: "/iconsets/licenses/phosphor-LICENSE.txt",
    description:
      "The Phosphor regular family: filled 256 px pictograms with a softer, rounder silhouette.",
  },
  heroicons: {
    key: "heroicons",
    label: "Heroicons",
    prefix: "Heroicons",
    guideSlug: "heroicons",
    guideHref: "/icons/guide/heroicons",
    count: 100,
    categories: 7,
    license: "MIT",
    source: "github.com/tailwindlabs/heroicons",
    sourceUrl: "https://github.com/tailwindlabs/heroicons",
    licenseFile: "/iconsets/licenses/heroicons-LICENSE.txt",
    description:
      "The Heroicons 24 px outline family: a 1.5 px stroke and a compact set tuned for product UI.",
  },
};
