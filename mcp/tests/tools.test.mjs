import test from "node:test";
import assert from "node:assert/strict";
import {
  describeComponent,
  getInstallCommand,
  searchComponents,
  suggestComponents,
} from "../lib/tools.mjs";

test("search by name returns the exact component first", async () => {
  const result = await searchComponents({ query: "accordion" });
  assert.equal(result.count > 0, true);
  assert.equal(result.results[0].name, "accordion");
  assert.match(result.results[0].install, /\/r\/react\/accordion\.json$/);
});

test("search accepts a category", async () => {
  const result = await searchComponents({ category: "buttons", limit: 50 });
  assert.deepEqual(
    result.results.map((item) => item.name).sort(),
    [
      "button",
      "copy-button",
      "flip-button",
      "github-stars-button",
      "icon-button",
      "liquid-button",
      "ripple-button",
      "shimmer-button",
      "theme-toggler-button",
    ],
  );
});

test("search accepts a plain-language usage", async () => {
  const result = await searchComponents({ usage: "pricing page", limit: 8 });
  const names = result.results.map((item) => item.name);
  assert.ok(names.some((name) => ["tilt", "shine", "gradient-text", "highlight-text"].includes(name)));
});

test("search rejects an unknown category", async () => {
  const result = await searchComponents({ category: "nope" });
  assert.ok(result.error);
  assert.ok(result.categories.includes("effects"));
});

test("describe returns everything an agent needs", async () => {
  const result = await describeComponent({ name: "Accordion" });
  assert.equal(result.found, true);
  assert.equal(result.name, "accordion");
  assert.match(result.description, /panel/i);
  assert.ok(result.frameworks.includes("vue"));
  assert.ok(result.install.react);
  assert.ok(result.install.vue);
  assert.ok(result.related.length > 0);
});

test("describe handles icons by their short name", async () => {
  const result = await describeComponent({ name: "bell" });
  assert.equal(result.found, true);
  assert.equal(result.name, "prequel-bell");
  assert.match(result.install.react, /\/r\/react\/icons\/bell\.json$/);
  assert.equal(result.install.vue, undefined);
});

test("describe returns a helpful miss", async () => {
  const result = await describeComponent({ name: "not-a-real-component" });
  assert.equal(result.found, false);
  assert.match(result.message, /No component matched/);
});

test("install command follows the requested framework", async () => {
  const vue = await getInstallCommand({ name: "accordion", framework: "vue" });
  assert.equal(vue.available, true);
  assert.match(vue.command, /shadcn-vue@latest add .*\/r\/vue\/accordion\.json$/);

  const svelte = await getInstallCommand({ name: "accordion", framework: "svelte" });
  assert.match(svelte.command, /shadcn-svelte@latest/);

  const vanilla = await getInstallCommand({ name: "accordion", framework: "javascript" });
  assert.match(
    vanilla.command,
    /curl -fsSL --create-dirs .*\/r\/vanilla\/accordion\/accordion\.js/,
  );
});

test("linear illustrations install from their own registry folder", async () => {
  const list = await searchComponents({ category: "linear", limit: 100 });
  assert.equal(list.totalInScope, 193);
  assert.ok(list.results.some((item) => item.name === "linear-dialog"));

  const result = await getInstallCommand({
    name: "linear-dialog",
    framework: "react",
  });
  assert.equal(result.available, true);
  assert.match(
    result.command,
    /shadcn@latest add .*\/r\/react\/linear\/dialog\.json$/,
  );

  const category = await getInstallCommand({
    name: "category-bank-card",
    framework: "react",
  });
  assert.equal(category.available, true);
  assert.match(
    category.command,
    /shadcn@latest add .*\/r\/react\/categories\/bank-card\.json$/,
  );
});

test("install command uses the root registry for React-only items", async () => {
  const result = await getInstallCommand({ name: "button", framework: "react" });
  assert.equal(result.available, true);
  assert.match(result.command, /shadcn@latest add .*\/r\/button\.json$/);
});

test("install command explains a missing framework", async () => {
  const result = await getInstallCommand({ name: "bell", framework: "vue" });
  assert.equal(result.available, false);
  assert.equal(result.command, null);
  assert.match(result.note, /ships for React only|does not ship for Vue/i);
  assert.deepEqual(result.availableFrameworks, ["react"]);
});

test("suggest returns two or three relevant components", async () => {
  const result = await suggestComponents({
    request: "entrée animée pour ma page tarifs",
  });
  assert.ok(result.count >= 2 && result.count <= 3);
  const names = result.results.map((item) => item.name);
  assert.ok(
    names.some((name) =>
      ["blur", "fade", "slide", "zoom", "effect", "tilt", "shine", "auto-height"].includes(name),
    ),
    `unexpected suggestions: ${names.join(", ")}`,
  );
  for (const item of result.results) {
    assert.ok(item.reason.length > 0);
    assert.ok(item.install);
    assert.ok(item.docsUrl);
  }
});

test("suggest understands English and a framework preference", async () => {
  const result = await suggestComponents({
    request: "animated icon for a like button",
    framework: "react",
  });
  assert.ok(result.count >= 2);
  const names = result.results.map((item) => item.name);
  assert.ok(
    names.some((name) => ["prequel-heart", "prequel-star", "particles", "icon-button"].includes(name)),
    `unexpected suggestions: ${names.join(", ")}`,
  );
});

test("suggest rejects an empty request", async () => {
  const result = await suggestComponents({ request: "  " });
  assert.ok(result.error);
});
