import { getRecipe } from "../src/recipes/catalog";
import { docsUrlFor, installCommands, installCommandFor } from "../src/recipes/registry";
import { generateCode } from "../src/output/code";
import type { TargetSnapshot } from "../src/types";

const target: TargetSnapshot = {
  kind: "button",
  confidence: 0.9,
  alternatives: [],
  tag: "button",
  role: null,
  text: "Start building",
  textLength: 14,
  box: { w: 148, h: 40, x: 20, y: 20 },
  fontSize: 14,
  fontWeight: 500,
  childCount: 0,
  hasImage: false,
  hasHeading: false,
  hasBorder: true,
  hasShadow: false,
  hasText: true,
  radius: 8,
  isFixed: false,
  isInteractive: true,
  existingMotion: "none",
  selector: "button",
  path: ["body", "main", "section.hero", "button"],
  isTextLeaf: true,
  inNav: false,
  inList: false,
  hasFormField: false,
  hasSvgOnly: false,
  bgImage: false,
  cursorPointer: true,
  redacted: false,
};

describe("registry install commands", () => {
  it("exposes five frameworks for a primitive", () => {
    const commands = installCommands("tabs");
    expect(Object.keys(commands).sort()).toEqual(["react", "solid", "svelte", "vanilla", "vue"]);
    expect(commands.react).toContain("/r/react/tabs.json");
    expect(installCommands("carousel").react).toContain("/r/react/carousel.json");
    expect(commands.vue).toContain("/r/vue/tabs.json");
    expect(commands.vanilla).toContain("npx degit");
  });

  it("keeps a root effect React-only", () => {
    const commands = installCommands("button");
    expect(Object.keys(commands)).toEqual(["react"]);
    expect(commands.react).toContain("npx shadcn@latest add");
    expect(commands.react).toContain("/r/button.json");
  });

  it("falls back to React with a clear note", () => {
    const result = installCommandFor("button", "vue");
    expect(result.available).toBe(false);
    expect(result.command).toContain("shadcn@latest");
    expect(result.note).toContain("React only");
  });

  it("uses the registry documentation paths", () => {
    expect(docsUrlFor("tabs")).toContain("/components/base-ui/tabs");
    expect(docsUrlFor("button")).toContain("/components/buttons/button");
  });
});

describe("generateCode", () => {
  const press = getRecipe("press");
  const fade = getRecipe("fade");
  if (!press || !fade) throw new Error("recipes missing");

  it("emits the five framework templates", () => {
    expect(generateCode(press, {}, target, "react")).toContain('from "motion/react"');
    expect(generateCode(press, {}, target, "vue")).toContain("<script setup>");
    expect(generateCode(press, {}, target, "svelte")).toContain("pb-press");
    expect(generateCode(press, {}, target, "solid")).toContain('from "solid-js"');
    expect(generateCode(press, {}, target, "vanilla")).toContain("el?.animate");
  });

  it("injects tuned values into the snippet", () => {
    const code = generateCode(
      press,
      { duration: 700, spring: { stiffness: 600, damping: 32 }, scale: 0.95 },
      target,
      "react",
    );
    expect(code).toContain("visualDuration: 0.70");
    expect(code).toContain("stiffness: 600");
    expect(code).toContain("whileTap={{ scale: 0.95 }}");
  });

  it("includes reduced motion for entrance recipes", () => {
    const code = generateCode(fade, {}, target, "vue");
    expect(code).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("never copies a raw selector into React", () => {
    const code = generateCode(press, {}, { ...target, selector: "#hero-button" }, "react");
    expect(code).not.toContain("#hero-button");
    expect(code).not.toContain("document.querySelector");
    expect(code).toContain("Start building");
  });
});
