# Package by feature

## Boundaries

```text
app/
  routes/       React Router adapters, HTTP responses, feature composition
  features/     Domain operations, UI, and persistence declarations
  core/         Runtime DB client, email transport, same-origin guard
  shared/       Reusable domain-neutral UI and utilities
  root.tsx      Document and root error boundary
  routes.ts    Route manifest

database/
  schema/
    index.ts    Table aggregator for Drizzle tooling
    relations.ts Global relation graph
    columns.ts  Shared persistence primitives
  migrations/  One immutable migration history for the application
```

Every feature has `components/`, `schema.ts`, `queries.server.ts`, and
`mutations.server.ts`. Keep `.gitkeep` in an empty components directory and an
`export {}` with a comment in a mutation module with no operations. Do not invent
functionality to fill these slots or move feature-specific UI to `shared` merely
because it is a component.

Queries read without changing state or sending emails. Mutations may read to
validate a write. Keep coherent operations together; do not introduce generic
service/repository wrappers around each operation.

## Imports and composition

- Routes call feature operations, handle request parameters/forms and HTTP
  responses, and adapt generated `Route.*` data to component props.
- Feature components never import routes or their generated types.
- Feature operations use core infrastructure and their own tables. Cross-feature
  operations consume explicit public functions, not private helpers.
- Shared code does not depend on core, features, or routes. Core does not import
  feature behavior.
- Persistence composition is an explicit exception: `core/db.server.ts` imports
  the global relations, which import feature schemas. Schemas contain only
  declarations and never import the DB client, queries, mutations, or components.
- Foreign keys import a target feature's `schema.ts` directly. Never import the
  global aggregator from a feature schema: doing so can create import cycles.
- Schema references follow `loyalty → businesses → auth`, with loyalty also
  referencing auth. This is a declaration dependency, not a runtime workflow.
- Keep server operations in `.server.ts` modules. Do not create a barrel that
  mixes UI and server exports; components must not import tables at runtime.

The business home query owns a cross-domain viewer-state projection (entry,
staff role, membership status). Reading loyalty tables there does not grant it
ownership of loyalty mutations. Loyalty can use the public business lookup
without businesses importing loyalty operations.

## Table ownership

| Feature | Tables |
| --- | --- |
| auth | users, sessions, magicLinkRequests |
| businesses | businesses, businessStaff, businessCustomers |
| loyalty | memberships, benefits, businessMemberships, membershipBenefits |

Moving these definitions must not change SQL names, defaults, constraints,
indexes, or foreign keys. Tooling continues to use `database/schema/index.ts`;
Drizzle Studio configuration and migration paths are unchanged.

## Current packages

All three domains use `app/features/{auth,businesses,loyalty}/`; core
infrastructure is in `app/core/`. `app/services/` has been removed.

The businesses feature owns:

- `schema.ts`: businesses, staff assignments, and explicit customer entries.
- `queries.server.ts`: public `findBusiness`, `getBusinessHome`, and
  `requireBusinessStaff` operations.
- `mutations.server.ts`: idempotent `enterBusiness`, which assigns no privileges.
- `components/`: business home, staff area, and management placeholder screens.

Routes retain session lookup, redirects, headers, and generated types. Component
props are independent of routes; schema enums are imported with `import type`
only. The home projection reads membership status directly from
`features/loyalty/schema.ts`, without calling loyalty operations.

The loyalty feature owns:

- `schema.ts`: membership plans, benefit definitions, customer memberships, and
  granted benefit snapshots.
- `queries.server.ts`: `getCurrentBenefits`, using the public business lookup.
- `mutations.server.ts`: intentionally empty; no assignment or redemption
  workflows are implemented.
- `components/business-benefits.tsx`: the current-grants screen.

The home template and its images live in
`app/routes/customer/components/welcome/`, beside `home.tsx`, not in shared. This
route-only template is not a business feature. Its content and metadata are
unchanged. `app/shared/` remains reserved for genuine domain-neutral reuse.

The global aggregator and relations compose all feature-owned schemas;
`database/schema/` contains no domain table definitions. All four migration
slices are implemented, with no public URL or database schema changes.

## Verification

Run `bun test`, `bun --bun run typecheck`, `bun --bun run build`, and
`bun run check:quality`. `bun --bun run rr:routes` must retain the public paths.
Compare SQL generated from the full schema before and after a schema move in
isolated temporary directories; do not generate migrations in the tracked
history for a file-only refactor.

The baseline has 10 pre-existing Biome diagnostics in `app/app.css`,
`app/routes/customer/home.tsx`, and the welcome component/SVGs (now under
`app/routes/customer/components/welcome/`). They are not caused or suppressed by
the structural migration; all migrated domain code passes its focused checks.

See [authentication](authentication.md) for runtime checks and local fixtures.
Also open `/` and verify the welcome content, theme logos, resource links, and
Cloudflare message. The home template has no business directory, so continue
by opening a known `/b/:slug` URL rather than expecting a new navigation link.
Never send test mail to arbitrary addresses or run migration checks remotely.
