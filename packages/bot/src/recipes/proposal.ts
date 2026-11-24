import type {
  Proposal,
  ProposalContext,
  ProposalRole,
  ProposalSet,
  Recipe,
  RecipeOptions,
  TargetKind,
  TargetSnapshot,
} from "../types";
import { getRecipe, recipeDefaults, RECIPES } from "./catalog";

const TABLE: Record<
  TargetKind,
  { recommended: string; expressive: string; alternative: string }
> = {
  button: { recommended: "press", expressive: "ripple", alternative: "magnetic" },
  link: { recommended: "underline", expressive: "shine", alternative: "slide" },
  nav: { recommended: "underline", expressive: "magnetic", alternative: "fade" },
  card: { recommended: "tilt", expressive: "shine", alternative: "blur" },
  heading: { recommended: "split", expressive: "gradient", alternative: "blur" },
  text: { recommended: "fade", expressive: "highlight", alternative: "slide" },
  list: { recommended: "stagger", expressive: "slide", alternative: "scroll-fade" },
  "list-item": { recommended: "stagger", expressive: "highlight", alternative: "fade" },
  image: { recommended: "image-zoom", expressive: "zoom", alternative: "blur" },
  icon: { recommended: "icon-burst", expressive: "shine", alternative: "zoom" },
  input: { recommended: "focus-ring", expressive: "shine", alternative: "fade" },
  form: { recommended: "stagger", expressive: "slide", alternative: "fade" },
  section: { recommended: "scroll-fade", expressive: "stagger", alternative: "blur" },
  table: { recommended: "stagger", expressive: "scroll-fade", alternative: "fade" },
  stat: { recommended: "count", expressive: "odometer", alternative: "fade" },
  badge: { recommended: "zoom", expressive: "shine", alternative: "fade" },
  avatar: { recommended: "zoom", expressive: "shine", alternative: "fade" },
  media: { recommended: "image-zoom", expressive: "zoom", alternative: "blur" },
  modal: { recommended: "dialog", expressive: "blur", alternative: "zoom" },
  toast: { recommended: "toast", expressive: "slide", alternative: "zoom" },
  unknown: { recommended: "fade", expressive: "slide", alternative: "blur" },
};

const FALLBACKS = ["fade", "slide", "blur", "zoom", "focus-ring", "dialog", "stagger"];

export function defaultOptions(recipe: Recipe): RecipeOptions {
  const defaults = recipeDefaults(recipe);
  const options: RecipeOptions = {};
  if (recipe.defaults.duration !== undefined) options.duration = recipe.defaults.duration;
  if (recipe.defaults.easing !== undefined) options.easing = recipe.defaults.easing;
  if (recipe.defaults.spring !== undefined) options.spring = { ...recipe.defaults.spring };
  if (recipe.defaults.distance !== undefined) options.distance = recipe.defaults.distance;
  if (recipe.defaults.scale !== undefined) options.scale = recipe.defaults.scale;
  if (recipe.defaults.intensity !== undefined) options.intensity = recipe.defaults.intensity;
  if (recipe.defaults.stagger !== undefined) options.stagger = recipe.defaults.stagger;
  options.loop = false;
  void defaults;
  return options;
}

function isUsable(recipe: Recipe, target: TargetSnapshot, ctx: ProposalContext): boolean {
  if (!recipe.compatible(target, ctx)) return false;
  if (ctx.reduced && recipe.reduced === "off") return false;
  return true;
}

function choose(
  candidates: string[],
  target: TargetSnapshot,
  ctx: ProposalContext,
  usedFamilies: Set<string>,
): Recipe | null {
  for (const id of candidates) {
    const recipe = getRecipe(id);
    if (!recipe) continue;
    if (usedFamilies.has(recipe.family)) continue;
    if (!isUsable(recipe, target, ctx)) continue;
    usedFamilies.add(recipe.family);
    return recipe;
  }
  return null;
}

function pickFallback(
  target: TargetSnapshot,
  ctx: ProposalContext,
  usedFamilies: Set<string>,
): Recipe {
  for (const id of FALLBACKS) {
    const recipe = getRecipe(id);
    if (!recipe) continue;
    if (usedFamilies.has(recipe.family)) continue;
    if (!isUsable(recipe, target, ctx)) continue;
    usedFamilies.add(recipe.family);
    return recipe;
  }
  const fade = getRecipe("fade") ?? RECIPES[0];
  usedFamilies.add(fade.family);
  return fade;
}

function makeProposal(role: ProposalRole, recipe: Recipe, overrides?: RecipeOptions): Proposal {
  return {
    role,
    recipe,
    options: { ...defaultOptions(recipe), ...(overrides ?? {}) },
  };
}

export function propose(target: TargetSnapshot, ctx: ProposalContext): ProposalSet {
  const table = TABLE[target.kind] ?? TABLE.unknown;
  const used = new Set<string>();
  const note: string | null =
    target.existingMotion !== "none"
      ? "Already animated"
      : ctx.reduced
        ? "Reduced motion is on"
        : null;

  const expressive = choose(
    [table.expressive, ...FALLBACKS],
    target,
    ctx,
    used,
  );
  const recommended = choose(
    target.existingMotion !== "none"
      ? [table.alternative, "fade", "blur", ...FALLBACKS]
      : [table.recommended, ...FALLBACKS],
    target,
    ctx,
    used,
  );
  const alternative = choose(
    [table.alternative, ...FALLBACKS],
    target,
    ctx,
    used,
  );

  const proposals: Proposal[] = [];
  proposals.push(makeProposal("recommended", recommended ?? pickFallback(target, ctx, used)));
  proposals.push(makeProposal("expressive", expressive ?? pickFallback(target, ctx, used)));
  proposals.push(makeProposal("alternative", alternative ?? pickFallback(target, ctx, used)));

  return { target, proposals, note };
}

export function optionsWithTuning(
  proposal: Proposal,
  tuned: Partial<RecipeOptions>,
): RecipeOptions {
  const next = { ...proposal.options, ...tuned };
  if (next.spring) next.spring = { ...next.spring };
  return next;
}
