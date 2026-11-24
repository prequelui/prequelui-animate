export type Framework = "react" | "vue" | "svelte" | "solid" | "vanilla";

export type Position = "br" | "bl" | "tr" | "tl";

export type ReducedMotionPolicy = "system" | "always" | "never";

export type BotState =
  | "idle"
  | "armed"
  | "hovering"
  | "thinking"
  | "proposing"
  | "previewing"
  | "tuning"
  | "output"
  | "applied";

export type MascotState =
  | "auto"
  | "dots"
  | "pills"
  | "tilt"
  | "look"
  | "happy"
  | "wink"
  | "blink"
  | "think";

export type BridgeConfig = {
  url: string;
  token?: string;
};

export type BotConfig = {
  position: Position;
  size: number;
  label: string | null;
  showLabel: boolean;
  framework: Framework;
  allowHosts: string[];
  registryUrl: string | null;
  hotkey: string | false;
  bridge: BridgeConfig | false;
  reducedMotion: ReducedMotionPolicy;
  disabled: boolean;
  force: boolean;
  demo: boolean;
  scope: string | null;
  onApply?: (payload: ApplyPayload) => void;
};

export type ApplyPayload = {
  framework: Framework;
  kind: TargetKind;
  text: string | null;
  recipe: string;
  options: RecipeOptions;
  code: string;
  install: string | null;
};

export type TargetKind =
  | "button"
  | "link"
  | "card"
  | "heading"
  | "text"
  | "list"
  | "list-item"
  | "image"
  | "icon"
  | "input"
  | "form"
  | "nav"
  | "section"
  | "table"
  | "stat"
  | "badge"
  | "avatar"
  | "media"
  | "modal"
  | "toast"
  | "unknown";

export type ExistingMotion = "none" | "css-transition" | "css-animation" | "waapi";

export type TargetSnapshot = {
  kind: TargetKind;
  confidence: number;
  alternatives: TargetKind[];
  tag: string;
  role: string | null;
  text: string | null;
  textLength: number;
  box: { w: number; h: number; x: number; y: number };
  fontSize: number;
  fontWeight: number;
  childCount: number;
  hasImage: boolean;
  hasHeading: boolean;
  hasBorder: boolean;
  hasShadow: boolean;
  hasText: boolean;
  radius: number;
  isFixed: boolean;
  isInteractive: boolean;
  existingMotion: ExistingMotion;
  selector: string;
  path: string[];
  isTextLeaf: boolean;
  inNav: boolean;
  inList: boolean;
  hasFormField: boolean;
  hasSvgOnly: boolean;
  bgImage: boolean;
  cursorPointer: boolean;
  redacted: boolean;
};

export type TargetSignals = {
  tag: string;
  role: string | null;
  inputType: string | null;
  href: string | null;
  text: string;
  textLength: number;
  w: number;
  h: number;
  viewportW: number;
  viewportH: number;
  fontSize: number;
  fontWeight: number;
  childCount: number;
  elementChildren: number;
  hasImage: boolean;
  hasHeading: boolean;
  hasBorder: boolean;
  hasShadow: boolean;
  radius: number;
  isFixed: boolean;
  isInteractive: boolean;
  cursorPointer: boolean;
  bgImage: boolean;
  inNav: boolean;
  inList: boolean;
  listLength: number;
  hasFormField: boolean;
  submitButton: boolean;
  hasSvgOnly: boolean;
  hasSvg: boolean;
  tableCells: number;
  tableRows: number;
  isDialog: boolean;
  roleStatus: boolean;
  numberLike: boolean;
  inlineOnly: boolean;
  hasValueField: boolean;
};

export type Classification = {
  kind: TargetKind;
  confidence: number;
  alternatives: TargetKind[];
  scores: Partial<Record<TargetKind, number>>;
};

export type Trigger = "enter" | "hover" | "press" | "click" | "focus" | "scroll" | "loop";

export type RecipeDefaults = {
  duration?: number;
  easing?: string;
  spring?: { stiffness: number; damping: number; mass?: number };
  distance?: number;
  scale?: number;
  intensity?: number;
  stagger?: number;
};

export type RecipeOptions = {
  duration?: number;
  easing?: string;
  spring?: { stiffness: number; damping: number; mass?: number };
  intensity?: number;
  distance?: number;
  scale?: number;
  stagger?: number;
  loop?: boolean;
};

export type RecipePreview = "direct" | "simulated" | "text" | "numeric" | "injected";

export type RecipeReduced = "same" | "fade" | "instant" | "off";

export type ProposalContext = {
  viewportW: number;
  viewportH: number;
  reduced: boolean;
};

export type Recipe = {
  id: string;
  title: string;
  family: string;
  registry: string[];
  trigger: Trigger;
  properties: string[];
  defaults: RecipeDefaults;
  preview: RecipePreview;
  reduced: RecipeReduced;
  description: string;
  compatible: (target: TargetSnapshot, ctx: ProposalContext) => boolean;
};

export type ProposalRole = "recommended" | "expressive" | "alternative";

export type Proposal = {
  role: ProposalRole;
  recipe: Recipe;
  options: RecipeOptions;
};

export type ProposalSet = {
  target: TargetSnapshot;
  proposals: Proposal[];
  note: string | null;
};

export type PreviewAdapter = {
  keyframes: (rect: DOMRect, options: RecipeOptions) => Keyframe[];
  timing: (options: RecipeOptions, reduced: boolean) => KeyframeAnimationOptions;
  before?: (el: Element) => (() => void) | void;
};

export type BridgeRequest = {
  id: string;
  createdAt: string;
  framework: Framework;
  target: {
    kind: TargetKind;
    tag: string;
    text: string | null;
    box: { w: number; h: number };
    path: string[];
  };
  recipe: {
    id: string;
    registry: string[];
    properties: string[];
    defaults: RecipeDefaults;
  };
  options: RecipeOptions;
  install: string | null;
  docsUrl: string;
  instructions: string;
};

export type BridgeStatus = {
  state: "queued" | "in_progress" | "done" | "error";
  summary?: string;
  files?: string[];
  error?: string;
};

export type BridgeSession = {
  token: string;
  expiresAt: number;
  origin: string;
};

export type PrequelBotHandle = {
  open(): void;
  close(): void;
  select(): void;
  cancel(): void;
  apply(): void;
  getState(): BotState;
  destroy(): void;
};

export type RuntimeState = {
  version: string;
  state: BotState;
  target: TargetSnapshot | null;
  proposals: Proposal[];
  selectedRecipe: Recipe | null;
  framework: Framework;
  options: RecipeOptions;
  previewing: boolean;
  bridge: BridgeSession | null;
};
