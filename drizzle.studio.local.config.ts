import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "drizzle-kit";
import baseConfig from "./drizzle.config";

// Wrangler also stores metadata.sqlite here; it is not the application database.
const directory = ".wrangler/state/v3/d1/miniflare-D1DatabaseObject";
const databases = existsSync(directory)
	? readdirSync(directory).filter(
			(name) => name.endsWith(".sqlite") && name !== "metadata.sqlite",
		)
	: [];

if (databases.length !== 1) {
	throw new Error(
		databases.length === 0
			? "No local D1 database found. Run bun run db:migrate:local first."
			: "Multiple local D1 databases found. Cannot safely select one for Studio.",
	);
}

export default defineConfig({
	...baseConfig,
	dbCredentials: { url: `file:${resolve(directory, databases[0])}` },
});
