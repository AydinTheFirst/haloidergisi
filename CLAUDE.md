# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**haloidergisi** is a monorepo containing a full-stack web application built with:

- **Runtime**: Bun
- **Monorepo Tool**: Turborepo
- **Backend**: NestJS with Drizzle ORM and PostgreSQL
- **Frontend**: React with TanStack Start
- **Linting**: oxlint
- **Formatting**: oxfmt
- **Pre-commit Hooks**: Husky + lint-staged

## Architecture

### Workspace Structure

```
apps/
├── api/          # NestJS backend server
└── web/          # React frontend (TanStack Start)

packages/
└── emails/       # Shared React Email templates
```

### Backend (`apps/api/`)

**NestJS application** with the following structure:

- `src/modules/` - Feature modules (auth, posts, categories, crews, analytics, files, messages, account, profile)
- `src/app/` - Application configuration
- `src/database/` - Database connection setup
- `src/decorators/` - Custom NestJS decorators
- `src/guards/` - Authentication and authorization guards
- `src/middlewares/` - HTTP middlewares
- `src/services/` - Shared business logic services
- `src/types/` - TypeScript types and interfaces
- `src/utils/` - Helper functions

**Key Features**:

- JWT-based authentication (Email/Password and Google OAuth)
- Drizzle ORM with PostgreSQL
- AWS S3 for file management
- Event-driven architecture with `@nestjs/event-emitter` for email notifications
- Nodemailer for transactional emails
- RBAC with ADMIN and USER roles

### Frontend (`apps/web/`)

**React application** built with TanStack Start and the following structure:

- `src/routes/` - File-based routing (TanStack Router auto-generates `routeTree.gen.ts`)
- `src/components/` - Reusable React components (uses Shadcn UI)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and configurations
- `src/store/` - Zustand stores for client-side state
- `src/schemas/` - Zod validation schemas
- `src/types/` - TypeScript types
- `src/utils/` - Helper functions
- `src/contents/` - Static content

**Key Features**:

- TanStack Router for file-based routing
- TanStack Query for server state management
- Tailwind CSS v4 + Shadcn UI for styling
- Zustand for client state management
- React Hook Form + Zod for form validation
- Recharts for analytics visualizations
- Framer Motion for animations

### Shared Packages

- **`packages/emails/`** - React Email templates for transactional emails used by the backend

## Development Commands

### Installation & Setup

```bash
bun install                    # Install dependencies
bun run db:update             # Sync Drizzle schema with database (runs migrations)
```

### Development

```bash
bun run dev                   # Start all apps in development (watch mode)
bun run dev --filter=api      # Start only API in dev mode
bun run dev --filter=web      # Start only web app in dev mode
```

### Build

```bash
bun run build                 # Build all apps and packages
```

### Testing

```bash
# Backend (NestJS + Jest)
bun run test --filter=api                # Run all API tests
bun run test:watch --filter=api          # Run API tests in watch mode
bun run test:cov --filter=api            # Run API tests with coverage

# Frontend (Vitest)
bun run test --filter=web                # Run all web tests
```

### Code Quality

```bash
bun run lint                  # Lint all files (oxlint)
bun run format                # Format all files (oxfmt)
bun run check-types           # Type check all files (tsc --noEmit)
```

### Production

```bash
bun run start                 # Build and start apps in production mode
```

### Database

```bash
bun run db:update             # Apply migrations and sync schema (generate + push)
bun run --filter=api db:studio  # Open Drizzle Studio for database GUI
```

## Database & Migrations

- **Schema Location**: `apps/api/src/database/schema/index.ts`
- **Database**: PostgreSQL managed via Drizzle
- **Config**: `apps/api/drizzle.config.ts` defines schema and migration output
- **Migrations**: Generated and pushed via `bun run db:update` (runs `drizzle-kit generate && drizzle-kit push`)
- **Environment Setup**: Uses `dotenvx` to load database credentials from `.env`
- **Database GUI**: Use `bun run --filter=api db:studio` to open Drizzle Studio

**Important**: The database schema is defined in the API app and accessed via the Drizzle client initialized in `apps/api/src/database/db-client.ts`.

## Code Organization & Patterns

### NestJS Modules

Each backend module follows a standard pattern:

- `module.ts` - Module definition with imports/exports
- `controller.ts` - HTTP endpoints and request handling
- `service.ts` - Business logic
- `dto/` - Data Transfer Objects for validation
- `entities/` - Database entity models

### Frontend Routing

- Uses **TanStack Router** with file-based routing
- Route files are in `src/routes/` and organized by hierarchy
- The route tree is auto-generated into `src/routeTree.gen.ts` — **do not edit manually**
- Layout routes use the `_layout` naming convention (e.g., `_landing.tsx`)
- Dynamic segments use `$paramName` syntax (e.g., `$postId.tsx`)

### Component Structure

- Shadcn UI components for base UI elements
- Custom components extend or combine Shadcn components
- Components should be functional and use React hooks
- Form components use React Hook Form with Zod validation

### Styling

- Use Tailwind CSS utility classes
- Maintain consistency with existing Shadcn component styling
- Color scheme managed via CSS variables (light/dark modes via `next-themes`)

## Important Tools & Configuration

### oxlint & oxfmt

- **Linter**: oxlint (fast Rust-based linter) configured in `.oxlintrc.json`
- **Formatter**: oxfmt (fast Rust-based formatter) configured in `.oxfmtrc.json`
- Runs automatically on staged files via Husky pre-commit hooks
- Use `bun run lint` and `bun run format` to manually lint/format the entire codebase

### Husky Pre-commit Hooks

- Configured in `.husky/pre-commit`
- Runs `oxfmt --write` and `oxlint --fix` on staged TypeScript files
- Prevents commits with linting/formatting issues

### Turbo Configuration

- Workspace tasks defined in `turbo.json`
- Pipeline includes dependency ordering (e.g., `dev` depends on `^db:generate`)
- Cache disabled for persistent tasks (`dev`, `start`)

### Environment Variables

- Managed with `dotenvx` for secure environment handling
- Environment files: `.env` and `.env.*.local`
- Run script: `dotenvx run -- <command>`

## Common Workflows

### Adding a New Feature

1. **Backend**: Create a new module in `apps/api/src/modules/` with controller, service, DTO, and entity files
2. **Database**: Update schema in `apps/api/src/database/schema/`, then run `bun run db:update`
3. **Frontend**: Create routes and components in `apps/web/src/routes/` and `apps/web/src/components/`
4. **Validation**: Use Zod schemas in `apps/web/src/schemas/` for form/request validation

### Running Tests During Development

```bash
# Watch mode for development
bun run test:watch --filter=api
bun run test --filter=web --watch
```

### Debugging the API

```bash
bun run debug --filter=api    # Starts with Node debugger enabled
```

## Key Dependencies

- **Backend**: NestJS, Drizzle, JWT, Argon2 (password hashing), AWS SDK, Nodemailer, Google Auth Library, React Email
- **Frontend**: React, TanStack Router/Query, Tailwind v4, Shadcn UI, Zod, React Hook Form, Zustand, Recharts, Framer Motion
- **Shared**: React Email templates

## Notes for Contributors

- Ensure all TypeScript files pass `bun run check-types` before committing
- Follow the established module/component structure for consistency
- Run `bun run format` before committing code (Husky pre-commit hooks will enforce this)
- Database changes require schema updates in `apps/api/src/database/schema/` followed by `bun run db:update`
- New routes in the frontend require regeneration of the route tree (automatic with file changes during dev)
