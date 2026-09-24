import { sql } from "drizzle-orm";
import { primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { users } from "./auth";
import { businesses } from "./businesses";
import { timestamp } from "./columns";

/** A person's explicit entry into a business; it is not a membership or permission. */
export const businessCustomers = sqliteTable(
	"business_customers",
	{
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		businessId: text("business_id")
			.notNull()
			.references(() => businesses.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		enteredAt: timestamp("entered_at")
			.notNull()
			.default(
				sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`,
			),
	},
	(table) => [primaryKey({ columns: [table.userId, table.businessId] })],
);
