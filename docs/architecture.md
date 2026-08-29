# Architecture

## Monorepo Structure (pnpm)
- `apps/api`: Fastify REST API.
- `apps/mcp-server`: Official MCP SDK server.
- `packages/blockchain`: viem client and read-only services.
- `packages/database`: Prisma ORM.
- `packages/shared`: Zod validation, Pino logging, Error classes.

## Tech Stack
- TypeScript, Fastify, MCP SDK, viem, PostgreSQL, Redis, Zod, Pino.
