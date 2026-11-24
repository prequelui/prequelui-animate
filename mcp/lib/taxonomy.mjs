export function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function tokenize(value) {
  return normalize(value)
    .split(/\s+/)
    .filter(Boolean)
    .map(stem)
    .filter((token) => token.length > 1);
}

function stem(token) {
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s")) return token.slice(0, -1);
  return token;
}

const STOPWORDS = new Set(
  [
    "a", "an", "the", "and", "or", "of", "to", "in", "on", "at", "by", "for",
    "with", "from", "into", "onto", "over", "under", "is", "are", "be", "been",
    "this", "that", "these", "those", "it", "its", "my", "me", "our", "your",
    "you", "we", "i", "want", "need", "would", "like", "please", "can", "could",
    "some", "any", "use", "using", "make", "add", "show", "find", "give", "get",
    "page", "site", "app", "application", "website", "component", "components",
    "composant", "composants", "element", "elements", "thing", "things",
    "le", "la", "les", "un", "une", "des", "de", "du", "et", "ou", "a", "au",
    "aux", "en", "dans", "sur", "pour", "avec", "par", "mon", "ma", "mes", "ton",
    "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "ce",
    "cette", "ces", "qui", "que", "quoi", "dont", "est", "sont", "etre", "avoir",
    "je", "tu", "il", "elle", "nous", "vous", "ils", "elles", "veux", "voudrais",
    "aimerais", "cherche", "trouve", "besoin", "faire", "ajouter", "montrer",
  ].map(stem),
);

export function queryTokens(value) {
  return tokenize(value).filter((token) => !STOPWORDS.has(token));
}

const SYNONYMS = {
  entrance: [
    "entree", "entrer", "entrance", "enter", "appear", "apparition", "apparait",
    "reveal", "revele", "revelation", "intro", "introduction", "in", "arrive",
    "arrival", "load", "loading-in", "fade-in",
  ],
  exit: ["sortie", "sortir", "exit", "leave", "disappear", "disparait", "out"],
  animated: [
    "anime", "animee", "animes", "animated", "animation", "motion", "moving",
    "mouvement", "transition", "transitions", "micro-interaction",
  ],
  pricing: [
    "tarif", "tarifs", "tarification", "pricing", "price", "prix", "plan",
    "plans", "abonnement", "subscription", "offre", "offer", "tier", "tiers",
  ],
  button: ["bouton", "boutons", "button", "buttons", "cta", "action", "press"],
  text: ["texte", "textes", "text", "texts", "titre", "title", "headline", "hero", "copy"],
  number: [
    "nombre", "nombres", "number", "numbers", "chiffre", "chiffres", "compteur",
    "counter", "stat", "stats", "metric", "metrics", "kpi", "dashboard",
  ],
  background: [
    "fond", "fonds", "background", "backgrounds", "arriere-plan", "decor",
    "decoration", "ambient", "ambiance",
  ],
  menu: ["menu", "menus", "navigation", "nav", "dropdown", "select", "combobox"],
  form: [
    "form", "forms", "formulaire", "formulaires", "input", "champ", "checkbox",
    "switch", "radio", "slider", "otp",
  ],
  feedback: [
    "toast", "notification", "notifications", "alerte", "alert", "progress",
    "chargement", "loading", "feedback", "message",
  ],
  dialog: [
    "dialogue", "dialog", "modal", "modale", "popup", "overlay", "sheet",
    "drawer", "confirmation", "confirm",
  ],
  hover: ["survol", "hover", "pointer", "curseur", "cursor", "mouse"],
  click: ["clic", "clicks", "click", "tap", "press", "pressed"],
  scroll: ["defilement", "scroll", "scrolling", "parallax", "defiler"],
  card: ["carte", "cartes", "card", "cards", "tuile", "tile"],
  copy: ["copier", "copy", "clipboard", "presse-papiers"],
  theme: ["theme", "themes", "dark", "light", "sombre", "clair", "mode"],
  icon: ["icone", "icones", "icon", "icons", "glyphe", "glyph"],
  illustration: [
    "illustration", "illustrations", "isometric", "isometrique", "scene",
    "scenes", "dessin", "figure", "linear",
  ],
  pictogram: [
    "pictogram", "pictograms", "pictogramme", "pictogrammes", "category",
    "categories", "categorie", "collections",
  ],
  social: ["github", "star", "stars", "etoile", "etoiles", "like", "coeur", "heart"],
  image: ["image", "images", "photo", "photos", "galerie", "gallery", "zoom"],
  gallery: ["galerie", "gallery", "carousel", "slider", "slides"],
  code: ["code", "snippet", "snippets", "syntaxe", "syntax", "cli", "terminal"],
  layout: ["layout", "mise-en-page", "sidebar", "grid", "grille"],
  list: ["liste", "list", "lists", "items", "pinned", "pagination"],
};

const ALIAS_TO_CANONICAL = new Map();
for (const [canonical, aliases] of Object.entries(SYNONYMS)) {
  ALIAS_TO_CANONICAL.set(stem(canonical), canonical);
  for (const alias of aliases) ALIAS_TO_CANONICAL.set(stem(normalize(alias)), canonical);
}

export function canonicalize(tokens) {
  const canonical = new Set();
  for (const token of tokens) {
    canonical.add(ALIAS_TO_CANONICAL.get(token) ?? token);
  }
  return canonical;
}

export const INTENTS = {
  entrance: {
    categories: { effects: 4, texts: 3, backgrounds: 1 },
    slugs: ["blur", "fade", "slide", "zoom", "effect", "splitting-text", "auto-height", "rotating-text"],
    reason: "entrance and reveal motion",
  },
  exit: {
    categories: { effects: 3 },
    slugs: ["fade", "slide", "zoom"],
    reason: "exit motion",
  },
  animated: {
    categories: { effects: 2, texts: 1, buttons: 1, icons: 1 },
    slugs: [],
    reason: "animated interaction",
  },
  pricing: {
    categories: { effects: 3, texts: 2, numbers: 2 },
    slugs: ["tilt", "shine", "magnetic", "gradient-text", "highlight-text", "counting-number", "auto-height"],
    reason: "fits a pricing or plan section",
  },
  button: {
    categories: { buttons: 6 },
    slugs: ["button", "ripple-button", "liquid-button", "icon-button"],
    reason: "button behaviour",
  },
  text: {
    categories: { texts: 6 },
    slugs: ["splitting-text", "gradient-text", "rotating-text", "highlight-text"],
    reason: "text motion",
  },
  number: {
    categories: { numbers: 6 },
    slugs: ["counting-number", "sliding-number", "scrolling-number"],
    reason: "number and counter motion",
  },
  background: {
    categories: { backgrounds: 6 },
    slugs: ["gradient", "bubble", "stars", "topography"],
    reason: "decorative background",
  },
  icon: {
    categories: { icons: 6 },
    slugs: [],
    reason: "animated icon",
  },
  illustration: {
    categories: { linear: 6 },
    slugs: [],
    reason: "hairline isometric illustration",
  },
  pictogram: {
    categories: { categories: 6 },
    slugs: [],
    reason: "category pictogram",
  },
  menu: {
    categories: { components: 4 },
    slugs: ["dropdown-menu", "navigation-menu", "context-menu", "menubar", "select", "combobox"],
    reason: "menu and navigation behaviour",
  },
  form: {
    categories: { components: 4 },
    slugs: ["checkbox", "switch", "radio-group", "slider", "input-otp", "select", "combobox"],
    reason: "form control",
  },
  feedback: {
    categories: { components: 3, prequel: 2 },
    slugs: ["toast", "progress", "alert-dialog", "scroll-progress"],
    reason: "feedback and status",
  },
  dialog: {
    categories: { components: 5 },
    slugs: ["dialog", "alert-dialog", "sheet", "drawer", "popover", "tooltip", "hover-card"],
    reason: "overlay and dialog behaviour",
  },
  hover: {
    categories: { effects: 3, buttons: 2 },
    slugs: ["hover-card", "magnetic", "tilt", "shine", "image-zoom", "flip-button", "liquid-button"],
    reason: "hover interaction",
  },
  click: {
    categories: { effects: 3, buttons: 2 },
    slugs: ["click", "particles", "ripple-button", "icon-button", "theme-toggler-button"],
    reason: "click feedback",
  },
  scroll: {
    categories: { effects: 2, prequel: 4, backgrounds: 1 },
    slugs: ["scroll-progress", "scroll-fade", "page-transition", "bottom-navigation"],
    reason: "scroll-linked motion",
  },
  card: {
    categories: { effects: 3 },
    slugs: ["tilt", "shine", "magnetic", "gradient", "hover-card", "preview-link-card"],
    reason: "card interaction",
  },
  copy: {
    categories: { buttons: 3 },
    slugs: ["copy-button", "code-block"],
    reason: "copy and clipboard",
  },
  theme: {
    categories: { buttons: 3, effects: 2 },
    slugs: ["theme-toggler-button", "theme-toggler"],
    reason: "theme switching",
  },
  social: {
    categories: { buttons: 2, icons: 1 },
    slugs: ["github-stars-button", "github-stars", "particles", "prequel-heart", "prequel-star"],
    reason: "social proof and reactions",
  },
  image: {
    categories: { effects: 2 },
    slugs: ["image-zoom", "carousel", "zoom"],
    reason: "image interaction",
  },
  gallery: {
    categories: { components: 2 },
    slugs: ["carousel", "image-zoom"],
    reason: "gallery or carousel",
  },
  code: {
    categories: { components: 2 },
    slugs: ["code-block", "copy-button", "typing-text"],
    reason: "code presentation",
  },
  layout: {
    categories: { components: 3 },
    slugs: ["sidebar", "tabs", "navigation-menu", "bottom-navigation"],
    reason: "layout and navigation",
  },
  list: {
    categories: { components: 2, prequel: 2 },
    slugs: ["pinned-list", "pagination", "scroll-fade"],
    reason: "list behaviour",
  },
};

const TOKEN_INDEX = new Map();
for (const item of Object.values(INTENTS)) {
  for (const slug of item.slugs) {
    if (!TOKEN_INDEX.has(slug)) TOKEN_INDEX.set(slug, []);
    TOKEN_INDEX.get(slug).push(item);
  }
}

function tokenSet(value) {
  return new Set(tokenize(value));
}

function countMatches(tokens, haystack) {
  let count = 0;
  for (const token of tokens) if (haystack.has(token)) count += 1;
  return count;
}

export function scoreItem(item, analysis) {
  const reasons = [];
  let score = 0;

  const nameTokens = tokenSet(`${item.slug} ${item.title}`);
  const tagTokens = tokenSet((item.tags ?? []).join(" "));
  const descriptionTokens = tokenSet(item.description);
  const categoryTokens = tokenSet(`${item.category} ${item.categoryLabel ?? ""}`);

  const query = analysis.tokens;
  if (query.length) {
    score += countMatches(query, nameTokens) * 7;
    score += countMatches(query, tagTokens) * 3;
    score += countMatches(query, descriptionTokens) * 2;
    score += countMatches(query, categoryTokens) * 3;
  }

  if (analysis.normalized) {
    const slug = normalize(item.slug);
    const title = normalize(item.title);
    if (analysis.normalized === slug || analysis.normalized === title) {
      score += 60;
      reasons.push("exact name match");
    } else if (
      slug.startsWith(analysis.normalized) ||
      title.startsWith(analysis.normalized)
    ) {
      score += 18;
    }
  }

  for (const canonical of analysis.canonical) {
    const intent = INTENTS[canonical];
    if (!intent) continue;
    const categoryBoost = intent.categories?.[item.category] ?? 0;
    if (categoryBoost) {
      score += categoryBoost;
      reasons.push(intent.reason);
    }
    if (intent.slugs.includes(item.slug)) {
      score += 7;
      reasons.push(intent.reason);
    }
  }

  return { score, reasons: [...new Set(reasons)] };
}

export function analyzeQuery(value) {
  const tokens = queryTokens(value);
  return {
    normalized: normalize(value),
    tokens,
    canonical: canonicalize(tokens),
  };
}

export function intentSlugs(canonical) {
  const slugs = new Set();
  for (const intent of canonical) {
    for (const slug of INTENTS[intent]?.slugs ?? []) slugs.add(slug);
  }
  return slugs;
}
