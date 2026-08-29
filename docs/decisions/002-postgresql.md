# ADR-002: PostgreSQL as the Database Across All Environments

**Status:** Accepted
**Date:** 2026-08-28

## Context

RecruitFlow stores relational data: organizations, users, jobs, candidates, applications,
interviews, feedback, notes, documents metadata, audit logs, and analytics. Multi-tenant
isolation and data-integrity guarantees are core requirements. We need dev and production
environments to behave the same to avoid environment drift.

## Decision

Use **PostgreSQL** as the database in **all** environments (development and production). No
SQLite in dev.

## Consequences

- **Positive:** environment parity (no "works on SQLite, breaks on Postgres" surprises);
  feature parity with tools we rely on (JSONB, full-text search, transactions, row-level
  security options for tenant isolation); PostgreSQL is our production target.
- **Negative/trade-off:** local dev requires a running Postgres instance (Docker or local);
  slightly heavier setup than SQLite.
- Reconciliation note: the initial scaffold ran dev on SQLite; this ADR documents the
  target. Migrating the Django dev settings to PostgreSQL is a tracked implementation item.
