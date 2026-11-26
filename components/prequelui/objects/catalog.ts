import type { SceneDefinition } from "./source/engine";
import type { PrototypeMeta } from "./source/geom";
import { lot1Prototypes } from "./source/lot1";
import { lot2Prototypes } from "./source/lot2";
import { lot3Prototypes } from "./source/lot3";
import { lot4Prototypes } from "./source/lot4";
import { lot5Prototypes } from "./source/lot5";
import { lot6Prototypes } from "./source/lot6";
import { lot7Prototypes } from "./source/lot7";
import { lot8Prototypes } from "./source/lot8";
import { lot9Prototypes } from "./source/lot9";
import { lot10Prototypes } from "./source/lot10";
import {
  categories,
  categoryLabels,
  renames,
  type ObjectCategory,
} from "./renames";

export type LinObjectMeta = {
  slug: string;
  name: string;
  category: ObjectCategory;
  categoryLabel: string;
  ordinal: number;
  scene: SceneDefinition;
};

const sourcePrototypes: PrototypeMeta[] = [
  ...lot1Prototypes,
  ...lot2Prototypes,
  ...lot3Prototypes,
  ...lot4Prototypes,
  ...lot5Prototypes,
  ...lot6Prototypes,
  ...lot7Prototypes,
  ...lot8Prototypes,
  ...lot9Prototypes,
  ...lot10Prototypes,
];

function sceneFor(meta: PrototypeMeta, rename: (typeof renames)[string]): SceneDefinition {
  const label = categoryLabels[rename.category];
  return {
    ...meta.scene,
    slug: rename.slug,
    name: rename.name,
    family: label,
    collection: "Objects",
    description: `${rename.name} drawn as a real-world object in 2:1 isometric.`,
    aria: `An isometric ${rename.name.toLowerCase()}.`,
  };
}

export const linObjects: LinObjectMeta[] = sourcePrototypes.map((meta, index) => {
  const rename = renames[meta.slug];
  if (!rename) {
    throw new Error(`No object name mapped for drawing "${meta.slug}".`);
  }
  return {
    ...rename,
    categoryLabel: categoryLabels[rename.category],
    ordinal: index + 1,
    scene: sceneFor(meta, rename),
  };
});

export const objectBySlug = new Map(
  linObjects.map((item) => [item.slug, item]),
);

export function getObject(slug: string): LinObjectMeta {
  const item = objectBySlug.get(slug);
  if (!item) throw new Error(`Unknown object "${slug}".`);
  return item;
}

export const objectCategories = categories.map((category) => ({
  category,
  label: categoryLabels[category],
  count: linObjects.filter((item) => item.category === category).length,
}));

export const objectSlugs = linObjects.map((item) => item.slug);

if (linObjects.length !== 253) {
  throw new Error(`Expected 253 objects, found ${linObjects.length}.`);
}

if (new Set(objectSlugs).size !== linObjects.length) {
  throw new Error("Two objects share the same slug.");
}

if (sourcePrototypes.some((meta) => !renames[meta.slug])) {
  throw new Error("A drawing is missing its object name.");
}
