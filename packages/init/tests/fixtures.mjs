import fs from "node:fs";
import os from "node:os";
import path from "node:path";

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const nextApp = {
  name: "next-app",
  description: "Next.js App Router, TypeScript, Tailwind v4, shadcn configured, npm",
  expect: {
    framework: "next-app",
    runtime: "react",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: true,
    srcDir: false,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      name: "next-app",
      private: true,
      scripts: { dev: "next dev", build: "next build" },
      dependencies: { next: "16.0.0", react: "19.2.0", "react-dom": "19.2.0" },
      devDependencies: { typescript: "^5.9.0", tailwindcss: "^4.1.0", "@types/react": "^19.2.0" },
    }),
    "package-lock.json": "{}\n",
    "tsconfig.json": json({
      compilerOptions: { paths: { "@/*": ["./src/*"] } },
    }),
    "app/layout.tsx": "export default function Layout({ children }: { children: React.ReactNode }) { return <html><body>{children}</body></html>; }\n",
    "app/page.tsx": "export default function Page() { return <main>Home</main>; }\n",
    "app/globals.css": '@import "tailwindcss";\n',
    "components.json": json({ aliases: { components: "@/components", utils: "@/lib/utils" } }),
  },
};

const nextPages = {
  name: "next-pages",
  description: "Next.js Pages Router, JavaScript, Tailwind v4, no components.json, npm",
  expect: {
    framework: "next-pages",
    runtime: "react",
    packageManager: "npm",
    typescript: false,
    tailwind: "v4",
    shadcn: false,
    srcDir: false,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      dependencies: { next: "16.0.0", react: "19.2.0", "react-dom": "19.2.0" },
      devDependencies: { tailwindcss: "^4.0.0" },
    }),
    "package-lock.json": "{}\n",
    "pages/index.jsx": "export default function Home() { return null; }\n",
    "styles/globals.css": '@import "tailwindcss";\n',
  },
};

const viteReact = {
  name: "vite-react",
  description: "Vite + React, TypeScript, Tailwind v4, no components.json, npm",
  expect: {
    framework: "vite-react",
    runtime: "react",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      scripts: { dev: "vite", build: "tsc -b && vite build" },
      dependencies: { react: "^19.2.0", "react-dom": "^19.2.0" },
      devDependencies: { vite: "^8.0.0", typescript: "~5.9.0", tailwindcss: "^4.1.0", "@tailwindcss/vite": "^4.1.0" },
    }),
    "package-lock.json": "{}\n",
    "tsconfig.json": json({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    "vite.config.ts": 'import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\nexport default defineConfig({ plugins: [react()] });\n',
    "src/main.tsx": "export {};\n",
    "src/index.css": '@import "tailwindcss";\n',
  },
};

const nuxt = {
  name: "nuxt",
  description: "Nuxt, TypeScript, Tailwind v4, no components.json, pnpm",
  expect: {
    framework: "nuxt",
    runtime: "vue",
    packageManager: "pnpm",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: false,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      scripts: { dev: "nuxt dev", build: "nuxt build" },
      dependencies: { nuxt: "^4.0.0", vue: "^3.5.0" },
      devDependencies: { typescript: "^5.9.0", tailwindcss: "^4.1.0", "@tailwindcss/vite": "^4.1.0" },
    }),
    "pnpm-lock.yaml": "lockfileVersion: 9\n",
    "nuxt.config.ts": "export default defineNuxtConfig({ compatibilityDate: '2026-01-01' });\n",
    "tsconfig.json": json({ extends: "./.nuxt/tsconfig.json" }),
    "app/app.vue": "<template><div>Nuxt</div></template>\n",
    "app/assets/css/main.css": '@import "tailwindcss";\n',
  },
};

const viteVue = {
  name: "vite-vue",
  description: "Vite + Vue, TypeScript, Tailwind v4, components.json, yarn",
  expect: {
    framework: "vite-vue",
    runtime: "vue",
    packageManager: "yarn",
    typescript: true,
    tailwind: "v4",
    shadcn: true,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      scripts: { dev: "vite", build: "vue-tsc -b && vite build" },
      dependencies: { vue: "^3.5.0" },
      devDependencies: { vite: "^8.0.0", typescript: "~5.9.0", tailwindcss: "^4.1.0" },
    }),
    "yarn.lock": "# yarn\n",
    "tsconfig.json": json({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    "vite.config.ts": 'import { defineConfig } from "vite";\nimport vue from "@vitejs/plugin-vue";\nexport default defineConfig({ plugins: [vue()] });\n',
    "src/main.ts": "export {};\n",
    "src/style.css": '@import "tailwindcss";\n',
    "components.json": "{}",
  },
};

const sveltekit = {
  name: "sveltekit",
  description: "SvelteKit, TypeScript, Tailwind v4, no components.json, bun",
  expect: {
    framework: "sveltekit",
    runtime: "svelte",
    packageManager: "bun",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      scripts: { dev: "vite dev", build: "vite build" },
      devDependencies: { "@sveltejs/kit": "^3.0.0", svelte: "^5.0.0", vite: "^8.0.0", typescript: "^5.9.0", tailwindcss: "^4.1.0" },
    }),
    "bun.lock": "{}\n",
    "svelte.config.js": "export default {};\n",
    "tsconfig.json": json({}),
    "src/routes/+page.svelte": "<h1>SvelteKit</h1>\n",
    "src/app.css": '@import "tailwindcss";\n',
  },
};

const viteSvelte = {
  name: "vite-svelte",
  description: "Vite + Svelte, TypeScript, no Tailwind yet, npm",
  expect: {
    framework: "vite-svelte",
    runtime: "svelte",
    packageManager: "npm",
    typescript: true,
    tailwind: null,
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      scripts: { dev: "vite", build: "vite build" },
      devDependencies: { svelte: "^5.0.0", vite: "^8.0.0", typescript: "^5.9.0", "@sveltejs/vite-plugin-svelte": "^6.0.0" },
    }),
    "package-lock.json": "{}\n",
    "tsconfig.json": json({}),
    "vite.config.ts": 'import { defineConfig } from "vite";\nimport { svelte } from "@sveltejs/vite-plugin-svelte";\nexport default defineConfig({ plugins: [svelte()] });\n',
    "src/main.ts": "export {};\n",
  },
};

const solidStart = {
  name: "solid-start",
  description: "SolidStart, TypeScript, Tailwind v4, components.json, npm",
  expect: {
    framework: "solid-start",
    runtime: "solid",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: true,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      scripts: { dev: "vinxi dev", build: "vinxi build" },
      dependencies: { "@solidjs/start": "^2.0.0", "solid-js": "^1.9.0" },
      devDependencies: { typescript: "^5.9.0", tailwindcss: "^4.1.0" },
    }),
    "package-lock.json": "{}\n",
    "app.config.ts": "export default { server: { preset: 'node-server' } };\n",
    "tsconfig.json": json({ compilerOptions: { paths: { "~/*": ["./src/*"] } } }),
    "src/routes/index.tsx": "export default function Home() { return <main>Home</main>; }\n",
    "src/app.css": '@import "tailwindcss";\n',
    "components.json": json({ aliases: { components: "~/components" } }),
  },
};

const viteSolid = {
  name: "vite-solid",
  description: "Vite + Solid, TypeScript, Tailwind v4, no components.json, npm",
  expect: {
    framework: "vite-solid",
    runtime: "solid",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      scripts: { dev: "vite", build: "vite build" },
      dependencies: { "solid-js": "^1.9.0" },
      devDependencies: { vite: "^8.0.0", "vite-plugin-solid": "^2.11.0", typescript: "^5.9.0", tailwindcss: "^4.1.0" },
    }),
    "package-lock.json": "{}\n",
    "tsconfig.json": json({}),
    "vite.config.ts": 'import { defineConfig } from "vite";\nimport solid from "vite-plugin-solid";\nexport default defineConfig({ plugins: [solid()] });\n',
    "src/index.tsx": "export {};\n",
    "src/index.css": '@import "tailwindcss";\n',
  },
};

const astro = {
  name: "astro",
  description: "Astro with React, TypeScript, Tailwind v4, npm",
  expect: {
    framework: "astro",
    runtime: "react",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      dependencies: { astro: "^5.0.0", react: "^19.2.0", "react-dom": "^19.2.0", "@astrojs/react": "^4.0.0" },
      devDependencies: { typescript: "^5.9.0", tailwindcss: "^4.1.0", "@tailwindcss/vite": "^4.1.0" },
    }),
    "package-lock.json": "{}\n",
    "astro.config.mjs": "export default {};\n",
    "tsconfig.json": json({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    "src/pages/index.astro": "<h1>Astro</h1>\n",
    "src/styles/global.css": '@import "tailwindcss";\n',
  },
};

const laravel = {
  name: "laravel",
  description: "Laravel + React/Vite, Tailwind v4, npm",
  expect: {
    framework: "laravel",
    runtime: "react",
    packageManager: "npm",
    typescript: true,
    tailwind: "v4",
    shadcn: false,
    srcDir: false,
    ambiguous: false,
  },
  files: {
    "composer.json": json({ require: { php: "^8.3" } }),
    "package.json": json({
      devDependencies: { "laravel-vite-plugin": "^2.0.0", vite: "^8.0.0", react: "^19.2.0", tailwindcss: "^4.1.0", typescript: "^5.9.0" },
    }),
    "package-lock.json": "{}\n",
    "resources/views/welcome.blade.php": "<h1>Laravel</h1>\n",
    "resources/css/app.css": '@import "tailwindcss";\n',
    "resources/js/app.tsx": "export {};\n",
    "tsconfig.json": json({}),
  },
};

const html = {
  name: "html",
  description: "One HTML file, no package.json, npm fallback",
  expect: {
    framework: "html",
    runtime: "vanilla",
    packageManager: "npm",
    typescript: false,
    tailwind: null,
    shadcn: false,
    srcDir: false,
    ambiguous: false,
  },
  files: {
    "index.html": "<!doctype html><html><body><h1>Plain</h1></body></html>\n",
  },
};

const ambiguous = {
  name: "ambiguous",
  description: "Both Nuxt and Astro declared, no config file: the CLI must ask",
  expect: {
    framework: "nuxt",
    runtime: "vue",
    packageManager: "pnpm",
    typescript: true,
    tailwind: null,
    shadcn: false,
    srcDir: false,
    ambiguous: true,
  },
  files: {
    "package.json": json({
      dependencies: { nuxt: "^4.0.0", astro: "^5.0.0", vue: "^3.5.0" },
      devDependencies: { typescript: "^5.9.0" },
    }),
    "pnpm-lock.yaml": "lockfileVersion: 9\n",
    "tsconfig.json": json({}),
  },
};

const tailwindV3 = {
  name: "tailwind-v3",
  description: "Vite + React with Tailwind v3 and a config file, npm",
  expect: {
    framework: "vite-react",
    runtime: "react",
    packageManager: "npm",
    typescript: true,
    tailwind: "v3",
    shadcn: false,
    srcDir: true,
    ambiguous: false,
  },
  files: {
    "package.json": json({
      type: "module",
      dependencies: { react: "^19.2.0", "react-dom": "^19.2.0" },
      devDependencies: { vite: "^8.0.0", typescript: "~5.9.0", tailwindcss: "^3.4.0" },
    }),
    "package-lock.json": "{}\n",
    "tsconfig.json": json({}),
    "tailwind.config.js": "export default { content: ['./src/**/*.{ts,tsx}'] };\n",
    "src/main.tsx": "export {};\n",
    "src/index.css": "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
  },
};

export const FIXTURES = [
  nextApp,
  nextPages,
  viteReact,
  nuxt,
  viteVue,
  sveltekit,
  viteSvelte,
  solidStart,
  viteSolid,
  astro,
  laravel,
  html,
  ambiguous,
  tailwindV3,
];

export function createFixtures(base) {
  const root = fs.mkdtempSync(path.join(base, "prequelui-init-"));
  const paths = {};
  for (const fixture of FIXTURES) {
    const dir = path.join(root, fixture.name);
    for (const [file, content] of Object.entries(fixture.files)) {
      const target = path.join(dir, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, content);
    }
    paths[fixture.name] = dir;
  }
  return { root, paths };
}

export function defaultBase() {
  return process.env.INIT_FIXTURES_DIR || path.join(os.tmpdir(), "opencode");
}
