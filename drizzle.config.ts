import { defineConfig } from "drizzle-kit";

/**
 * Drizzle only GENERATES the SQL here; wrangler is what applies it, so this
 * config needs no credentials and `out` points at the same `migrations_dir`
 * declared in wrangler.jsonc.
 *
 * Generate with `bun run db:new --name <nombre>`, apply with
 * `bun run db:migrate:local` / `:stg` / `:prod`.
 */
export default defineConfig({
	dialect: "sqlite",
	schema: "./database/schema.ts",
	out: "./migrations",
});
