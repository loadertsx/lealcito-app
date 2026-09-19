/**
 * Data model, source of truth. `bun run db:new --name <nombre>` diffs this file
 * and writes the SQL into `migrations/`.
 *
 * Example:
 *
 * export const customers = sqliteTable("customers", {
 * 	id: integer("id").primaryKey({ autoIncrement: true }),
 * 	email: text("email").notNull().unique(),
 * 	createdAt: integer("created_at", { mode: "timestamp" })
 * 		.notNull()
 * 		.$defaultFn(() => new Date()),
 * });
 */

export {};
