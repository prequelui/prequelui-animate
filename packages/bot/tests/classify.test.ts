import { classifySignals } from "../src/analyze/classify";
import type { TargetSignals } from "../src/types";

function signals(overrides: Partial<TargetSignals> = {}): TargetSignals {
  return {
    tag: "div",
    role: null,
    inputType: null,
    href: null,
    text: "",
    textLength: 0,
    w: 100,
    h: 40,
    viewportW: 1440,
    viewportH: 900,
    fontSize: 16,
    fontWeight: 400,
    childCount: 0,
    elementChildren: 0,
    hasImage: false,
    hasHeading: false,
    hasBorder: false,
    hasShadow: false,
    radius: 0,
    isFixed: false,
    isInteractive: false,
    cursorPointer: false,
    bgImage: false,
    inNav: false,
    inList: false,
    listLength: 0,
    hasFormField: false,
    submitButton: false,
    hasSvgOnly: false,
    hasSvg: false,
    tableCells: 0,
    tableRows: 0,
    isDialog: false,
    roleStatus: false,
    numberLike: false,
    inlineOnly: false,
    hasValueField: false,
    ...overrides,
  };
}

describe("classifySignals", () => {
  it("recognises a button", () => {
    const result = classifySignals(
      signals({ tag: "button", text: "Start building", textLength: 14, isInteractive: true, cursorPointer: true }),
    );
    expect(result.kind).toBe("button");
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it("recognises a semantic link", () => {
    const result = classifySignals(
      signals({ tag: "a", href: "/docs", text: "Docs", textLength: 4, isInteractive: true, cursorPointer: true }),
    );
    expect(result.kind).toBe("link");
  });

  it("recognises a padded card with shadow", () => {
    const result = classifySignals(
      signals({
        tag: "div",
        w: 340,
        h: 220,
        radius: 14,
        hasBorder: true,
        hasShadow: true,
        hasHeading: true,
        childCount: 3,
        elementChildren: 3,
        text: "Build faster",
        textLength: 12,
      }),
    );
    expect(result.kind).toBe("card");
  });

  it("keeps a heading ahead of a card", () => {
    const result = classifySignals(
      signals({ tag: "h1", text: "Build interfaces that move", textLength: 27, fontSize: 48, fontWeight: 600 }),
    );
    expect(result.kind).toBe("heading");
  });

  it("distinguishes a list from a list item", () => {
    const list = classifySignals(signals({ tag: "ul", listLength: 3, childCount: 3 }));
    const item = classifySignals(signals({ tag: "li", inList: true, listLength: 3 }));
    expect(list.kind).toBe("list");
    expect(item.kind).toBe("list-item");
  });

  it("recognises images, icons and avatars", () => {
    expect(classifySignals(signals({ tag: "img", w: 480, h: 320 })).kind).toBe("image");
    expect(classifySignals(signals({ tag: "svg", w: 20, h: 20, hasSvgOnly: true })).kind).toBe("icon");
    expect(classifySignals(signals({ tag: "img", w: 40, h: 40, radius: 20 })).kind).toBe("avatar");
  });

  it("recognises form controls", () => {
    expect(classifySignals(signals({ tag: "input", inputType: "text", isInteractive: true })).kind).toBe("input");
    expect(
      classifySignals(signals({ tag: "form", hasFormField: true, submitButton: true, childCount: 2 })).kind,
    ).toBe("form");
  });

  it("recognises dialogs and toasts", () => {
    expect(classifySignals(signals({ tag: "div", role: "dialog", isDialog: true })).kind).toBe("modal");
    expect(classifySignals(signals({ tag: "div", roleStatus: true, isFixed: true, w: 300 })).kind).toBe("toast");
  });

  it("returns unknown for a plain empty div", () => {
    const result = classifySignals(signals());
    expect(result.kind).toBe("unknown");
    expect(result.confidence).toBeLessThan(0.55);
  });
});
