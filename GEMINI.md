# Project Overview: haloidergisi

`haloidergisi` is a modern web application managed as a monorepo using **Bun** and **Turborepo**. It features a NestJS backend and a React frontend built with TanStack Start.

## Architecture

The project is organized into two main workspaces:

- **`apps/`**: Contains the main applications.
  - **`api/`**: A **NestJS** backend providing a RESTful API.
    - **Database**: Prisma ORM with PostgreSQL.
    - **Authentication**: JWT-based, supporting Email/Password and Google OAuth.
    - **Storage**: AWS S3 for file management.
    - **Email**: Transactional emails using `@repo/emails` and `@nestjs-modules/mailer`.
  - **`web/`**: A **React** frontend built with **TanStack Start**.
    - **Routing & State**: TanStack Router and TanStack Query.
    - **Styling**: Tailwind CSS v4 and Shadcn UI.
    - **Charts**: Recharts for analytics visualization.
    - **Animations**: Framer Motion (`motion`).

- **`packages/`**: Shared libraries and configurations.
  - **`db/`**: Shared Prisma schema and client (`@repo/db`).
  - **`emails/`**: Shared email templates built with **React Email** (`@repo/emails`).

## Key Features

- **Authentication**: Secure login/signup, password reset, and Google OAuth integration.
- **RBAC**: Role-based access control with `ADMIN` and `USER` roles.
- **Content Management**: Create, edit, and manage posts with categories and status tracking (Draft, Published, Archived).
- **Crew Management**: Organize users into groups ("Crews").
- **Analytics**: Track and visualize page visits.
- **File Management**: Upload and manage files via AWS S3.
- **Messaging**: Contact form functionality with message storage.
- **Responsive UI**: Modern, responsive dashboard and landing pages.

## Development Workflow

### Key Commands

- **Install Dependencies**: `bun install`
- **Development**: `bun run dev` (Runs all apps in dev mode)
- **Build**: `bun run build` (Builds all apps and packages)
- **Database Update**: `bun run db:update` (Syncs Prisma schema with the database)
- **Linting**: `bun run lint` (Uses `oxlint` for fast linting)
- **Formatting**: `bun run format` (Uses `oxfmt` for fast formatting)
- **Production Start**: `bun run start` (Runs the project in production mode)

### Configuration

- **Environment Variables**: Managed using `dotenvx`.
- **Pre-commit Hooks**: Managed with `husky` and `lint-staged`, running `oxfmt` and `oxlint` on staged files.

## Technical Details

- **Backend Logic**: Organized into NestJS modules (`src/modules`) covering `auth`, `users`, `posts`, `analytics`, etc.
- **Frontend Routing**: Uses file-based routing via TanStack Router. The route tree is generated into `src/routeTree.gen.ts`.
- **Database Schema**: Defined in `packages/db/prisma/schema.prisma`.
- **Email Templates**: Located in `packages/emails/src/emails`.

## Coding Conventions

- **Consistency**: Follow the established NestJS module structure for backend changes.
- **Type Safety**: Ensure strict TypeScript usage throughout the project.
- **Styling**: Use Tailwind CSS utility classes and Shadcn components for UI consistency.
- **Testing**: Backend tests use Jest; frontend tests use Vitest.
