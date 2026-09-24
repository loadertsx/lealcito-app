import { defineConfig } from "drizzle-kit";
import { unstable_readConfig } from "wrangler";
import baseConfig from "./drizzle.config";

// Resolve only staging from Wrangler so Studio cannot fall back to production.
const config = unstable_readConfig({ config: "wrangler.jsonc", env: "stg" });
const databaseId = config.d1_databases.find(
	(db: { binding: string; database_id: string }) => db.binding === "DB",
)?.database_id;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!databaseId || !accountId || !token) {
	throw new Error(
		"Staging Studio requires the stg DB binding in wrangler.jsonc, CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN (D1 Read/Edit permissions).",
	);
}

export default defineConfig({
	dialect: "sqlite",
	schema: baseConfig.schema,
	driver: "d1-http",
	dbCredentials: { accountId, databaseId, token },
});
