# Tasteorama Frontend

Modern recipe platform frontend built with Next.js, TypeScript, and React Server
Components.

## Overview

Tasteorama renders on the server by default and hydrates only interactive UI on
the client, for a fast, responsive experience. It communicates with the
[Tasteorama backend](https://github.com/oleksandr-pitsyk/tasteorama-backend)
through a typed Axios layer and caches server state with TanStack Query.
Authentication is cookie‑based, with protected routes guarded at request time.

**Features**

- Recipe catalog with search, filters, and pagination
- Recipe detail pages with ingredients and instructions
- Authentication (register / login / logout) with session refresh
- Personal profile: own recipes and favorites
- Add recipe flow with image upload
- Fully responsive, mobile-first UI

## Tech Stack

| Technology              | Role                      |
| ----------------------- | ------------------------- |
| Next.js                 | App Router, Turbopack     |
| TypeScript              | Type safety               |
| React                   | UI library                |
| TanStack Query          | Server state and caching  |
| Axios                   | API communication         |
| Zustand / React Context | Client state              |
| Formik + Yup            | Forms and validation      |
| CSS Modules             | Component styling         |

## Local Development Setup

**Prerequisites:** Node.js ≥ 20, npm ≥ 10.

### 1. Clone the repository

```bash
git clone https://github.com/oleksandr-pitsyk/tasteorama-frontend.git
cd tasteorama-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env.local`

```dotenv
NEXT_PUBLIC_API_URL=
```

An empty value resolves the API base to the `/api` prefix, routing requests
through the app's own route handlers for local development.

### 4. Start the development server

```bash
npm run dev
```

The app runs at **http://localhost:3000**.

### Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Create a production build  |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |

## Development Standards

### Responsive Design

The project follows a Mobile First approach. Base styles target the smallest
viewport and scale up using media queries.

| Breakpoint | Width    |
| ---------- | -------- |
| Mobile     | `393px`  |
| Tablet     | `768px`  |
| Desktop    | `1440px` |

### Server Components

Server Components are the default. Use `'use client'` only for React hooks, event
handlers, browser APIs, or interactive UI.

### Styling

CSS Modules are mandatory — each component owns a co‑located `*.module.css`.
Global tokens and resets live in `app/globals.css`.

### Icons

Icons are loaded from a shared sprite at `public/sprite.svg`:

```tsx
<use href="/sprite.svg#clock" />
```

### State Management

- **TanStack Query** — server state and caching.
- **Zustand** — global client state.
- **React Context** — localized state when appropriate.

### API Layer

Axios handles all API communication; the base URL is configured through
environment variables.

## Folder Structure

```text
.
├── app/          # Routes, layouts, and /api route handlers
├── components/   # UI components (each with its CSS Module)
├── hooks/        # Custom React hooks
├── lib/
│   ├── api/      # Axios instance and typed API helpers
│   └── store/    # Zustand stores
├── types/        # Shared TypeScript models
└── public/       # Static assets (incl. sprite.svg)
```

## Architecture Principles

- Mobile First approach
- Breakpoints: `393px`, `768px`, `1440px`
- Server Components by default
- `'use client'` only for interactive components
- CSS Modules for style isolation
- Shared SVG sprite located in `public/sprite.svg`
- TanStack Query for server state
- Zustand / React Context for client state
- Axios for API communication
- TypeScript for type safety

## Project Resources

| Resource              | Link                                                    |
| --------------------- | ------------------------------------------------------- |
| Figma design          | Add Figma URL                                          |
| Backend repository    | https://github.com/oleksandr-pitsyk/tasteorama-backend |
| Backend (Render)      | https://tasteorama-backend-jumn.onrender.com           |
| Swagger documentation | https://tasteorama-backend-jumn.onrender.com/api-docs  |
| Frontend deployment   | Add production URL                                     |
