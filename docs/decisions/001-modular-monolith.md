# ADR-001: Modular Monolith Architecture

**Status:** Accepted
**Date:** 2026-08-28

## Context

RecruitFlow is a multi-tenant recruitment SaaS platform. We need to grow toward thousands of
organizations and eventually millions of candidates, but we must not prematurely introduce
distributed systems. The functional modules (identity, organizations, candidates, jobs,
applications, interviews, documents, communications, notifications, analytics, search, ai,
audit) should be clearly delineated so they can be extracted later if a real need emerges.

## Decision

Start RecruitFlow as a **Modular Monolith**: a single deployable Django application with
clear internal module boundaries. Do **NOT** start with microservices. Modules communicate
through internal interfaces within one process; no network-hop service boundaries are
introduced unless a concrete, current requirement justifies them.

## Consequences

- **Positive:** simpler deployment, easier local development, no network overhead, simpler
  transactions across modules, lower operational cost.
- **Negative/trade-off:** we must enforce discipline to keep module boundaries clean, or a
  future extraction becomes painful; modules cannot scale independently without a rewrite.
- Mitigation: keep module boundaries explicit (per `apps/` Django app per module, strict
  import rules), tested contracts, and document the extraction path in each module.

## Alternatives considered

- **Microservices from day one:** rejected — premature, high operational and consistency
  cost with no current scaling requirement that justifies it.
