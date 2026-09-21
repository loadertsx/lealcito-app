import { sql } from "drizzle-orm";
import { integer, text } from "drizzle-orm/sqlite-core";

/**
 * Creates an application-generated UUID primary key for D1.
 *
 * SQLite permits NULL in non-integer primary keys, so every table also adds an
 * explicit `<table>_id_not_null_check` constraint.
 */
export function primaryId() {
	return text("id")
		.notNull()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID());
}

/** Stores an instant as UTC epoch milliseconds and exposes it as a Date. */
export function timestamp(name: string) {
	return integer(name, { mode: "timestamp_ms" });
}

/** Creates a required creation timestamp with a database-side default. */
export function createdAt() {
	return timestamp("created_at")
		.notNull()
		.default(sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`);
}
