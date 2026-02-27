# AGENTS.md - Claude Talk to Figma MCP

This document provides guidelines for AI agents working on this codebase.

## Project Overview

A Model Context Protocol (MCP) server that enables Claude to interact with Figma. Built with TypeScript, uses Bun as the primary runtime, and supports DXT packaging for distribution.

## Build System

**Always use Bun, never npm/yarn.**

### Build Commands

```bash
# Standard build (ESM for development)
bun run build

# Build for DXT distribution (CJS format)
bun run build:cjs

# Watch mode for development
bun run dev

# Build DXT package
bun run build:dxt
```

### Test Commands

```bash
# Run all tests
bun run test

# Run single test file
bun run jest -- tests/unit/utils/defaults.test.ts

# Run tests matching a pattern
bun run jest -- --testNamePattern="should validate"

# Watch mode
bun run test:watch

# Coverage report
bun run test:coverage

# Integration tests
bun run test:integration
```

### Lint Commands

```bash
# Check code formatting/linting
bun run lint

# Auto-fix issues
bun run lint --apply
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: Always use explicit types, avoid `any`
- **ES2022 target**: Use modern JavaScript features
- **ESM modules**: All imports use `.js` extension (e.g., `import { x } from "./utils.js"`)

### Imports

Order imports as follows:
1. External dependencies (e.g., `zod`, `@modelcontextprotocol/sdk`)
2. Internal utilities with `type` keyword for type-only imports
3. Local modules

```typescript
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { filterFigmaNode } from "../utils/figma-helpers.js";
import { joinChannel } from "../utils/websocket.js";
```

### Formatting

- **Indent**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Trailing commas**: Always in multi-line objects/arrays
- Use Biome for linting/formatting

### Naming Conventions

- **Functions**: camelCase (e.g., `registerDocumentTools`)
- **Types/Interfaces**: PascalCase (e.g., `FigmaCommand`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Files**: kebab-case (e.g., `document-tools.ts`)

### Error Handling

Always wrap tool handlers in try-catch blocks and return proper error responses:

```typescript
async () => {
  try {
    const result = await someOperation();
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error description: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
};
```

### Schema Validation

Use Zod v4 for all tool parameter schemas. Always use `.describe()` for documentation:

```typescript
{
  nodeId: z.string().describe("The ID of the node to get information about"),
  format: z.enum(["PNG", "JPG", "SVG", "PDF"]).optional().describe("Export format"),
}
```

## Project Structure

```
src/
├── talk_to_figma_mcp/
│   ├── server.ts           # MCP server entry point
│   ├── config/
│   │   └── config.ts       # Server configuration
│   ├── tools/              # Tool implementations
│   │   ├── index.ts        # Tool registration
│   │   ├── document-tools.ts
│   │   ├── creation-tools.ts
│   │   └── ...
│   ├── prompts/            # Prompt templates
│   ├── utils/              # Utility functions
│   └── types/              # TypeScript type definitions
├── socket.ts               # WebSocket server for Figma plugin
└── claude_mcp_plugin/      # Figma plugin code

tests/
├── unit/                   # Unit tests
├── integration/            # Integration tests
└── setup.ts                # Test setup
```

## Key Dependencies

- `@modelcontextprotocol/sdk`: MCP SDK (v1.27.1+)
- `zod`: Schema validation (v4.3.6+)
- `ws`: WebSocket library
- `bun-types`: Bun runtime types

## Development Workflow

1. Make changes to TypeScript source
2. Run `bun run dev` for watch mode, or `bun run build` to test build
3. Run `bun run test` to verify tests pass
4. Run `bun run lint` to check code style
5. For DXT release: `bun run build:dxt`

## Important Notes

- **Bun-only**: This project uses Bun-specific features (`Bun.serve`)
- **No npm publish from agent**: Do not run `npm publish` or `bun run pub:release`
- **Test timeout**: Default 10s, use longer timeout for integration tests
- **Platform support**: macOS, Linux, Windows (via DXT)
