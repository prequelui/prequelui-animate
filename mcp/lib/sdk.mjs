import path from "node:path";
import { pathToFileURL } from "node:url";
import { REPO_ROOT } from "./registry.mjs";

const LOCAL_SDK = path.join(
  REPO_ROOT,
  "web",
  "node_modules",
  "@modelcontextprotocol",
  "sdk",
  "dist",
  "esm",
);
const LOCAL_ZOD = path.join(REPO_ROOT, "web", "node_modules", "zod", "index.js");

async function fromLocal(relative) {
  return import(pathToFileURL(path.join(LOCAL_SDK, relative)).href);
}

export async function loadServerSdk() {
  try {
    const mcp = await import("@modelcontextprotocol/sdk/server/mcp.js");
    const stdio = await import("@modelcontextprotocol/sdk/server/stdio.js");
    return {
      McpServer: mcp.McpServer,
      ResourceTemplate: mcp.ResourceTemplate,
      StdioServerTransport: stdio.StdioServerTransport,
    };
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    const mcp = await fromLocal("server/mcp.js");
    const stdio = await fromLocal("server/stdio.js");
    return {
      McpServer: mcp.McpServer,
      ResourceTemplate: mcp.ResourceTemplate,
      StdioServerTransport: stdio.StdioServerTransport,
    };
  }
}

export async function loadZod() {
  try {
    return await import("zod");
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    return import(pathToFileURL(LOCAL_ZOD).href);
  }
}

export async function loadClientSdk() {
  try {
    const client = await import("@modelcontextprotocol/sdk/client/index.js");
    const stdio = await import("@modelcontextprotocol/sdk/client/stdio.js");
    return { Client: client.Client, StdioClientTransport: stdio.StdioClientTransport };
  } catch (error) {
    if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    const client = await fromLocal("client/index.js");
    const stdio = await fromLocal("client/stdio.js");
    return { Client: client.Client, StdioClientTransport: stdio.StdioClientTransport };
  }
}
