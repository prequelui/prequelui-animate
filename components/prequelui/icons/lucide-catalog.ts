"use client";

import * as Lucide from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { lucideIcons } from "./lucide-set";

const CATEGORY_RULES: Array<[RegExp, string]> = [
  [/bell|mail|message|inbox|send|megaphone|rss|phone|speech|voicemail|at-sign/, "Notifications"],
  [/user|person|contact|smile|heart|baby|accessibility|users|handshake/, "People"],
  [/search|copy|trash|plus|minus|edit|pencil|download|upload|share|scissors|save|clipboard|file|folder|archive|printer|eraser|paint|type|bold|italic|underline|list|layout|table|grid/, "Actions"],
  [/arrow|chevron|corner|home|map|compass|navigation|move|panel|signpost|route|locate|external|undo|redo|refresh|rotate|expand|shrink|maximize|minimize/, "Navigation"],
  [/play|pause|stop|skip|camera|image|video|music|volume|mic|film|tv|headphone|speaker|disc|radio|guitar|piano|drum|audio|cast|projector|aperture|focus/, "Media"],
  [/sun|moon|cloud|rain|snow|wind|thermometer|umbrella|weather|droplet|waves|tornado|haze|fog|lightning|zap|flame|leaf|tree|flower|sprout|snowflake/, "Weather"],
  [/sparkle|wand|rocket|ghost|crystal|diamond|gem|crown|star|orbit|atom|flask|test-tube|beaker|magnet|infinity|rainbow/, "Magic"],
  [/check|x-|alert|info|help|loader|ban|circle|shield|badge|verified|target|activity|signal|wifi|battery|power|plug|gauge|timer|hourglass/, "Status"],
  [/settings|slider|cog|wrench|lock|key|switch|toggle|filter|scale|ruler|hammer|screwdriver|bolt|nut|construction|hard-hat|drill|wrench|pipette|cpu|server|database|terminal|code|binary|bug|git/, "Settings"],
];

function toKebab(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function categoryFor(name: string) {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(name)) return category;
  }
  return "Status";
}

const customNames = new Set<string>(lucideIcons.map((item) => item.name));

const all = Object.entries(Lucide as Record<string, unknown>)
  .filter(
    ([key, value]) =>
      /^[A-Z][A-Za-z0-9]*Icon$/.test(key) &&
      key !== "Icon" &&
      (typeof value === "function" || (typeof value === "object" && value !== null)),
  )
  .map(([key, value]) => ({
    name: toKebab(key.replace(/Icon$/, "")),
    icon: value as LucideIcon,
  }))
  .filter((entry, index, list) => list.findIndex((item) => item.name === entry.name) === index)
  .filter((entry) => !customNames.has(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));

export type CatalogIcon = {
  name: string;
  category: string;
  icon: LucideIcon;
  generic?: boolean;
};

const WANTED = 368;

export const extraLucideIcons: CatalogIcon[] = (() => {
  const stride = Math.max(1, Math.floor(all.length / WANTED));
  const picked = all.filter((_, index) => index % stride === 0).slice(0, WANTED);
  for (const entry of all) {
    if (picked.length >= WANTED) break;
    if (!picked.some((item) => item.name === entry.name)) picked.push(entry);
  }
  return picked.map((entry) => ({
    ...entry,
    category: categoryFor(entry.name),
    generic: true,
  }));
})();
