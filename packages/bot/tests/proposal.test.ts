import { propose } from "../src/recipes/proposal";
import type { ProposalContext, TargetSnapshot } from "../src/types";

function target(overrides: Partial<TargetSnapshot> = {}): TargetSnapshot {
  return {
    kind: "button",
    confidence: 0.9,
    alternatives: [],
    tag: "button",
    role: null,
    text: "Start building",
    textLength: 14,
    box: { w: 160, h: 44, x: 40, y: 40 },
    fontSize: 14,
    fontWeight: 500,
    childCount: 0,
    hasImage: false,
    hasHeading: false,
    hasBorder: true,
    hasShadow: false,
    hasText: true,
    radius: 10,
    isFixed: false,
    isInteractive: true,
    existingMotion: "none",
    selector: "button",
    path: ["body", "main", "button"],
    isTextLeaf: true,
    inNav: false,
    inList: false,
    hasFormField: false,
    hasSvgOnly: false,
    bgImage: false,
    cursorPointer: true,
    redacted: false,
    ...overrides,
  };
}

const ctx: ProposalContext = { viewportW: 1440, viewportH: 900, reduced: false };

describe("propose", () => {
  it("returns exactly three unique families for a button", () => {
    const set = propose(target(), ctx);
    expect(set.proposals).toHaveLength(3);
    expect(set.proposals.map((item) => item.recipe.id)).toEqual(["press", "ripple", "magnetic"]);
    expect(new Set(set.proposals.map((item) => item.recipe.family)).size).toBe(3);
  });

  it("uses the heading table", () => {
    const set = propose(
      target({ kind: "heading", tag: "h1", fontSize: 48, text: "Build interfaces that move", textLength: 27 }),
      ctx,
    );
    expect(set.proposals.map((item) => item.recipe.id)).toEqual(["split", "gradient", "blur"]);
  });

  it("demotes the recommendation when the target already moves", () => {
    const set = propose(target({ existingMotion: "css-animation" }), ctx);
    expect(set.note).toBe("Already animated");
    expect(set.proposals[0].recipe.id).toBe("magnetic");
  });

  it("drops press and other off recipes when motion is reduced", () => {
    const set = propose(target(), { ...ctx, reduced: true });
    expect(set.note).toBe("Reduced motion is on");
    expect(set.proposals.map((item) => item.recipe.id)).not.toContain("press");
    expect(set.proposals.map((item) => item.recipe.id)).not.toContain("magnetic");
    expect(set.proposals).toHaveLength(3);
  });

  it("requires a text leaf for split", () => {
    const leaf = propose(
      target({ kind: "heading", tag: "h2", isTextLeaf: true, text: "Hello there", textLength: 11 }),
      ctx,
    );
    const block = propose(
      target({ kind: "heading", tag: "h2", isTextLeaf: false, childCount: 3, text: "Hello there", textLength: 11 }),
      ctx,
    );
    expect(leaf.proposals.map((item) => item.recipe.id)).toContain("split");
    expect(block.proposals.map((item) => item.recipe.id)).not.toContain("split");
    expect(block.proposals).toHaveLength(3);
  });

  it("excludes tilt on a full-screen card", () => {
    const set = propose(
      target({ kind: "card", box: { w: 1400, h: 880, x: 0, y: 0 }, isFixed: true }),
      ctx,
    );
    expect(set.proposals.map((item) => item.recipe.id)).not.toContain("tilt");
    expect(set.proposals).toHaveLength(3);
  });

  it("falls back for an unknown element", () => {
    const set = propose(target({ kind: "unknown", tag: "div", isInteractive: false, cursorPointer: false }), ctx);
    expect(set.proposals.map((item) => item.recipe.id)).toEqual(["fade", "slide", "blur"]);
  });

  it("keeps proposals stable between calls", () => {
    const first = propose(target({ kind: "card", box: { w: 320, h: 220, x: 20, y: 20 } }), ctx);
    const second = propose(target({ kind: "card", box: { w: 320, h: 220, x: 20, y: 20 } }), ctx);
    expect(first.proposals.map((item) => item.recipe.id)).toEqual(
      second.proposals.map((item) => item.recipe.id),
    );
  });
});
