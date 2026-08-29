# Contributing to RecruitFlow

This document defines how we work with **git** and **GitHub** on RecruitFlow. It is the
authoritative guide for branches, commits, and pull requests. Product/architecture context
lives in [`AGENTS.md`](../AGENTS.md); workflow for building features lives there too
(Spec Kit).

---

## Git Workflow: GitHub Flow from `main`

We use a simplified **GitHub Flow**: `main` is always deployable, and all work happens on
short-lived branches that are merged back via pull requests.

```
main (always green / deployable)
  │
  ├── feature/<slug>     ← branch off main, PR back into main
  ├── fix/<slug>         ← branch off main, PR back into main
  └── chore/<slug>       ← branch off main, PR back into main
```

### Rules

- **`main` is sacred.** Never commit directly to `main`. It must always build and pass tests.
- Create a branch for every unit of work. Branch names MUST follow the prefix convention
  below, so history is greppable.
- Open a pull request for every branch. Do not merge your own PR without review unless it is
  a trivial fix and you have no reviewers.
- Keep PRs small and focused on one concern. Reviewable PRs merge faster.

### Branch naming

| Prefix    | Used for                                    | Example                |
|-----------|---------------------------------------------|------------------------|
| `feature/`| New capability, UI section, or module       | `feature/job-management` |
| `fix/`    | Bug fixes                                   | `fix/login-refresh-bug`  |
| `chore/`  | Tooling, config, docs, refactors, CI        | `chore/eslint-setup`     |
| `docs/`   | Documentation-only changes                  | `docs/api-contract`      |

Branch names should be short `kebab-case` slugs that describe the work.

---

## Commit messages: Conventional Commits

We use **Conventional Commits**. This keeps `git log` readable and enables future tooling
(changelogs, semantic releases).

Format:

```
<type>[optional scope]: <subject>

[optional body]
[optional footer(s)]
```

### Types

| Type       | Meaning                                             |
|------------|-----------------------------------------------------|
| `feat:`    | A new feature                                       |
| `fix:`     | A bug fix                                           |
| `refactor:`| Code change that neither fixes a bug nor adds a feature |
| `docs:`    | Documentation only                                   |
| `style:`   | Formatting, whitspace, missing semicolons (no code change) |
| `test:`    | Adding or correcting tests                          |
| `chore:`   | Tooling, dependencies, config (no src change)        |
| `perf:`    | A performance improvement                           |
| `build:`   | Build system / external dependency changes          |

### Examples

```
feat(jobs): add create/edit/close job endpoints

Implement job CRUD behind /api/jobs/ with role-based permissions.

Closes #12
```

```
fix(auth): rotate refresh token on login refresh

The client was reusing an expired refresh token after rotation.
```

```
chore(frontend): reconcile Vite scaffold with Tailwind design system
```

### Rules

- **Imperative subject**, lowercase start: `add`, `fix`, `remove` — not `added`, `fixes`.
- **Subject ≤ ~50 chars**; wrap body at ~72 chars.
- Reference issues/PRs in the footer with `Closes #N` / `Refs #N`.
- One logical change per commit. Split unrelated changes into separate commits.
- Do **not** commit secrets, build artifacts, or local environment files.

---

## Pull Requests

- Title uses the Conventional Commit subject (e.g. `feat(jobs): add job management`).
- Description summarizes what changed, why, and any testing performed.
- Link the feature branch to its Spec Kit artifacts:
  `specs/<NNN>-<short-name>/` (`spec.md`, `plan.md`, `tasks.md`) when relevant.
- Request review, address feedback, and only then merge.

---

## Working with Spec Kit

RecruitFlow is a **specification-driven** project. Feature work MUST follow the Spec Kit
workflow (see `AGENTS.md` → Development Workflow):

```text
Constitution → Specification → Clarification → Technical Plan → Tasks
            → Analysis → Implementation → Testing → Review
```

Typical git shape for a feature:

1. Branch `feature/<slug>` off `main`.
2. Complete the Spec Kit phases (specify → clarify → plan → tasks → analyze).
3. Implement the approved `tasks.md` (`/speckit.implement`).
4. Run tests, then open a PR into `main`.

**Human review is required between major Spec Kit phases.**

---

## Environment & secrets

- Never commit `.env` files or real secrets (root `.gitignore` already excludes `.env*`).
- Copy `backend/.env.example` → `backend/.env` locally and fill real values by hand.

---

## Definition of Done

A branch is ready to merge when it:

- [ ] Implements only the approved specification slice.
- [ ] Builds (`frontend`: `npm run build`; `backend`: `python manage.py check`).
- [ ] Passes relevant tests (`pytest` on backend; frontend lint/typecheck).
- [ ] Follows the branching, naming, and commit conventions above.
- [ ] Updates docs (`README.md`, `AGENTS.md`, Spec Kit artifacts, ADRs) if behavior changed.
- [ ] Has no committed secrets or build artifacts.
