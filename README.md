# Tasks & Notes App

A full-stack monorepo for managing tasks and notes. The backend is a NestJS REST API with JWT auth, role-based access control, and PostgreSQL. The frontend is a Next.js app (currently a starter shell, ready to connect to the API).

## Project structure

```
tasks-notes-app/
├── apps/
│   ├── api/          # NestJS backend (port 3001)
│   └── web/          # Next.js frontend (port 3000)
├── package.json      # Root scripts to run both apps
└── README.md
```

## Tech stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| API      | NestJS, TypeORM, PostgreSQL, Passport JWT       |
| Web      | Next.js 16, React 19, Tailwind CSS 4            |
| Auth     | JWT bearer tokens, bcrypt, RBAC (`user` / `admin`) |

## Prerequisites

- Node.js 18+
- PostgreSQL (local or remote)
- npm

## Quick start

### 1. Install dependencies

From the repo root:

```bash
npm install
cd apps/api && npm install
cd ../web && npm install
cd ../..
```

### 2. Configure the API

Copy the example env file and fill in your database credentials:

```bash
cp apps/api/.env.example apps/api/.env
```

Required variables in `apps/api/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=tasks_db
SECRET_KEY=your_jwt_secret
PORT=3001
```

### 3. Seed the database (optional)

```bash
cd apps/api
npm run seed
```

This creates sample users (`alice@test.com`, `bob@test.com`, etc.) with password `password123` and sample tasks.

### 4. Run both apps

From the repo root:

```bash
npm run dev
```

| App      | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:3000   |
| API      | http://localhost:3001   |

### Run apps individually

```bash
npm run dev:api   # Backend only
npm run dev:web   # Frontend only
```

## Documentation

- [Backend README](apps/api/README.md) — API setup, endpoints, auth, and error format
- [Frontend README](apps/web/README.md) — Next.js app setup and development

## API overview

| Module | Base path   | Description                |
| ------ | ----------- | -------------------------- |
| Auth   | `/auth`     | Login, JWT issuance        |
| Users  | `/users`    | User CRUD, admin routes    |
| Tasks  | `/tasks`    | Task CRUD (JWT required)   |

Protected routes require an `Authorization: Bearer <token>` header. See the [API README](apps/api/README.md) for full endpoint details.

## License

UNLICENSED (private project)
