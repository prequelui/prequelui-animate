import type { Framework, Recipe, TargetSnapshot } from "../types";
import { docsUrlFor, installCommandFor, SITE_URL } from "../recipes/registry";

export type InstallOutput = {
  command: string | null;
  available: boolean;
  note: string | null;
  docsUrl: string;
  framework: Framework;
};

export function installFor(
  recipe: Recipe,
  framework: Framework,
  siteUrl = SITE_URL,
): InstallOutput {
  const slug = recipe.registry[0];
  const result = installCommandFor(slug, framework, siteUrl);
  return {
    command: result.command,
    available: result.available,
    note: result.note,
    docsUrl: docsUrlFor(slug, siteUrl),
    framework,
  };
}

export function promptFor(
  recipe: Recipe,
  framework: Framework,
  target: TargetSnapshot,
  options: { stiffness?: number; damping?: number; scale?: number; duration?: number },
  siteUrl = SITE_URL,
): string {
  const slug = recipe.registry[0];
  const install = installFor(recipe, framework, siteUrl);
  const path = target.path.slice(-4).join(" › ");
  const frameworkLabel =
    framework === "vanilla" ? "JavaScript" : framework.charAt(0).toUpperCase() + framework.slice(1);
  const tuned = [
    options.stiffness ? `stiffness ${options.stiffness}` : null,
    options.damping ? `damping ${options.damping}` : null,
    options.scale ? `scale ${options.scale}` : null,
    options.duration ? `duration ${options.duration} ms` : null,
  ]
    .filter(Boolean)
    .join(", ");
  return `Use the PrequelUI Animate MCP server.

If you need the component contract, call describe_component with { "name": "${slug}" }.
If the component is not already present, call get_install_command with
{ "name": "${slug}", "framework": "${framework}" } and run the returned command.

Task: apply one motion to an existing element in this project.
- Element: <${target.tag}>${target.text ? ` "${target.text.replace(/"/g, '\\"')}"` : ""}${path ? ` in ${path}` : ""}
- Kind: ${target.kind}
- Motion: ${recipe.id} (registry: ${slug})${tuned ? ` — ${tuned}` : ""}
- Framework: ${frameworkLabel}
- Docs: ${install.docsUrl}

Constraints: do not change the copy, semantics or layout; keep focus-visible styles;
respect prefers-reduced-motion; return the exact files changed.`;
}
