import assert from "node:assert/strict";
import {
  CODE_CSS,
  CODE_RUNTIME,
  astroDemo,
  highlightCode,
  jsString,
  reactDemo,
  solidDemo,
  svelteDemo,
  vueDemo,
} from "../dist/templates.js";
import { summarise, writeJson } from "./lib.mjs";

const paths = {
  button: "@/components/prequelui/button",
  gradient: "@/components/prequelui/gradient-text",
  typing: "@/components/prequelui/typing-text",
};

const rows = [];
const check = (name, fn) => {
  try {
    fn();
    rows.push({ name, ok: true });
  } catch (error) {
    rows.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) });
  }
};

const demos = [
  ["react", reactDemo(paths)],
  ["vue", vueDemo(paths)],
  ["svelte", svelteDemo(paths)],
  ["solid", solidDemo(paths)],
  ["astro", astroDemo(paths)],
];

for (const [name, source] of demos) {
  check(`${name} shows a highlighted code card`, () => {
    assert.ok(source.includes("prequel-code"));
    assert.ok(source.includes("prequel-code__copy"));
    assert.ok(source.includes("data-prequel-copy"));
    assert.ok(source.includes("pc-key"));
  });
  check(`${name} keeps the code multi-line and indented`, () => {
    const escapedLines = (source.match(/\\n/g) ?? []).length;
    assert.ok(escapedLines >= 3, `${escapedLines} escaped line breaks`);
    assert.ok(source.includes("  "), "indentation is kept");
    assert.ok(!source.includes("whitespace-pre-wrap break-all"));
  });
  check(`${name} installs the copy runtime`, () => {
    assert.ok(source.includes("initPrequelCode"));
    assert.ok(source.includes("navigator.clipboard"));
    assert.ok(source.includes("execCommand"));
  });
  check(`${name} carries the code styles`, () => {
    assert.ok(source.includes("--pc-bg"));
    assert.ok(source.includes(".prequel-code__pre"));
    assert.ok(source.includes("white-space:pre-wrap"));
  });
}

check("highlight escapes tags and colours tokens", () => {
  const html = highlightCode('<Button text="Hi / there">{x}</Button>');
  assert.ok(html.includes("pc-tag"));
  assert.ok(html.includes("pc-str"));
  assert.ok(html.includes("pc-pun"));
  assert.ok(!html.includes("<Button"));
  assert.ok(html.includes("&lt;Button"));
  assert.ok(html.includes("/<wbr>"));
});

check("script strings cannot close their own script tag", () => {
  const value = jsString("</script><script>");
  assert.ok(value.includes("\\u003c"));
  assert.ok(!value.includes("</script>"));
});

check("code css and runtime stay framework-free", () => {
  assert.ok(CODE_CSS.includes("prefers-reduced-motion") === false);
  assert.ok(CODE_RUNTIME.includes("querySelectorAll"));
  assert.ok(CODE_RUNTIME.includes("createElement"));
  assert.ok(!CODE_RUNTIME.includes("import "));
  const factory = new Function(`${CODE_RUNTIME}\nreturn initPrequelCode;`);
  assert.equal(typeof factory(), "function");
});

const summary = summarise(rows);
writeJson("example-page.json", {
  generatedAt: new Date().toISOString(),
  summary,
  tests: rows,
});
console.log(`example-page: ${summary.passed}/${summary.total}`);
if (!summary.ok) {
  for (const row of rows.filter((entry) => !entry.ok)) console.error(`  ✗ ${row.name}: ${row.detail}`);
  process.exitCode = 1;
} else {
  for (const row of rows) console.log(`  ✓ ${row.name}`);
}
