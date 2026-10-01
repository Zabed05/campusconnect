# CampusConnect Database Design

## Database

The application will use MySQL as its primary relational database.

## Core Tables

```text
roles
users
announcements
events
event_registrations
```

## Entity Relationships

```text
Role
  │
  │ 1
  │
  │ *
User
  ├── 1 → * Announcement
  ├── 1 → * Event
  └── 1 → * EventRegistration

Event
  └── 1 → * EventRegistration
```

## Roles

Initial system roles:

- STUDENT
- FACULTY
- ADMIN

A user initially has one role.

## Important Constraints

### Users

```text
email → UNIQUE
```

### Roles

```text
name → UNIQUE
```

### Event Registrations

```text
UNIQUE(user_id, event_id)
```

This prevents a user from registering multiple times for the same event.

## Event Status

Initial event statuses:

- DRAFT
- PUBLISHED
- CANCELLED
- COMPLETED

## Registration Status

Initial registration statuses:

- REGISTERED
- CANCELLED
- WAITLISTED

## Attendance Status

Initial attendance statuses:

- PENDING
- ATTENDED
- ABSENT

## Timestamp Strategy

Important entities will maintain timestamps such as:

```text
created_at
updated_at
```