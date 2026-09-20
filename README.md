# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To build and deploy the staging Worker (`lealcito-app-stg`):

```sh
npm run deploy:stg
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## Database (Cloudflare D1 + Drizzle)

All three environments expose the same binding, `env.DB`:

| Environment | D1 database | Where it is configured |
| --- | --- | --- |
| local | SQLite emulation in `.wrangler/state/v3/d1` | `preview_database_id` (top level) |
| staging | `lealcito-stg` | `env.stg` in `wrangler.jsonc` |
| production | `lealcito-prod` | top level in `wrangler.jsonc` |

`bun run dev` and every `--local` command talk to the local database only: the
local binding resolves to `preview_database_id`, which is not a real database
ID, so local work cannot reach production data.

### Schema and migrations

`database/schema.ts` is the source of truth. Drizzle generates the SQL and
wrangler applies it — wrangler owns the `d1_migrations` table and already knows
which database belongs to each environment.

```sh
bun run db:new --name add_customers   # diff the schema into database/migrations/<ts>_add_customers/
bun run db:new:custom --name seed     # empty migration for hand-written SQL

bun run db:migrate:local              # apply locally
bun run db:migrate:stg                # apply to lealcito-stg  (needs `wrangler login`)
bun run db:migrate:prod               # apply to lealcito-prod (needs `wrangler login`)

bun run db:status:local               # migrations still pending
bun run db:exec:local --command "select * from customers"
```

Do not apply with `drizzle-kit migrate` or `drizzle-kit push`: both only reach
the remote database over the HTTP API and track their own
`__drizzle_migrations` table, which would drift from the `d1_migrations` table
wrangler maintains.

Drizzle Kit writes one directory per migration
(`database/migrations/<timestamp>_<name>/migration.sql`), which is why the D1
bindings set `migrations_pattern` instead of relying on wrangler's default
`migrations/*.sql`. The snapshots Drizzle keeps next to each migration are
excluded from Biome in `biome.json`.

### Querying

`database/client.ts` exports a ready-to-use client, available from any server
module:

```ts
import { db } from "../../database/client";
import { customers } from "../../database/schema";

export async function loader() {
	return { customers: await db.select().from(customers) };
}
```

Run `bun run cf:typegen` after changing bindings in `wrangler.jsonc` to refresh
`worker-configuration.d.ts`.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
