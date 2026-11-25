"use client";

import type { ComponentType } from "react";
import { buildSetSvg } from "@/lib/icon-set-svg";
import { HOME_URL } from "@/lib/motion";
import { FAMILY_META, type FamilyKey, type FamilyMeta } from "./family-meta";
import type { IconProps, SetIconDefinition } from "./set-icon";
import type { SetMotionName } from "./set-motion";
import { heroiconsDefinitions, heroiconsIcons } from "./heroicons-set";
import { phosphorDefinitions, phosphorIcons } from "./phosphor-set";
import { tablerDefinitions, tablerIcons } from "./tabler-set";

export { FAMILY_META };
export type { FamilyKey, FamilyMeta };

type CatalogItem = {
  readonly name: string;
  readonly category: string;
  readonly icon: ComponentType<IconProps>;
};

type FamilyCatalog = {
  icons: ReadonlyArray<CatalogItem>;
  definitions: Record<string, SetIconDefinition>;
};

export type FamilyIcon = {
  key: FamilyKey;
  slug: string;
  name: string;
  category: string;
  motion: SetMotionName;
  motionLabel: string;
  motionNote: string;
  description: string;
  effectNote: string;
  keywords: string[];
  Icon: ComponentType<IconProps>;
  component: string;
  file: string;
  usageFile: string;
  svg: string;
  command: string;
  sourceUrl: string;
  usage: string;
};

const CATALOGS: Record<FamilyKey, FamilyCatalog> = {
  tabler: {
    icons: tablerIcons as ReadonlyArray<CatalogItem>,
    definitions: tablerDefinitions,
  },
  phosphor: {
    icons: phosphorIcons as ReadonlyArray<CatalogItem>,
    definitions: phosphorDefinitions,
  },
  heroicons: {
    icons: heroiconsIcons as ReadonlyArray<CatalogItem>,
    definitions: heroiconsDefinitions,
  },
};

const MOTION_LABELS: Record<SetMotionName, string> = {
  ring: "Ring",
  beat: "Beat",
  slideRight: "Slide right",
  slideLeft: "Slide left",
  slideUp: "Slide up",
  slideDown: "Slide down",
  rise: "Rise",
  drop: "Drop",
  focus: "Focus",
  mail: "Mail",
  chat: "Chat",
  trash: "Trash",
  copy: "Copy",
  check: "Check",
  plus: "Plus",
  close: "Close",
  lock: "Lock",
  eye: "Eye",
  star: "Star",
  bookmark: "Bookmark",
  gear: "Gear",
  bounce: "Bounce",
  coin: "Coin",
  float: "Float",
  clock: "Clock",
  flip: "Flip",
  sun: "Sun",
  moon: "Moon",
  signal: "Signal",
  charge: "Charge",
  grow: "Grow",
  shield: "Shield",
  shake: "Shake",
  pop: "Pop",
  file: "File",
  spin: "Spin",
  press: "Press",
  sway: "Sway",
  orbit: "Orbit",
};

const MOTION_NOTES: Record<SetMotionName, string> = {
  ring: "The drawing swings from its crown while the accent part answers a beat later.",
  beat: "Two quick beats settle back into rest inside the same tween.",
  slideRight: "The whole drawing advances to the right, then returns.",
  slideLeft: "The whole drawing advances to the left, then returns.",
  slideUp: "The whole drawing lifts upward, then returns.",
  slideDown: "The whole drawing sinks downward, then returns.",
  rise: "The accent leaves upward while the main shape holds.",
  drop: "The accent lands downward while the main shape holds.",
  focus: "The lens opens slightly and its handle draws itself.",
  mail: "The envelope lifts and its flap draws in.",
  chat: "The bubble lifts while its inner dots light up.",
  trash: "The lid lifts and the bin takes a short breath.",
  copy: "The two sheets separate and come back together.",
  check: "The check draws itself with a small swell.",
  plus: "The cross turns a quarter and swells back.",
  close: "The cross rocks and settles a little smaller.",
  lock: "The padlock rocks while its shackle lifts.",
  eye: "The lid closes and the pupil shrinks, like a blink.",
  star: "The star tips and swells while a light pass crosses it.",
  bookmark: "The bookmark lifts and a soft light pass crosses it.",
  gear: "The gear turns by one tooth while the inner parts warm up.",
  bounce: "The glyph gives a short upward bounce.",
  coin: "Money turns slightly, like a coin settling.",
  float: "The drawing drifts on a soft current.",
  clock: "The hands turn while the dial stays put.",
  flip: "The page tips over and settles back.",
  sun: "The sun turns and its rays draw in.",
  moon: "The moon rocks gently and its accent brightens.",
  signal: "The bars reach upward in a short pulse.",
  charge: "The cell fills a little from its base.",
  grow: "The chart grows from its baseline.",
  shield: "The shield holds its shape while its check draws.",
  shake: "The glyph shakes once, not forever.",
  pop: "The glyph arrives with a small overshoot.",
  file: "The sheet lifts a corner and draws its inner line.",
  spin: "One full turn on a linear curve.",
  press: "A short press, smaller then back.",
  sway: "A loose side-to-side sway, calmer than a shake.",
  orbit: "The drawing reaches outward and settles.",
};

function pascal(value: string) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function localKeywords(name: string, category: string, motion: string) {
  const words = name.split(/[^a-z0-9]+/i).filter(Boolean);
  return Array.from(
    new Set(
      [...words, category.toLowerCase(), motion.toLowerCase()].filter(
        (word) => word.length > 1,
      ),
    ),
  );
}

const cache = new Map<FamilyKey, FamilyIcon[]>();

export function familyIcons(key: FamilyKey): FamilyIcon[] {
  const cached = cache.get(key);
  if (cached) return cached;
  const meta = FAMILY_META[key];
  const catalog = CATALOGS[key];

  const list = catalog.icons.map((item) => {
    const definition = catalog.definitions[item.name];
    const motion = (definition?.motion ?? "pop") as SetMotionName;
    const component = `${meta.prefix}${pascal(item.name)}Icon`;
    const file = `${key}/${item.name}.tsx`;
    const usageFile = `@/components/prequelui/icons/sets/${key}/${item.name}`;
    const motionLabel = MOTION_LABELS[motion];
    const motionNote = MOTION_NOTES[motion];
    return {
      key,
      slug: `${key}/${item.name}`,
      name: item.name,
      category: item.category,
      motion,
      motionLabel,
      motionNote,
      description: `The ${meta.label} ${item.category.toLowerCase()} glyph (${motionLabel.toLowerCase()}), drawn from the official source and animated by our shared motion core.`,
      effectNote: `${motionNote} Hover, click and loop all drive this one recipe.`,
      keywords: localKeywords(item.name, item.category, motionLabel),
      Icon: item.icon,
      component,
      file,
      usageFile,
      svg: definition ? buildSetSvg(definition) : "",
      command: `npx shadcn@latest add ${HOME_URL}/r/react/icons/${key}/${item.name}.json`,
      sourceUrl: `/r/react/icons/${key}/${item.name}.json`,
      usage: `import { AnimatedIcon } from "@/components/prequelui/icons/core";
import { ${component} } from "${usageFile}";

<AnimatedIcon animateOnHover animateOnTap>
  <${component} size={24} />
</AnimatedIcon>

<AnimatedIcon animate animation="loop" loop>
  <${component} size={24} />
</AnimatedIcon>`,
    } satisfies FamilyIcon;
  });

  cache.set(key, list);
  return list;
}

export function familyIcon(key: FamilyKey, name: string) {
  return familyIcons(key).find((icon) => icon.name === name);
}

export function familyCategories(key: FamilyKey) {
  return Array.from(new Set(familyIcons(key).map((icon) => icon.category))).sort();
}
