import { createRequire } from "node:module";
import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const repo = path.resolve(root, "..");

function loadEsbuild() {
  const candidates = [
    path.join(repo, "web", "node_modules", "esbuild"),
    "/home/claude2/travail/saas/_modele/node_modules/esbuild",
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {}
  }
  throw new Error("esbuild not found");
}

const esbuild = loadEsbuild();
const dist = path.join(root, "dist");
await mkdir(dist, { recursive: true });

const common = {
  bundle: true,
  target: "es2020",
  legalComments: "none",
  loader: { ".css": "text" },
  logLevel: "info",
};

await esbuild.build({
  ...common,
  entryPoints: [path.join(root, "src", "index.ts")],
  outfile: path.join(dist, "core.js"),
  format: "esm",
});

await esbuild.build({
  ...common,
  entryPoints: [path.join(root, "src", "script.ts")],
  outfile: path.join(dist, "v2.js"),
  format: "iife",
  minify: true,
});

for (const [entry, outfile, external] of [
  ["react.tsx", "react.js", ["react", "react-dom"]],
  ["vue.ts", "vue.js", ["vue"]],
  ["svelte.ts", "svelte.js", ["svelte"]],
  ["solid.tsx", "solid.js", ["solid-js"]],
]) {
  await esbuild.build({
    ...common,
    entryPoints: [path.join(root, "src", "adapters", entry)],
    outfile: path.join(dist, outfile),
    format: "esm",
    jsx: "automatic",
    external: [...external, "@prequelui/bot"],
  });
}

await mkdir(path.join(repo, "web", "public", "bot"), { recursive: true });
await cp(path.join(dist, "v2.js"), path.join(repo, "web", "public", "bot", "v2.js"));
console.log("built dist + web/public/bot/v2.js");
