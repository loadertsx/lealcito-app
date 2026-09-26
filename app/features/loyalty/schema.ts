import { sql } from "drizzle-orm";
import {
	check,
	foreignKey,
	index,
	integer,
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
import { businesses } from "../businesses/schema";

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

export const businessMembershipStatuses = ["active", "suspended"] as const;
export type BusinessMembershipStatus =
	(typeof businessMembershipStatuses)[number];

export const businessMemberships = sqliteTable(
	"business_memberships",
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
		membershipId: text("membership_id").notNull(),
		status: text("status")
			.$type<BusinessMembershipStatus>()
			.notNull()
			.default("active"),
		joinedAt: timestamp("joined_at")
			.notNull()
			.default(
				sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`,
			),
	},
	(table) => [
		check(
			"business_memberships_id_not_null_check",
			sql`${table.id} is not null`,
		),
		uniqueIndex("business_memberships_user_id_business_id_unique").on(
			table.userId,
			table.businessId,
		),
		foreignKey({
			name: "business_memberships_membership_business_fk",
			columns: [table.membershipId, table.businessId],
			foreignColumns: [memberships.id, memberships.businessId],
		})
			.onDelete("restrict")
			.onUpdate("restrict"),
		check(
			"business_memberships_status_check",
			sql`${table.status} in ('active', 'suspended')`,
		),
	],
);

export const membershipBenefits = sqliteTable(
	"membership_benefits",
	{
		id: primaryId(),
		businessMembershipId: text("business_membership_id")
			.notNull()
			.references(() => businessMemberships.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		benefitId: text("benefit_id")
			.notNull()
			.references(() => benefits.id, {
				onDelete: "restrict",
				onUpdate: "restrict",
			}),
		title: text("title").notNull(),
		description: text("description").notNull(),
		periodStart: timestamp("period_start").notNull(),
		periodEnd: timestamp("period_end").notNull(),
		redeemedAt: timestamp("redeemed_at"),
		redeemedBy: text("redeemed_by").references(() => users.id, {
			onDelete: "restrict",
			onUpdate: "restrict",
		}),
		createdAt: createdAt(),
	},
	(table) => [
		check(
			"membership_benefits_id_not_null_check",
			sql`${table.id} is not null`,
		),
		uniqueIndex(
			"membership_benefits_membership_benefit_period_start_unique",
		).on(table.businessMembershipId, table.benefitId, table.periodStart),
		index("membership_benefits_membership_period_idx").on(
			table.businessMembershipId,
			table.periodStart,
			table.periodEnd,
		),
		check(
			"membership_benefits_period_check",
			sql`${table.periodStart} < ${table.periodEnd}`,
		),
		check(
			"membership_benefits_redemption_pair_check",
			sql`(${table.redeemedAt} is null and ${table.redeemedBy} is null) or (${table.redeemedAt} is not null and ${table.redeemedBy} is not null)`,
		),
	],
);
