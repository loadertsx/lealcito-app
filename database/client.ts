import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

/**
 * Drizzle client over the D1 binding, usable from any server module (loaders,
 * actions, the Worker itself).
 *
 * Reading `env.DB` at module scope is allowed — it only captures the binding,
 * and the Workers runtime forbids I/O outside a request, not property access.
 * The queries themselves still run inside the request.
 */
export const db = drizzle(env.DB);
