#!/usr/bin/env node
import path from "node:path";
import { VERSION } from "./version.js";
import { TerminalBot } from "./bot.js";
import { bold, colorEnabled, dim, formatCommand, green, red, yellow } from "./color.js";
import { detectProject, describeProject, withFramework, withPackageManager } from "./detect.js";
import { buildPlan, PlanError } from "./plan.js";
import { choose, confirm } from "./prompt.js";
import { displayOutput, runStep } from "./run.js";
import {
  FRAMEWORK_LABELS,
  PACKAGE_MANAGERS,
  type FrameworkId,
  type PackageManager,
  type Plan,
  type PlanStep,
} from "./types.js";

type Args = {
  target: string;
  yes: boolean;
  dryRun: boolean;
  interactive: boolean;
  framework: FrameworkId | null;
  packageManager: PackageManager | null;
  help: boolean;
  version: boolean;
};

const HELP = `PrequelUI Animate

Usage
  npx prequelui-animate init [directory]

Options
  -y, --yes               Accept the whole plan (no questions)
      --dry-run           Show the plan, change nothing
      --framework <id>    Override detection
      --package-manager   Override the lockfile detection
  -h, --help              Show this help
  -v, --version           Print the version

Detected frameworks
  Next.js (App and Pages), Vite + React, Nuxt, Vite + Vue, SvelteKit,
  Vite + Svelte, SolidStart, Vite + Solid, Astro, Laravel + React,
  HTML / JavaScript.

The command detects the project, prints its plan, asks once, installs the
proven recipe, writes one example page and runs the build.`;

function parseArgs(argv: string[]): Args {
  const args: Args = {
    target: process.cwd(),
    yes: false,
    dryRun: false,
    interactive: Boolean(process.stdin.isTTY && process.stdout.isTTY),
    framework: null,
    packageManager: null,
    help: false,
    version: false,
  };
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]!;
    if (arg === "init") continue;
    if (arg === "-y" || arg === "--yes") args.yes = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "-h" || arg === "--help") args.help = true;
    else if (arg === "-v" || arg === "--version") args.version = true;
    else if (arg === "--framework") {
      const value = argv[++i];
      if (value && value in FRAMEWORK_LABELS) args.framework = value as FrameworkId;
    } else if (arg.startsWith("--framework=")) {
      const value = arg.slice("--framework=".length);
      if (value in FRAMEWORK_LABELS) args.framework = value as FrameworkId;
    } else if (arg === "--package-manager" || arg === "--pm") {
      const value = argv[++i];
      if (value && (PACKAGE_MANAGERS as string[]).includes(value)) {
        args.packageManager = value as PackageManager;
      }
    } else if (arg.startsWith("--package-manager=")) {
      const value = arg.slice("--package-manager=".length);
      if ((PACKAGE_MANAGERS as string[]).includes(value)) {
        args.packageManager = value as PackageManager;
      }
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }
  if (positional[0]) args.target = path.resolve(positional[0]);
  return args;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function banner(color: boolean): void {
  process.stdout.write(
    `\n  ${bold("PrequelUI Animate", color)}  ${dim(`v${VERSION}`, color)}\n`,
  );
  process.stdout.write(`  ${dim("one command, a real page, a verified build", color)}\n`);
}

function printProject(project: ReturnType<typeof detectProject>["project"], color: boolean): void {
  process.stdout.write(`\n  ${bold("Project", color)}  ${describeProject(project)}\n`);
  for (const line of project.evidence.slice(0, 6)) {
    process.stdout.write(`    ${dim("·", color)} ${line}\n`);
  }
  for (const warning of project.warnings) {
    process.stdout.write(`    ${color ? yellow("!", true) : "!"} ${warning}\n`);
  }
}

function printPlan(plan: Plan, color: boolean): void {
  process.stdout.write(`\n  ${bold("Plan", color)}  ${plan.summary}\n\n`);
  plan.steps.forEach((step, index) => {
    process.stdout.write(`  ${index + 1}. ${step.title}\n`);
    if (step.command) {
      process.stdout.write(`     ${dim("$", color)} ${formatCommand(step.args ?? [], color)}\n`);
    } else if (step.display) {
      process.stdout.write(`     ${dim(step.display, color)}\n`);
    }
    if (step.detail) {
      process.stdout.write(`     ${dim(step.detail, color)}\n`);
    }
  });
}

function printExample(plan: Plan, color: boolean): void {
  process.stdout.write(`\n  ${bold("Open it", color)}\n`);
  process.stdout.write(`    ${plan.example.devCommand}\n`);
  process.stdout.write(`    ${color ? "\u001b[4m" : ""}${plan.example.url}${color ? "\u001b[0m" : ""}\n`);
}

function stepLabel(step: PlanStep): string {
  if (step.kind === "write") return step.display ?? "write files";
  return step.command ?? step.display ?? step.title;
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const args = parseArgs(argv);
  const color = colorEnabled(process.stdout);
  const reduced =
    Boolean(process.env.PREQUELUI_REDUCED_MOTION) ||
    Boolean(process.env.CI) ||
    Boolean(process.env.NO_COLOR);
  const bot = new TerminalBot({ color, reduced });

  if (args.help) {
    process.stdout.write(`${HELP}\n`);
    return 0;
  }
  if (args.version) {
    process.stdout.write(`${VERSION}\n`);
    return 0;
  }

  banner(color);
  // In a live terminal one row animates while the bot reads, then freezes as a
  // check. CI, pipes and reduced motion get the same single line, no beat, so
  // the output stays instant and the line never appears twice.
  if (args.interactive && !reduced) {
    bot.think("Reading the project.");
    await sleep(700);
    bot.done("Reading the project.");
  } else {
    bot.start("Reading the project.");
  }
  const detection = detectProject(args.target);
  let project = detection.project;
  if (args.framework) project = withFramework(project, args.framework);
  if (args.packageManager) project = withPackageManager(project, args.packageManager);

  printProject(project, color);

  if (detection.ambiguous && !args.framework && detection.question) {
    const options = detection.candidates.map((id) => FRAMEWORK_LABELS[id]);
    const picked = await choose(detection.question, options, {
      yes: args.yes,
      interactive: args.interactive,
    });
    const index = Math.max(0, options.indexOf(picked));
    project = withFramework(project, detection.candidates[index] ?? project.framework);
    bot.note(`Using ${project.frameworkLabel}.`);
  }

  let plan: Plan;
  try {
    plan = buildPlan(project);
  } catch (error) {
    bot.stop();
    if (error instanceof PlanError) {
      bot.worried(error.message);
      if (error.hint) bot.say(error.hint);
      process.stdout.write(`\n  ${dim("Nothing was changed.", color)}\n`);
      return 1;
    }
    throw error;
  }

  if (plan.guided) {
    bot.stop();
    bot.note(plan.summary);
    bot.say(plan.guided);
    process.stdout.write(`\n  ${dim("Nothing was changed.", color)}\n`);
    return 1;
  }

  printPlan(plan, color);
  printExample(plan, color);

  if (args.dryRun) {
    bot.stop();
    process.stdout.write(`\n  ${dim("Dry run: nothing was changed.", color)}\n`);
    return 0;
  }

  const accepted = await confirm(
    `\n  Apply this plan in ${project.root}?`,
    { yes: args.yes, interactive: args.interactive },
    false,
  );
  if (!accepted) {
    bot.stop();
    bot.note("Cancelled. Nothing was changed.");
    return 0;
  }

  bot.stop();
  const total = plan.steps.length;
  for (let index = 0; index < plan.steps.length; index += 1) {
    const step = plan.steps[index]!;
    bot.step(index + 1, total, step.title);
    bot.think(stepLabel(step));
    const result = await runStep(project, step);
    bot.clear();
    if (!result.ok) {
      bot.worried(`Failed: ${step.title}`);
      if (result.error) displayOutput(result.error);
      if (step.id === "build") {
        bot.say("The files are still there. Fix the reported error, then run this command again.");
      }
      process.stdout.write(`\n  ${dim("No file was deleted.", color)}\n`);
      return 1;
    }
    process.stdout.write(`  ${color ? green("✓", true) : "✓"} ${step.title}\n`);
    if (step.id === "build" && result.output) {
      displayOutput(result.output, 8);
    }
    if (step.kind === "verify" && result.output) {
      process.stdout.write(`     ${dim(result.output, color)}\n`);
    }
  }

  process.stdout.write("\n");
  bot.happy("Installed, written and built.");
  printExample(plan, color);
  process.stdout.write(
    `\n  ${dim("The registry stays in your code: keep, edit or delete the example page.", color)}\n\n`,
  );
  return 0;
}

const isDirect =
  process.argv[1] !== undefined &&
  /(?:^|[/\\])(?:cli\.(?:js|ts)|prequelui-animate)$/.test(process.argv[1]);

if (isDirect) {
  main().then(
    (code) => {
      process.exitCode = code;
    },
    (error) => {
      process.stderr.write(`${red(error instanceof Error ? error.message : String(error), true)}\n`);
      process.exitCode = 1;
    },
  );
}
