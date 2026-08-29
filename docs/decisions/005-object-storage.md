# ADR-005: S3-Compatible Object Storage for Files

**Status:** Accepted
**Date:** 2026-08-28

## Context

RecruitFlow stores candidate documents (CV, cover letters, certificates) and other files.
Storing binary content directly in PostgreSQL bloats the database and complicates scaling.
Files must be served securely and privately.

## Decision

Store file **content** in **S3-compatible object storage** (AWS S3 in production; **MinIO**
for local development). Store file **metadata** (owner, type, size, object key, timestamps)
in PostgreSQL. Serve file access via **signed/private URLs** rather than public static paths.

## Consequences

- **Positive:** scalable storage, low DB bloat, fine-grained private access via signed URLs,
  portable across S3-compatible providers.
- **Negative/trade-off:** an extra service dependency (MinIO locally) and object-storage
  lifecycle concerns (orphans, deletion); must validate uploads (type/size) for security.
- Introduced when documents feature is implemented; the scaffold's local `MEDIA_ROOT`
  handling will be superseded.
