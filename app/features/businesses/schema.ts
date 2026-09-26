import { sql } from "drizzle-orm";
import {
	check,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";
import {
	createdAt,
	primaryId,
	timestamp,
} from "../../../database/schema/columns";
import { users } from "../auth/schema";

export const staffRoles = ["admin", "staff"] as const;
export type StaffRole = (typeof staffRoles)[number];

export const businesses = sqliteTable(
	"businesses",
	{
		id: primaryId(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
		timezone: text("timezone").notNull(),
		createdAt: createdAt(),
	},
	(table) => [
		check("businesses_id_not_null_check", sql`${table.id} is not null`),
		uniqueIndex("businesses_slug_unique").on(table.slug),
		check(
			"businesses_slug_normalized_check",
			sql`length(${table.slug}) > 0 and ${table.slug} = lower(trim(${table.slug}))`,
		),
	],
);

export const businessStaff = sqliteTable(
	"business_staff",
	{
		id: primaryId(),
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
		role: text("role").$type<StaffRole>().notNull(),
		createdAt: createdAt(),
	},
	(table) => [
		check("business_staff_id_not_null_check", sql`${table.id} is not null`),
		uniqueIndex("business_staff_user_id_business_id_unique").on(
			table.userId,
			table.businessId,
		),
		check(
			"business_staff_role_check",
			sql`${table.role} in ('admin', 'staff')`,
		),
	],
);

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
