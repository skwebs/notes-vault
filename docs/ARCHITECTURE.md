# Architecture - Notes Vault

## Overview
Notes Vault follows a feature-based architecture combined with the Repository-Service pattern. This ensures that the codebase is modular, maintainable, and easy to navigate.

## Core Principles
1. **Feature Isolation**: Logic related to a specific feature (e.g., Auth, Notes) is grouped within `src/features`.
2. **Separation of Concerns**:
   - **UI Layer**: React Server Components (RSC) and Client Components.
   - **Service Layer**: Business logic, coordination of multiple repositories, and external integrations (e.g., Cloudinary).
   - **Repository Layer**: Pure database access using Drizzle ORM.
   - **Data Access Layer**: Database schema and connection management.
3. **Strict Typing**: TypeScript is used throughout the application with strict mode enabled.
4. **Server-Side Security**: Authentication and validation are primarily handled on the server.

## Layer Details

### 1. UI Layer (`src/app`, `src/components`)
- **App Router**: Uses Next.js App Router for routing and layouts.
- **shadcn/ui**: Accessible and customizable UI components.
- **Tailwind CSS**: Utility-first styling.

### 2. Feature Layer (`src/features`)
Each feature directory contains:
- `components/`: Feature-specific UI components.
- `hooks/`: Feature-specific React hooks.
- `api/`: Client-side API calls (using TanStack Query).
- `schemas/`: Zod schemas for the feature.

### 3. Service Layer (`src/services`)
Services handle business logic. They are responsible for:
- Orchestrating repository calls.
- Handling file uploads via Cloudinary.
- complex validations that span multiple tables.

### 4. Repository Layer (`src/repositories`)
Repositories are responsible for all database interactions. They use Drizzle ORM to perform CRUD operations.

### 5. Data Access Layer (`src/db`)
- `schema/`: Drizzle schema definitions.
- `index.ts`: Database connection using `@neondatabase/serverless`.

## Request Flow
1. **Client**: Interaction triggers a React Query hook.
2. **API Client**: Axios makes a request to a Next.js Route Handler.
3. **Route Handler**: Validates session and input using Zod.
4. **Service**: Processes business logic.
5. **Repository**: Executes database queries.
6. **Response**: Typed JSON response sent back to the client.
