# GEMINI.md

This file provides foundational mandates and instructional context for Gemini CLI when working in this repository.

## Project Overview

**haloidergisi** is a high-performance full-stack monorepo built for a digital magazine platform. It leverages a modern TypeScript-first stack for both speed and type safety.

- **Monorepo Management**: [Turborepo](https://turbo.build/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Backend**: [NestJS](https://nestjs.com/) with [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL)
- **Frontend**: [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (React, Router, Query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Tooling**: [oxlint](https://oxc.rs/docs/guide/usage/linter.html) (Linting), [oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) (Formatting), [dotenvx](https://dotenvx.com/) (Environment Management)

## Workspace Architecture

```text
/
├── apps/
│   ├── api/          # NestJS backend server
│   └── web/          # React frontend (TanStack Start)
├── packages/
│   ├── db/           # Shared Drizzle schema (packages/db/src/schema.ts) and client
│   └── emails/       # Shared React Email templates
```

## Critical Commands

### Setup & Development
- `bun install` - Install all workspace dependencies.
- `bun run dev` - Start all applications in development mode (parallel watch).
- `bun run dev --filter=api` - Start only the backend.
- `bun run dev --filter=web` - Start only the frontend.

### Database
- `bun run db:update` - Synchronize schema changes with the database (runs migrations).
- `bun run db:generate` - Generate the Drizzle client (typically runs automatically).

### Quality & Maintenance
- `bun run lint` - Run `oxlint` across the workspace.
- `bun run format` - Run `oxfmt` to format all files.
- `bun run type-check` - Run type checking across the workspace.
- `bun run build` - Build all applications for production.

## Engineering Standards & Conventions

### 1. Backend (NestJS)
- **Modular Design**: Group functionality by feature in `apps/api/src/modules/`.
- **Structure**: Each module should typically contain:
  - `<feature>.module.ts`: Module definition.
  - `<feature>.controller.ts`: Endpoint definitions and request handling.
  - `<feature>.service.ts`: Business logic and database interactions.
  - `dto/`: Data Transfer Objects for validation.
- **Validation**: Use `ValidationPipe` with class-validator (DTOs).

### 2. Frontend (TanStack Start)
- **Routing**: File-based routing in `apps/web/src/routes/`.
- **Layouts**: Use `__root.tsx` for global layout and `_layout.tsx` (e.g., `_landing.tsx`) for grouped layouts.
- **State Management**:
  - **Server State**: TanStack Query.
  - **Client State**: Zustand (stores in `apps/web/src/store/`).
- **Components**: Utilize Shadcn UI components located in `apps/web/src/components/ui/`. Extend or wrap them for specific features.
- **Forms**: Use `react-hook-form` with `zod` for validation.

### 3. Database (Drizzle)
- **Schema**: Defined in `packages/db/src/schema.ts`. This is the single source of truth for the database structure.
- **Migrations**: Managed via Drizzle. Always run `bun run db:update` after modifying the schema.

### 4. General
- **Linting & Formatting**: `oxlint` and `oxfmt` are used for speed. Husky pre-commit hooks enforce these standards.
- **Environment Variables**: Use `dotenvx` to manage `.env` files. Do not commit `.env` files.

## Additional Context
Refer to `CLAUDE.md` for more granular development notes and common workflow examples.
