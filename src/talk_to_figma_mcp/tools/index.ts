import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerComponentTools } from "./component-tools";
import { registerCreationTools } from "./creation-tools";
import { registerDocumentTools } from "./document-tools";
import { registerImageTools } from "./image-tools";
import { registerModificationTools } from "./modification-tools";
import { registerSvgTools } from "./svg-tools";
import { registerTextTools } from "./text-tools";
import { registerVariableTools } from "./variable-tools";

/**
 * Register all Figma tools to the MCP server
 * @param server - The MCP server instance
 */
export function registerTools(server: McpServer): void {
  // Register all tool categories
  registerDocumentTools(server);
  registerCreationTools(server);
  registerModificationTools(server);
  registerTextTools(server);
  registerComponentTools(server);
  registerImageTools(server);
  registerSvgTools(server);
  registerVariableTools(server);
}

// Export all tool registration functions for individual usage if needed
export {
  registerDocumentTools,
  registerCreationTools,
  registerModificationTools,
  registerTextTools,
  registerComponentTools,
  registerImageTools,
  registerSvgTools,
  registerVariableTools,
};
