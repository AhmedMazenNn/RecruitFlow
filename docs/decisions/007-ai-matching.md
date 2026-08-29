# ADR-007: AI Capabilities as Decision Support Only

**Status:** Accepted
**Date:** 2026-08-28

## Context

Future AI capabilities (CV extraction, candidate–job matching) can improve recruiting
workflows. However, hiring decisions are consequential. AI must not autonomously reject
candidates or make final employment decisions, and its output must be explainable and
reviewable by humans.

## Decision

Any AI capability in RecruitFlow is **decision support only**:

- **MUST NOT** autonomously reject candidates or make final hiring decisions.
- **MUST NOT** act without human review.
- Output **MUST** be explainable and human-reviewable (e.g. match score, strengths, missing
  requirements, and an explanation of how the score was derived).

## Consequences

- **Positive:** keeps humans accountable for hiring; supports trust and transparency.
- **Negative/trade-off:** AI features require careful UX to present explainable output;
  adds scope and cost, so introduced only when a specific feature is specified.
- Not implemented in V1; defined here so future specs comply.
