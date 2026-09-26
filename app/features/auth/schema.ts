import { sql } from "drizzle-orm";
import { check, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import {
	createdAt,
	primaryId,
	timestamp,
} from "../../../database/schema/columns";

export const users = sqliteTable(
	"users",
	{
		id: primaryId(),
		email: text("email").notNull(),
		name: text("name"),
		createdAt: createdAt(),
	},
	(table) => [
		check("users_id_not_null_check", sql`${table.id} is not null`),
		uniqueIndex("users_email_unique").on(table.email),
		check(
			"users_email_normalized_check",
			sql`${table.email} = lower(trim(${table.email}))`,
		),
	],
);

export const sessions = sqliteTable(
	"sessions",
	{
		id: primaryId(),
		userId: text("user_id")
			.notNull()
			.references(() => users.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		tokenHash: text("token_hash").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: createdAt(),
	},
	(table) => [
		check("sessions_id_not_null_check", sql`${table.id} is not null`),
		uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
	],
);

export const magicLinkRequests = sqliteTable(
	"magic_link_requests",
	{
		id: primaryId(),
		email: text("email").notNull(),
		tokenHash: text("token_hash").notNull(),
		businessSlug: text("business_slug"),
		expiresAt: timestamp("expires_at").notNull(),
		usedAt: timestamp("used_at"),
		createdAt: createdAt(),
	},
	(table) => [
		check(
			"magic_link_requests_id_not_null_check",
			sql`${table.id} is not null`,
		),
		uniqueIndex("magic_link_requests_token_hash_unique").on(table.tokenHash),
		check(
			"magic_link_requests_email_normalized_check",
			sql`${table.email} = lower(trim(${table.email}))`,
		),
	],
);
