#!/usr/bin/env node
import { loadCatalog } from "./lib/registry.mjs";
import {
  describeComponent,
  getInstallCommand,
  searchComponents,
  suggestComponents,
} from "./lib/tools.mjs";
import { loadServerSdk, loadZod } from "./lib/sdk.mjs";
import {
  botInbox,
  cancelBotRequest,
  completeBotRequest,
  getBotRequest,
} from "./lib/bot-bridge.mjs";

const SERVER_INFO = {
  name: "prequelui",
  title: "PrequelUI Animate",
  version: "1.0.0",
};

function textResult(value) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

function errorResult(error) {
  return {
    isError: true,
    content: [
      {
        type: "text",
        text: error instanceof Error ? error.message : String(error),
      },
    ],
  };
}

async function main() {
  if (process.argv.includes("--check")) {
    const catalog = await loadCatalog();
    process.stdout.write(
      `${JSON.stringify(
        {
          name: catalog.name,
          registryDir: catalog.registryDir,
          siteUrl: catalog.siteUrl,
          counts: catalog.counts,
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  const [{ McpServer, StdioServerTransport, ResourceTemplate }, { z }] =
    await Promise.all([loadServerSdk(), loadZod()]);
  const catalog = await loadCatalog();

  const server = new McpServer(SERVER_INFO, {
    instructions: [
      "You are connected to the PrequelUI Animate registry, an open-source (MIT) collection of animated shadcn/ui primitives, effects, backgrounds and icons.",
      `${catalog.counts.total} registry items are available.`,
      "Use search_components to find items by name, usage or category. Use describe_component to explain one item. Use get_install_command for the exact shadcn, shadcn-vue, shadcn-svelte, Solid or vanilla command. Use suggest_components when the user describes a page or an intention in plain words.",
      "Never invent a component name: confirm it with the tools first.",
      "Default to React unless the user names another framework. The install command already includes the registry URL.",
    ].join(" "),
  });

  server.registerTool(
    "search_components",
    {
      title: "Search components",
      description:
        "Search the PrequelUI Animate registry by component name, intended usage or category. Returns ranked components with a description, docs link and React install command.",
      inputSchema: {
        query: z
          .string()
          .optional()
          .describe('Name or words to match, for example "dialog", "copy button" or "pricing".'),
        usage: z
          .string()
          .optional()
          .describe('Plain-language use case, for example "animated entrance for a pricing page".'),
        category: z
          .enum(["components", "prequel", "buttons", "texts", "numbers", "effects", "backgrounds", "icons"])
          .optional()
          .describe("Restrict the search to one catalogue category."),
        framework: z
          .enum(["react", "vue", "svelte", "solid", "vanilla", "javascript"])
          .optional()
          .describe("Return the install command for this framework when it exists."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(50)
          .optional()
          .describe("Maximum number of results (default 10)."),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        return textResult(await searchComponents(args));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "describe_component",
    {
      title: "Describe a component",
      description:
        "Describe one PrequelUI Animate component: category, motion summary, dependencies, files, frameworks, documentation URL and every available install command.",
      inputSchema: {
        name: z
          .string()
          .min(1)
          .describe('Component name, title or slug, for example "accordion", "Copy Button" or "prequel-bell".'),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        return textResult(await describeComponent(args));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Get install command",
      description:
        "Return the exact installation command for one component and one framework. Supported frameworks: React (shadcn), Vue 3 (shadcn-vue), Svelte 5 (shadcn-svelte), Solid (shadcn CLI) and vanilla JavaScript.",
      inputSchema: {
        name: z
          .string()
          .min(1)
          .describe('Component name, title or slug, for example "tabs" or "animated bell".'),
        framework: z
          .enum(["react", "vue", "svelte", "solid", "vanilla", "javascript"])
          .optional()
          .describe("Target framework. Defaults to React."),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        return textResult(await getInstallCommand(args));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "suggest_components",
    {
      title: "Suggest components",
      description:
        "Suggest two or three PrequelUI Animate components for a plain-language request, for example \"animated entrance for my pricing page\". Explains why each one fits and includes an install command.",
      inputSchema: {
        request: z
          .string()
          .min(1)
          .describe("What the user wants to build, in their own words. French and English are both understood."),
        framework: z
          .enum(["react", "vue", "svelte", "solid", "vanilla", "javascript"])
          .optional()
          .describe("Prefer components available for this framework."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(3)
          .optional()
          .describe("Number of suggestions (default and maximum 3)."),
      },
      annotations: {
        readOnlyHint: true,
        openWorldHint: false,
      },
    },
    async (args) => {
      try {
        return textResult(await suggestComponents(args));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  if (process.env.PREQUELUI_BOT_BRIDGE) {
    server.registerTool(
      "get_bot_request",
      {
        title: "Get a PrequelUI Bot request",
        description:
          "Return the oldest queued request from the local PrequelUI Bot overlay, or one request by id. The request names the element, the chosen motion, the tuned options and the framework.",
        inputSchema: {
          id: z.string().optional().describe("Optional request id, for example req_8f3a."),
        },
        annotations: { readOnlyHint: true, openWorldHint: false },
      },
      async (args) => {
        try {
          return textResult(await getBotRequest(args));
        } catch (error) {
          return errorResult(error);
        }
      },
    );

    server.registerTool(
      "complete_bot_request",
      {
        title: "Complete a PrequelUI Bot request",
        description:
          "Mark a queued PrequelUI Bot request as done. Send a short summary and the list of files changed. The overlay shows the summary and switches the mascot to happy.",
        inputSchema: {
          id: z.string().describe("Request id."),
          summary: z.string().describe("One or two sentences for the developer."),
          files: z.array(z.string()).optional().describe("Relative paths of the files changed."),
          diff: z.string().optional().describe("Optional unified diff. Not displayed in the overlay."),
        },
        annotations: { readOnlyHint: false, openWorldHint: false },
      },
      async (args) => {
        try {
          return textResult(await completeBotRequest(args));
        } catch (error) {
          return errorResult(error);
        }
      },
    );

    server.registerTool(
      "cancel_bot_request",
      {
        title: "Cancel a PrequelUI Bot request",
        description: "Remove a queued PrequelUI Bot request and notify the overlay.",
        inputSchema: {
          id: z.string().describe("Request id."),
          reason: z.string().optional().describe("Why the request was cancelled."),
        },
        annotations: { readOnlyHint: false, openWorldHint: false },
      },
      async (args) => {
        try {
          return textResult(await cancelBotRequest(args));
        } catch (error) {
          return errorResult(error);
        }
      },
    );

    server.registerResource(
      "bot-inbox",
      "prequelui://bot/inbox",
      {
        title: "PrequelUI Bot inbox",
        description: "Queued and recently completed requests from the local overlay.",
        mimeType: "application/json",
      },
      async (uri) => {
        const value = await botInbox();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(value, null, 2),
            },
          ],
        };
      },
    );
  }

  server.registerResource(
    "catalog",
    "prequelui://catalog",
    {
      title: "PrequelUI Animate catalogue",
      description:
        "A compact JSON catalogue of every registry item, with category, tags, available frameworks and documentation URL.",
      mimeType: "application/json",
    },
    async (uri) => {
      const value = {
        name: catalog.name,
        homepage: catalog.homepage,
        counts: catalog.counts,
        items: catalog.items.map((item) => ({
          name: item.slug,
          title: item.title,
          description: item.description,
          category: item.category,
          tags: item.tags.slice(0, 8),
          frameworks: Object.keys(item.frameworks).filter((id) => item.frameworks[id]),
          docsUrl: item.docsUrl,
        })),
      };
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(value, null, 2),
          },
        ],
      };
    },
  );

  server.registerResource(
    "component",
    new ResourceTemplate("prequelui://component/{name}", { list: undefined }),
    {
      title: "PrequelUI Animate component",
      description: "The full description of one registry item.",
      mimeType: "application/json",
    },
    async (uri, variables) => {
      const value = await describeComponent({ name: variables.name });
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(value, null, 2),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);

  const shutdown = async () => {
    await server.close().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  process.stderr.write(
    `PrequelUI MCP server ready: ${catalog.counts.total} items from ${catalog.registryDir}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`PrequelUI MCP server failed: ${error?.stack ?? error}\n`);
  process.exit(1);
});
