# DevGuard 🛡️

> A full-stack QA and bug tracking dashboard for software teams.

[![CI](https://github.com/ry4nS1y4/devguard/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/devguard/actions/workflows/ci.yml)
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)

---

## Overview

DevGuard is a quality assurance and project management platform designed for software teams. It allows teams to manage software projects, track bugs, create test cases, record test results, and monitor project quality through a real-time dashboard.

**[Live Demo →](https://dev-guard-blue.vercel.app)** | **[API Docs →](https://devguard-backend-dsdx.onrender.com/swagger-ui.html)**

> Demo credentials: `demo@devguard.io` / `Demo1234!`

---

## Features

- **Authentication** — JWT-based login and registration with role-based access control
- **Project Management** — Create projects, manage team members, track project status
- **Bug Tracking** — Full bug lifecycle with severity, priority, assignment, and status updates
- **Test Cases** — Create, organize, and run test cases with pass/fail tracking
- **Test Runs** — Execute test sessions, record results, and link failures to bugs
- **Dashboard** — Real-time charts for bug severity, test pass rate, and activity history
- **Search & Filtering** — Filter bugs and test cases by status, severity, priority, and more
- **Activity Log** — Audit trail of all changes across projects

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16 |
| Auth | JWT (jjwt) |
| Testing | JUnit 5, Mockito, Vitest, React Testing Library, Playwright |
| DevOps | Docker, Docker Compose, GitHub Actions |
| Docs | Swagger / OpenAPI 3 |
| Deployment | Vercel (frontend) + Render (backend) + Render PostgreSQL (database) |

---

## Getting Started

### Prerequisites

- Java 21+
- Node 20+
- Docker & Docker Compose
- Maven 3.9+

### Run with Docker (recommended)

```bash
git clone https://github.com/YOUR_USERNAME/devguard.git
cd devguard

# Start everything (DB + backend + frontend)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5432 |

### Run locally (without Docker)

**Backend**
```bash
cd backend
# Make sure PostgreSQL is running locally
mvn spring-boot:run
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
devguard/
├── backend/                    # Spring Boot application
│   └── src/main/java/com/devguard/
│       ├── auth/               # JWT authentication
│       ├── user/               # User management
│       ├── project/            # Project CRUD
│       ├── bug/                # Bug tracking
│       ├── testcase/           # Test case management
│       ├── testrun/            # Test execution
│       ├── dashboard/          # Metrics & analytics
│       └── shared/             # Config, exceptions, DTOs
├── frontend/                   # React application
│   └── src/
│       ├── api/                # Axios API clients
│       ├── components/         # Shared UI components
│       ├── features/           # Feature modules
│       ├── pages/              # Route-level pages
│       ├── store/              # Zustand state
│       └── types/              # TypeScript types
├── .github/workflows/          # GitHub Actions CI/CD
└── docker-compose.yml
```

---

## API Documentation

Full Swagger docs available at `/swagger-ui.html` when running locally.

Key API groups:

| Group | Base Path |
|-------|-----------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Projects | `/api/projects` |
| Bugs | `/api/bugs` |
| Test Cases | `/api/test-cases` |
| Test Runs | `/api/test-runs` |
| Dashboard | `/api/dashboard` |

---

## Running Tests

**Backend**
```bash
cd backend
mvn test
```

**Frontend unit tests**
```bash
cd frontend
npm test
```

**Frontend E2E tests (Playwright)**
```bash
cd frontend
npm run test:e2e
```

---

## CI/CD Pipeline

Every push to `main` or `develop`:

1. Runs backend tests (JUnit + Spring Boot Test)
2. Runs frontend tests (Vitest + TypeScript check)
3. Builds both apps to verify no broken code

Merging to `main` triggers automatic deployment to Vercel and Render.

---

## Database Schema

See [`/docs/schema.md`](./docs/schema.md) for the full entity relationship diagram.

---

## License

MIT
