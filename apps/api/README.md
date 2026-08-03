# Tasks & Notes API

NestJS REST API for user and task management with JWT authentication, role-based access control (RBAC), and PostgreSQL via TypeORM.

**Base URL:** `http://localhost:3001` (default)

## Tech stack

- **NestJS 11** — modules, guards, pipes, filters
- **TypeORM** — PostgreSQL entities and queries
- **Passport JWT** — bearer token authentication
- **class-validator** — request validation
- **bcrypt** — password hashing

## Prerequisites

- Node.js 18+
- PostgreSQL database

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable      | Description              | Example        |
| ------------- | ------------------------ | -------------- |
| `DB_HOST`     | PostgreSQL host          | `localhost`    |
| `DB_PORT`     | PostgreSQL port          | `5432`         |
| `DB_USERNAME` | Database user            | `postgres`     |
| `DB_PASSWORD` | Database password        | —              |
| `DB_NAME`     | Database name            | `tasks_db`     |
| `SECRET_KEY`  | JWT signing secret       | —              |
| `PORT`        | API port (optional)      | `3001`         |

### 3. Seed sample data

```bash
npm run seed
```

Creates users and tasks from `src/database/seed-data.ts`. Default seed passwords: `password123`.

| Email              | Username |
| ------------------ | -------- |
| alice@test.com     | alice    |
| bob@test.com       | bob      |
| charlie@test.com   | charlie  |
| diana@test.com     | diana    |

### 4. Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run start:dev` | Dev server with hot reload   |
| `npm run build`     | Compile TypeScript           |
| `npm run seed`      | Seed database                |
| `npm run test`      | Unit tests                   |
| `npm run test:e2e`  | End-to-end tests             |
| `npm run lint`      | ESLint                       |

## Authentication

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "data": { "token": "<jwt>" },
  "status": 200
}
```

Use the token on protected routes:

```http
Authorization: Bearer <jwt>
```

JWT payload includes `sub` (user id), `email`, and `role` (`user` | `admin`).

## Roles (RBAC)

| Role    | Value   | Default |
| ------- | ------- | ------- |
| `USER`  | `user`  | yes     |
| `ADMIN` | `admin` | no      |

Admin-only routes use `@Roles(Role.ADMIN)` with `JwtAuthGuard` and `RolesGuard`.

## API endpoints

### Auth

| Method | Path          | Auth | Description |
| ------ | ------------- | ---- | ----------- |
| POST   | `/auth/login` | No   | Login, get JWT |

### Users

| Method | Path         | Auth        | Description        |
| ------ | ------------ | ----------- | ------------------ |
| POST   | `/users`     | No          | Register user      |
| GET    | `/users`     | Admin       | List all users     |
| GET    | `/users/:id` | JWT         | Get user by id     |
| PATCH  | `/users/:id` | JWT         | Update user        |
| DELETE | `/users/:id` | Admin       | Delete user        |

### Tasks

All task routes require JWT.

| Method | Path          | Description                          |
| ------ | ------------- | ------------------------------------ |
| GET    | `/tasks`      | List current user's tasks (paginated)|
| GET    | `/tasks/:id`  | Get task by id (owner only)          |
| POST   | `/tasks`      | Create task                          |
| PATCH  | `/tasks/:id`  | Update task                          |
| DELETE | `/tasks/:id`  | Delete task                          |

#### Task list query parameters

| Param       | Type    | Description                          |
| ----------- | ------- | ------------------------------------ |
| `completed` | boolean | Filter by completion status          |
| `priority`  | string  | `low`, `medium`, `high`              |
| `page`      | number  | Page number (default: 1)             |
| `limit`     | number  | Items per page (default: 5, max: 100)|
| `sortField` | string  | `id`, `title`, `priority`            |
| `sortOrder` | string  | `asc`, `desc`                        |

## Response formats

### Success

```json
{
  "message": "Tasks found",
  "data": [],
  "status": 200,
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 5,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false,
    "sortField": "id",
    "sortOrder": "asc"
  }
}
```

### Error

All errors return a consistent shape via the global `HttpExceptionFilter`:

```json
{
  "success": false,
  "status": 404,
  "message": "Task not found",
  "timestamp": "2026-08-03T14:00:00.000Z",
  "path": "/tasks/99",
  "error": "Not Found"
}
```

Validation errors join multiple field messages into a single `message` string.

## Project structure

```
src/
├── common/
│   └── filters/          # Global exception filter
├── database/
│   ├── seed.ts           # Seed runner
│   └── seed-data.ts      # Sample data
├── modules/
│   ├── auth/             # Login, JWT, guards, roles
│   ├── tasks/            # Task CRUD
│   ├── users/            # User CRUD
│   └── interfaces/       # Shared response types
├── app.module.ts
└── main.ts
```

## HTTP requests

Example requests are in [`requests/req.http`](requests/req.http). Use with the VS Code REST Client extension or similar.

## License

UNLICENSED (private project)
