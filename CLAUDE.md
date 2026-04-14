# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run both client and server concurrently
npm run dev

# Run only the Express server (with nodemon + TypeScript compilation)
npm run dev:server

# Run only the Next.js client
npm run dev:client
```

- **Client** runs on port `3000`
- **Server** runs on port `4000` (or `SERVER_PORT` env var)

## Environment Variables

Create a `.env` file at the project root (loaded by nodemon automatically):

```
DB=                     # MongoDB connection string
SERVER_PORT=4000        # Express server port
NEXT_PUBLIC_API_URL=    # Express URL accessible from the browser (e.g. http://localhost:4000)
NEXT_CLIENT_API_URL=    # Express URL accessible from Next.js server-side (e.g. http://localhost:4000)
```

## Architecture

This is a **full-stack portfolio app** with a hard split between client and server — two separate TypeScript configs, two separate runtimes.

### Client — `app/` (Next.js 16, React 19, Tailwind 4)

Next.js API routes in `app/*/route.ts` act as a **proxy layer** between the browser and Express. Client components fetch `/api/*`, which forwards requests to Express with the JWT cookie forwarded in the `Authorization` header.

```
Browser → Next.js API route (app/*/route.ts) → Express backend
```

### Server — `server/` (Express 5, Mongoose 9)

Standard MVC layout:

```
server/app.ts          # Entry point — DB connect, middleware, listen
server/controllers/    # Route handlers (CRUD for each resource)
server/models/         # Mongoose schemas + TypeScript interfaces
server/util.ts         # Shared regex validators (URL_REGEX, TAILWIND_COLOR_CLASS_REGEX, Proficiency enum)
```

TypeScript is compiled to `dist/` (`tsconfig.server.json` targets CommonJS/ES2020) before nodemon executes it.

### Data Models

| Model | Key fields |
|---|---|
| `Language` | name, colour (Tailwind class), proficiency (enum), icon (Lucide), similarLanguages[], projects[] |
| `Project` | name, description, shortDescription, url, githubUrl, languages[] |
| `URL` | originalUrl, shortUrl, clicks, qrCode, addedAt |
| `User` | username, password (PASSWORD_REGEX validated) |

Validation helpers in `server/util.ts` are shared across models — use them when adding new fields that need URL or Tailwind color validation.

### Tailwind

Tailwind v4 — no `tailwind.config.js`. All theme customisation goes in `app/globals.css` using `@theme { }`. The PostCSS plugin is `@tailwindcss/postcss`.
