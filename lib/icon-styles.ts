export type IconVariant = "outline" | "solid" | "duotone" | "color" | "emoji";
export type IconWeight = "light" | "regular" | "bold";
export type IconRole = "primary" | "secondary" | "accent";

export const ICON_VARIANTS: IconVariant[] = [
  "outline",
  "solid",
  "duotone",
  "color",
  "emoji",
];

export const ICON_VARIANT_LABELS: Record<IconVariant, string> = {
  outline: "Outline",
  solid: "Solid",
  duotone: "Duotone",
  color: "Color",
  emoji: "Emoji",
};

export const ICON_VARIANT_SUFFIX: Record<IconVariant, string> = {
  outline: "",
  solid: "-solid",
  duotone: "-duotone",
  color: "-color",
  emoji: "-emoji",
};

export function isIconVariant(
  value: string | null | undefined,
): value is IconVariant {
  return !!value && (ICON_VARIANTS as string[]).includes(value);
}
