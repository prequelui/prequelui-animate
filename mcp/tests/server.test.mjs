import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadClientSdk } from "../lib/sdk.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(HERE, "..", "server.mjs");

test(
  "the stdio server exposes the four tools and serves the registry",
  { timeout: 30000 },
  async () => {
    const { Client, StdioClientTransport } = await loadClientSdk();
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [SERVER],
      stderr: "pipe",
    });
    transport.stderr?.on("data", (chunk) => {
      process.stderr.write(`[prequelui-mcp] ${chunk}`);
    });
    const client = new Client({ name: "prequelui-test", version: "1.0.0" });
    await client.connect(transport);

    try {
      const tools = await client.listTools();
      assert.deepEqual(
        tools.tools.map((tool) => tool.name).sort(),
        [
          "describe_component",
          "get_install_command",
          "search_components",
          "suggest_components",
        ],
      );

      const search = await client.callTool({
        name: "search_components",
        arguments: { query: "accordion" },
      });
      const searchValue = JSON.parse(search.content[0].text);
      assert.equal(searchValue.results[0].name, "accordion");

      const description = await client.callTool({
        name: "describe_component",
        arguments: { name: "blur" },
      });
      const descriptionValue = JSON.parse(description.content[0].text);
      assert.equal(descriptionValue.found, true);
      assert.equal(descriptionValue.category, "effects");

      const install = await client.callTool({
        name: "get_install_command",
        arguments: { name: "accordion", framework: "vue" },
      });
      const installValue = JSON.parse(install.content[0].text);
      assert.match(installValue.command, /shadcn-vue@latest/);

      const suggestion = await client.callTool({
        name: "suggest_components",
        arguments: { request: "animated entrance for my pricing page" },
      });
      const suggestionValue = JSON.parse(suggestion.content[0].text);
      assert.ok(suggestionValue.count >= 2 && suggestionValue.count <= 3);

      const resources = await client.listResources();
      assert.ok(resources.resources.some((resource) => resource.uri === "prequelui://catalog"));

      const catalog = await client.readResource({ uri: "prequelui://catalog" });
      const catalogValue = JSON.parse(catalog.contents[0].text);
      assert.ok(catalogValue.items.length >= 100);
    } finally {
      await client.close();
    }
  },
);
