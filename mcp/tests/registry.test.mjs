import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../lib/registry.mjs";

test("the registry loads and keeps every catalogue item", async () => {
  const catalog = await loadCatalog();
  assert.ok(catalog.counts.total >= 150, "expected at least 150 registry items");
  assert.ok(
    catalog.counts.byCategory.icons >= 70,
    "expected the icon catalogue in every paint style",
  );
  assert.equal(catalog.counts.byCategory.components, 31);
  assert.equal(catalog.counts.byCategory.linear, 124);
  assert.equal(catalog.counts.byCategory.categories, 86);
  assert.equal(catalog.counts.byCategory.buttons, 9);
  assert.equal(catalog.counts.byCategory.texts, 10);
  assert.equal(catalog.counts.byCategory.numbers, 5);
  assert.equal(catalog.counts.byCategory.backgrounds, 9);
  assert.equal(catalog.counts.frameworks.vue, 92);
});

test("an item carries the metadata agents need", async () => {
  const catalog = await loadCatalog();
  const accordion = catalog.byName.get("accordion");
  assert.ok(accordion);
  assert.equal(accordion.category, "components");
  assert.equal(accordion.base, true);
  assert.equal(accordion.frameworks.react, true);
  assert.equal(accordion.frameworks.vue, true);
  assert.equal(accordion.frameworks.vanilla, true);
  assert.ok(accordion.docsUrl.endsWith("/docs/primitives/base-ui/accordion"));
  assert.ok(accordion.tags.includes("faq"));

  const bell = catalog.byName.get("prequel-bell");
  assert.ok(bell);
  assert.equal(bell.category, "icons");
  assert.equal(bell.iconSlug, "bell");
  assert.equal(bell.base, false);
  assert.equal(bell.frameworks.vue, false);
});

test("Components ship across every framework", async () => {
  const catalog = await loadCatalog();
  const blur = catalog.byName.get("blur");
  assert.ok(blur);
  assert.equal(blur.category, "effects");
  assert.equal(blur.frameworks.react, true);
  assert.equal(blur.frameworks.vue, true);
  assert.equal(blur.frameworks.svelte, true);
  assert.equal(blur.frameworks.solid, true);
  assert.equal(blur.frameworks.vanilla, true);
});
