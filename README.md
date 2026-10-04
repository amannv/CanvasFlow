# CanvasFlow

CanvasFlow is a real-time collaborative digital whiteboard application that enables users to create drawing rooms, sketch ideas, and collaborate live on an infinite canvas with synchronized cursors and shapes.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [License](#license)

## Features

- **8 Core Drawing Tools**: Select/Pointer, Pan/Move, Pencil, Line, Rectangle, Circle, Arrow, and Text.
- **Real-Time Collaboration**: Live shape updates, WebSocket synchronization, user presence messages, and remote cursor tracking.
- **Interactive Infinite Canvas**: Canvas panning, zooming, custom camera position tracking, and an optional technical grid background.
- **Canvas History**: Step-by-step canvas history with undo (`Ctrl+Z`), redo (`Ctrl+Y` / `Ctrl+Shift+Z`), and shape deletion (`Backspace` / `Delete`).
- **Room Management**: Create custom room slugs, list user-owned rooms, share room join links, and delete rooms.
- **User Authentication**: User registration and login utilizing JWT-based authorization and bcrypt password hashing.
- **Data Persistence**: Automatic database persistence for rooms and drawn canvas elements powered by Prisma and PostgreSQL.

## Project Structure

This monorepo is managed using Turborepo and `pnpm` workspaces:

```text
├── apps/
│   ├── http-backend/   # Express REST API for auth and room/element management
│   ├── web/            # Next.js frontend and HTML5 Canvas rendering engine
│   └── ws-backend/     # WebSocket server for real-time canvas state sync and cursor tracking
└── packages/
    ├── database/       # Prisma client and PostgreSQL database adapter
    ├── eslint-config/  # Shared ESLint configuration rules
    ├── typescript-config/ # Shared tsconfig bases
    ├── ui/             # Shared React UI component library
    └── zod/            # Shared Zod validation schemas for HTTP requests & WebSocket messages
```

## Requirements

- **Node.js**: `>= 18`
- **Package Manager**: `pnpm` (`^9.0.0`)
- **Database**: PostgreSQL

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/amannv/CanvasFlow.git
   cd CanvasFlow
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

## Configuration

Create `.env` files in `apps/http-backend`, `apps/ws-backend`, `apps/web`, and `packages/database` containing the required environment variables:

### Database (`packages/database/.env`, `apps/http-backend/.env`, `apps/ws-backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/canvasflow
```

### HTTP Backend (`apps/http-backend/.env`)

```env
PORT=8000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/canvasflow
```

### WebSocket Backend (`apps/ws-backend/.env`)

```env
PORT=8080
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=postgresql://user:password@localhost:5432/canvasflow
```

### Web Frontend (`apps/web/.env`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1/user
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Usage

### Run All Applications in Development Mode

Run the HTTP backend, WebSocket backend, and Next.js web application concurrently:

```sh
pnpm dev
```

The frontend application will start at `http://localhost:3000`.

### Build All Applications

Compile all workspace applications and packages:

```sh
pnpm build
```

### Linting and Code Formatting

Check and apply formatting rules across the monorepo:

```sh
pnpm lint
pnpm format
pnpm check-types
```

## License

ISC