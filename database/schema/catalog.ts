import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { businesses } from "./businesses";
import { createdAt, primaryId } from "./columns";

export const memberships = sqliteTable(
	"memberships",
	{
		id: primaryId(),
		businessId: text("business_id")
			.notNull()
			.references(() => businesses.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		name: text("name").notNull(),
		description: text("description").notNull(),
		createdAt: createdAt(),
	},
	(table) => [
		check("memberships_id_not_null_check", sql`${table.id} is not null`),
		uniqueIndex("memberships_id_business_id_unique").on(
			table.id,
			table.businessId,
		),
		index("memberships_business_id_idx").on(table.businessId),
	],
);

export const benefits = sqliteTable(
	"benefits",
	{
		id: primaryId(),
		membershipId: text("membership_id")
			.notNull()
			.references(() => memberships.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		title: text("title").notNull(),
		description: text("description").notNull(),
		active: integer("active", { mode: "boolean" }).notNull().default(true),
		createdAt: createdAt(),
	},
	(table) => [
		check("benefits_id_not_null_check", sql`${table.id} is not null`),
		index("benefits_membership_id_idx").on(table.membershipId),
		check("benefits_active_check", sql`${table.active} in (0, 1)`),
	],
);
