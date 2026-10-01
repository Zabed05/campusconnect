# CampusConnect Development Guide

## Development Environment

### Required Tools

- Java 25 LTS
- Maven 3.9+
- IntelliJ IDEA
- MySQL
- MySQL Workbench
- Git
- GitHub
- Postman

## Repository Structure

```text
campusconnect/
├── backend/
├── frontend/
├── docs/
├── .gitignore
└── README.md
```

## Git Workflow

The project uses the following branch strategy:

```text
main
│
└── develop
    │
    └── feature/*
```

### Branches

- `main` — Stable code
- `develop` — Integration branch
- `feature/*` — Feature development

## Commit Convention

Commit messages follow this format:

```text
type: short description
```

Examples:

```text
feat: add user registration
fix: prevent duplicate event registration
docs: update database design
test: add authentication tests
chore: configure development environment
```

## Development Principles

- Build incrementally
- Keep commits meaningful
- Avoid committing secrets
- Test features before merging
- Keep business logic inside services
- Avoid direct database logic inside controllers