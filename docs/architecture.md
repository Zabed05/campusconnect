# CampusConnect Architecture

## Overview

CampusConnect follows a modular monolith architecture.

The application consists of a frontend client, a Spring Boot backend, and a MySQL database.

```text
Frontend
   │
   │ HTTP / REST API
   ▼
Spring Boot Backend
   │
   │ JPA / Hibernate
   ▼
MySQL Database
```

## Backend Architecture

The backend follows a layered architecture:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

### Controller

Responsible for:

- Receiving HTTP requests
- Validating request data
- Returning HTTP responses

### Service

Responsible for:

- Business logic
- Application rules
- Coordination between repositories and other services

### Repository

Responsible for:

- Database access
- Data persistence
- Query operations

## Module Strategy

CampusConnect uses a package-by-feature approach while maintaining layered responsibilities.

Initial modules include:

- Identity
- Announcement
- Event
- Registration

Each feature can contain its own:

```text
controller/
service/
repository/
entity/
dto/
```

## Core Principles

- Modular monolith architecture
- Clear separation of responsibilities
- RESTful API design
- DTO-based communication
- Role-based authorization
- Incremental development
- Avoid unnecessary complexity