#!/usr/bin/env node
/**
 * damo-ui MCP server entry — connects the server to stdio so an editor / agent
 * can launch it. Configure your client to run `damo-ui-mcp` (see README).
 */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.mjs'

const server = createServer()
await server.connect(new StdioServerTransport())
