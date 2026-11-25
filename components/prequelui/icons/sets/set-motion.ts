import type { IconAnimationSet } from "../core";

/*
 * The five imported families all share one grammar: a group transform for the
 * whole drawing and a small accent for the part that carries the meaning. The
 * recipes below are written once and applied to every icon, in the same spirit
 * as the hand-drawn catalogue: a bell rings, an arrow advances, a heart beats.
 *
 * Distances are written in the 24-unit space. The frame multiplies x/y by
 * viewBoxSize / 24 so the same recipe reads correctly on a 256-unit drawing.
 */

type Recipe = [Record<string, unknown>, Record<string, unknown>];

const T = (duration: number, ease: string | number[] = "easeInOut") => ({
  duration,
  ease,
});

const recipe = (
  group: Recipe,
  accent: Recipe = [{}, {}],
): IconAnimationSet => ({
  default: {
    group: { initial: group[0], animate: group[1] },
    accent: { initial: accent[0], animate: accent[1] },
  } as IconAnimationSet["default"],
});

export const SET_MOTIONS = {
  /* A bell swings from its crown and the clapper answers a beat later. */
  ring: recipe(
    [
      { rotate: 0 },
      { rotate: [0, 18, -12, 8, -4, 0], transformOrigin: "top center", transition: T(0.9) },
    ],
    [
      { y: 0, x: 0 },
      { y: [0, 1, -0.5, 0], x: [0, -2, 1.5, -1, 0], transition: T(1.05) },
    ],
  ),

  /* A heartbeat: two quick beats then a rest inside the same tween. */
  beat: recipe(
    [
      { scale: 1 },
      { scale: [1, 1.16, 0.96, 1.08, 1], transition: T(0.75) },
    ],
    [
      { opacity: 1 },
      { opacity: [1, 0.55, 1], transition: T(0.75) },
    ],
  ),

  slideRight: recipe(
    [{ x: 0 }, { x: [0, 3, 0], transition: T(0.55) }],
    [{ x: 0 }, { x: [0, -1, 0], transition: T(0.55) }],
  ),
  slideLeft: recipe(
    [{ x: 0 }, { x: [0, -3, 0], transition: T(0.55) }],
    [{ x: 0 }, { x: [0, 1, 0], transition: T(0.55) }],
  ),
  slideUp: recipe(
    [{ y: 0 }, { y: [0, -3, 0], transition: T(0.55) }],
    [{ y: 0 }, { y: [0, 1, 0], transition: T(0.55) }],
  ),
  slideDown: recipe(
    [{ y: 0 }, { y: [0, 3, 0], transition: T(0.55) }],
    [{ y: 0 }, { y: [0, -1, 0], transition: T(0.55) }],
  ),

  /* Uploads leave upward; downloads land on the tray below. */
  rise: recipe(
    [{ y: 0 }, { y: [0, -2.5, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, 2, -1, 0], transition: T(0.6) }],
  ),
  drop: recipe(
    [{ y: 0 }, { y: [0, 2.5, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, -2, 1, 0], transition: T(0.6) }],
  ),

  /* A search lens opens and its handle draws itself. */
  focus: recipe(
    [{ scale: 1 }, { scale: [1, 1.06, 1], transition: T(0.6) }],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0.2, 1], opacity: [0.35, 1], transition: T(0.5, "easeOut") },
    ],
  ),

  /* The envelope lifts and its flap draws in. */
  mail: recipe(
    [{ scale: 1 }, { scale: [1, 1.05, 1], transition: T(0.6) }],
    [
      { y: 0, pathLength: 1 },
      { y: [0, -1.5, 0], pathLength: [0.2, 1], transition: T(0.6) },
    ],
  ),

  /* A speech bubble lifts while its dots light up. */
  chat: recipe(
    [
      { scale: 1, y: 0 },
      { scale: [1, 1.05, 1], y: [0, -1.5, 0], transition: T(0.6) },
    ],
    [
      { opacity: 0.4 },
      { opacity: [0.4, 1, 0.4], transition: T(0.6) },
    ],
  ),

  /* A lid lifts and the bin takes a short breath. */
  trash: recipe(
    [{ y: 0 }, { y: [0, -1.5, 0], transition: T(0.55) }],
    [
      { y: 0, rotate: 0 },
      {
        y: [0, -2.5, 0],
        rotate: [0, -8, 0],
        transition: T(0.55),
      },
    ],
  ),

  /* Two sheets separate and come back together. */
  copy: recipe(
    [
      { x: 0, y: 0 },
      { x: [0, -2, 0], y: [0, -2, 0], transition: T(0.5) },
    ],
    [
      { x: 0, y: 0 },
      { x: [0, 2, 0], y: [0, 2, 0], transition: T(0.5) },
    ],
  ),

  /* A check draws itself with a small swell. */
  check: recipe(
    [{ scale: 1 }, { scale: [1, 1.08, 1], transition: T(0.5, "easeOut") }],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0, 1], opacity: [0.3, 1], transition: T(0.5, "easeOut") },
    ],
  ),

  plus: recipe([
    { rotate: 0, scale: 1 },
    { rotate: [0, 90, 0], scale: [1, 1.08, 1], transition: T(0.55) },
  ]),
  close: recipe([
    { rotate: 0, scale: 1 },
    {
      rotate: [0, -8, 0],
      scale: [1, 0.9, 1],
      transition: T(0.5, "easeOut"),
    },
  ]),

  /* A padlock rocks and its shackle lifts. */
  lock: recipe(
    [{ rotate: 0 }, { rotate: [0, -6, 6, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.6) }],
  ),

  /* An eye blinks: the lid closes, the pupil shrinks. */
  eye: recipe(
    [
      { scaleY: 1 },
      { scaleY: [1, 0.15, 1], transformOrigin: "center", transition: T(0.65) },
    ],
    [{ scale: 1 }, { scale: [1, 0.6, 1], transition: T(0.65) }],
  ),

  star: recipe(
    [
      { rotate: 0, scale: 1 },
      {
        rotate: [0, -16, 12, -6, 0],
        scale: [1, 1.14, 1],
        transformOrigin: "center",
        transition: T(0.8),
      },
    ],
    [{ opacity: 0 }, { opacity: [0, 0.4, 0], transition: T(0.8) }],
  ),

  bookmark: recipe(
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.6) }],
    [{ opacity: 0 }, { opacity: [0, 0.5, 0], transition: T(0.6) }],
  ),

  /* A gear turns by one tooth while its inner parts warm up. */
  gear: recipe(
    [{ rotate: 0 }, { rotate: [0, 30, 0], transition: T(0.7) }],
    [{ opacity: 0.6 }, { opacity: [0.6, 1, 0.6], transition: T(0.7) }],
  ),

  bounce: recipe(
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.5, "easeOut") }],
    [{ y: 0 }, { y: [0, -1, 0], transition: T(0.5, "easeOut") }],
  ),

  /* Money turns slightly, like a coin settling. */
  coin: recipe(
    [
      { rotate: 0, scale: 1 },
      { rotate: [0, -10, 10, 0], scale: [1, 1.06, 1], transition: T(0.7) },
    ],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.7) }],
  ),

  /* Clouds, packages and vehicles drift on a soft current. */
  float: recipe(
    [
      { x: 0, y: 0 },
      { x: [0, 1.5, 0], y: [0, -1, 0], transition: T(1.1) },
    ],
    [{ opacity: 0.5 }, { opacity: [0.5, 1, 0.5], transition: T(1.1) }],
  ),

  /* Clock hands turn while the dial stays put. */
  clock: recipe(
    [{ rotate: 0 }, { rotate: [0, 0, 0], transition: T(0.1) }],
    [
      { rotate: 0 },
      { rotate: [0, 40, 0], transformOrigin: "center", transition: T(0.8) },
    ],
  ),

  /* A page tips over and settles back. */
  flip: recipe(
    [
      { rotate: 0, scale: 1 },
      { rotate: [0, 10, -6, 0], scale: [1, 1.05, 1], transition: T(0.7) },
    ],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.7) }],
  ),

  sun: recipe(
    [{ rotate: 0 }, { rotate: [0, 40, 0], transition: T(0.9) }],
    [
      { pathLength: 1 },
      { pathLength: [0.4, 1], transition: T(0.7, "easeOut") },
    ],
  ),
  moon: recipe(
    [
      { rotate: 0, y: 0 },
      { rotate: [0, -18, 0], y: [0, 1.5, 0], transition: T(0.8) },
    ],
    [{ opacity: 0.5 }, { opacity: [0.5, 0.9, 0.5], transition: T(0.8) }],
  ),

  /* Signal bars reach upward; a battery fills a little. */
  signal: recipe(
    [{ scale: 1 }, { scale: [1, 1.06, 1], transition: T(0.6) }],
    [{ opacity: 0.3 }, { opacity: [0.3, 1, 0.3], transition: T(0.6) }],
  ),
  charge: recipe(
    [{ scaleY: 1 }, { scaleY: [1, 1.04, 1], transition: T(0.6) }],
    [
      { scaleY: 1 },
      {
        scaleY: [1, 1.15, 1],
        transformOrigin: "bottom center",
        transition: T(0.6),
      },
    ],
  ),

  /* Charts grow from their baseline. */
  grow: recipe(
    [{ y: 0 }, { y: [0, -1.5, 0], transition: T(0.6) }],
    [
      { scaleY: 1 },
      {
        scaleY: [0.65, 1.05, 1],
        transformOrigin: "bottom center",
        transition: T(0.5, "easeOut"),
      },
    ],
  ),

  /* A shield keeps its shape and draws its check. */
  shield: recipe(
    [{ scale: 1 }, { scale: [1, 1.05, 1], transition: T(0.6) }],
    [
      { pathLength: 1 },
      { pathLength: [0.4, 1], transition: T(0.6, "easeOut") },
    ],
  ),

  /* Alerts and sirens shake once, not forever. */
  shake: recipe(
    [{ x: 0 }, { x: [0, -2, 2, -1.5, 0], transition: T(0.55) }],
    [{ opacity: 1 }, { opacity: [1, 0.6, 1], transition: T(0.55) }],
  ),

  /* Information and people arrive with a small overshoot. */
  pop: recipe(
    [
      { scale: 1 },
      { scale: [1, 1.08, 0.98, 1], transition: T(0.5, "easeOut") },
    ],
    [{ opacity: 0.6 }, { opacity: [0.6, 1], transition: T(0.5) }],
  ),

  /* Files lift a corner and draw their inner line. */
  file: recipe(
    [
      { y: 0, rotate: 0 },
      { y: [0, -1.5, 0], rotate: [0, -3, 0], transition: T(0.6) },
    ],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0.3, 1], opacity: [0.4, 1], transition: T(0.55, "easeOut") },
    ],
  ),

  /* A full turn, used by loaders and refresh arrows. */
  spin: recipe([
    { rotate: 0 },
    { rotate: [0, 360], transition: { duration: 1, ease: "linear" } },
  ]),

  press: recipe(
    [{ scale: 1 }, { scale: [1, 0.94, 1], transition: T(0.4, "easeOut") }],
    [{ opacity: 1 }, { opacity: [1, 0.7, 1], transition: T(0.4) }],
  ),

  /* A loose side-to-side sway, calmer than the alert shake. */
  sway: recipe(
    [{ rotate: 0 }, { rotate: [0, -6, 5, -3, 0], transition: T(0.6) }],
    [{ x: 0 }, { x: [0, 1, -1, 0], transition: T(0.6) }],
  ),

  /* Links and networks reach outward. */
  orbit: recipe(
    [{ rotate: 0 }, { rotate: [0, 12, -6, 0], transition: T(1) }],
    [
      { pathLength: 1 },
      { pathLength: [0.2, 1], transition: T(0.6, "easeOut") },
    ],
  ),
} satisfies Record<string, IconAnimationSet>;

export type SetMotionName = keyof typeof SET_MOTIONS;

type MotionRule = [RegExp, SetMotionName];

const RULES: MotionRule[] = [
  // Transport first: a download is also an arrow.
  [/download|arrow-down-tray|cloud-arrow-down|file-arrow-down|arrow-down-to-line|arrow-down-from-line/, "drop"],
  [/upload|arrow-up-tray|cloud-arrow-up|file-arrow-up|arrow-up-from-line/, "rise"],
  [/refresh|reload|rotate|arrow-path|spinner|loader|arrow-clockwise|arrow-counter-clockwise|arrows-clockwise|arrows-counter-clockwise/, "spin"],
  [/(arrows-left-right|arrows-down-up|arrows-right-left|arrows-up-down|exchange|shuffle|swap|transfer)/, "sway"],
  [/(arrow|chevron|caret)/, "slideRight"],
  [/bell/, "ring"],
  [/heart/, "beat"],
  [/star/, "star"],
  [/bookmark|flag/, "bookmark"],
  [/search|magnif/, "focus"],
  [/mail|envelope/, "mail"],
  [/send|paper-plane|paper-airplane/, "rise"],
  [/(phone|call|megaphone|siren)/, "shake"],
  [/(chat|message|comment|inbox|speech)/, "chat"],
  [/trash|delete/, "trash"],
  [/copy|duplicate|clipboard/, "copy"],
  [/check|badge/, "check"],
  [/(plus|add)/, "plus"],
  [/(minus|remove)/, "press"],
  [/(play|pause|stop)/, "press"],
  [/(^x$|x-mark|x-circle|circle-x|^close$|^ban$|no-symbol)/, "close"],
  [/shield/, "shield"],
  [/lock/, "lock"],
  [/key/, "lock"],
  [/eye/, "eye"],
  [/gear|cog|settings|slider|adjust|wrench|hammer|tool|filter|funnel/, "gear"],
  [/(shopping-cart|shopping-bag|bag|basket|tote|handbag|storefront|cart)/, "bounce"],
  [/(credit-card|wallet|coins|coin|banknote|currency|receipt|tag|coupon|gift|percent|ticket|barcode|qr-code)/, "coin"],
  [/archive/, "file"],
  [/(truck|package|cube|box|trolley)/, "float"],
  [/(clock|timer|alarm|watch|hourglass)/, "clock"],
  [/calendar/, "flip"],
  [/sun/, "sun"],
  [/moon/, "moon"],
  [/cloud/, "float"],
  [/(wifi|signal|broadcast|rss|antenna|cell)/, "signal"],
  [/(battery|charge|plug|power|bolt|lightning|zap)/, "charge"],
  [/(chart|trend|activity|pulse|graph|presentation|analytics|stats)/, "grow"],
  [/(warning|alert|exclamation|danger|info|question|help)/, "shake"],
  [/(play|pause|stop|music|speaker|volume|microphone|mic|headphone|headset|camera|photo|image|picture|video|film|tv|television|monitor|device|smartphone|laptop|desktop|tablet|screen)/, "bounce"],
  [/(link|share|external|globe|compass|map|location|pin|navigation|route)/, "orbit"],
  [/(user|users|person|profile|smile|hand)/, "pop"],
  [/(file|document|folder|archive|note|notebook|paperclip|printer|database|server|code|terminal|bug|git|braces)/, "file"],
  [/(home|house|building|bank|hospital|hotel|school)/, "pop"],
];

const BY_CATEGORY: Record<string, SetMotionName> = {
  Navigation: "slideRight",
  Interface: "pop",
  Files: "file",
  Communication: "chat",
  Media: "bounce",
  Status: "shake",
  Commerce: "coin",
  Security: "lock",
  Nature: "sun",
  Devices: "bounce",
  People: "pop",
};

export function motionFor(name: string, category: string): SetMotionName {
  for (const [pattern, motion] of RULES) {
    if (!pattern.test(name)) continue;
    if (
      motion === "slideRight" &&
      /(left|back|previous|chevron-left|caret-left|arrow-left)/.test(name)
    ) {
      return "slideLeft";
    }
    if (motion === "slideRight" && /(up|top|chevron-up|caret-up|arrow-up)/.test(name)) {
      return "slideUp";
    }
    if (motion === "slideRight" && /(down|bottom|chevron-down|caret-down|arrow-down)/.test(name)) {
      return "slideDown";
    }
    if (motion === "shake" && /(info|question|help)/.test(name)) return "pop";
    return motion;
  }
  return BY_CATEGORY[category] ?? "pop";
}
