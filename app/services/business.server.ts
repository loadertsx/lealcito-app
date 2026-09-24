import { and, eq, gt, lte } from "drizzle-orm";
import { db } from "../../database/client";
import {
	businessCustomers,
	businesses,
	businessMemberships,
	businessStaff,
	membershipBenefits,
} from "../../database/schema";

async function findBusiness(slug: string) {
	const [business] = await db
		.select({ id: businesses.id, slug: businesses.slug, name: businesses.name })
		.from(businesses)
		.where(eq(businesses.slug, slug))
		.limit(1);
	return business ?? null;
}

/** Loads a public business and its viewer state without treating entry as permission. */
export async function getBusinessHome(
	slug: string,
	userId: string | null = null,
) {
	const business = await findBusiness(slug);
	if (!business) return null;

	if (!userId) {
		return {
			...business,
			hasEntered: false,
			staffRole: null,
			membershipStatus: null,
		};
	}

	// Each relationship is unique by user/business. A staff member may also be a
	// customer; neither relationship is inferred from the other.
	const [state] = await db
		.select({
			entryUserId: businessCustomers.userId,
			staffRole: businessStaff.role,
			membershipStatus: businessMemberships.status,
		})
		.from(businesses)
		.leftJoin(
			businessCustomers,
			and(
				eq(businessCustomers.businessId, businesses.id),
				eq(businessCustomers.userId, userId),
			),
		)
		.leftJoin(
			businessStaff,
			and(
				eq(businessStaff.businessId, businesses.id),
				eq(businessStaff.userId, userId),
			),
		)
		.leftJoin(
			businessMemberships,
			and(
				eq(businessMemberships.businessId, businesses.id),
				eq(businessMemberships.userId, userId),
			),
		)
		.where(eq(businesses.id, business.id))
		.limit(1);

	return {
		...business,
		// A previously assigned membership also implies the customer entered.
		hasEntered: !!state?.entryUserId || !!state?.membershipStatus,
		staffRole: state?.staffRole ?? null,
		membershipStatus: state?.membershipStatus ?? null,
	};
}

/** Records a customer's voluntary entry once; never assigns a membership or role. */
export async function enterBusiness(slug: string, userId: string) {
	const business = await findBusiness(slug);
	if (!business) return null;

	await db
		.insert(businessCustomers)
		.values({ userId, businessId: business.id })
		.onConflictDoNothing();
	return business;
}

/** Reads only current grants for this user's active membership in this business. */
export async function getCurrentBenefits(slug: string, userId: string) {
	const business = await findBusiness(slug);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });

	const [membership] = await db
		.select({ id: businessMemberships.id })
		.from(businessMemberships)
		.where(
			and(
				eq(businessMemberships.businessId, business.id),
				eq(businessMemberships.userId, userId),
				eq(businessMemberships.status, "active"),
			),
		)
		.limit(1);
	if (!membership)
		throw new Response("Membresía activa requerida", { status: 403 });

	const now = new Date();
	const benefits = await db
		.select({
			id: membershipBenefits.id,
			title: membershipBenefits.title,
			description: membershipBenefits.description,
			redeemedAt: membershipBenefits.redeemedAt,
		})
		.from(membershipBenefits)
		.innerJoin(
			businessMemberships,
			and(
				eq(membershipBenefits.businessMembershipId, businessMemberships.id),
				eq(businessMemberships.id, membership.id),
				eq(businessMemberships.userId, userId),
				eq(businessMemberships.businessId, business.id),
				eq(businessMemberships.status, "active"),
			),
		)
		.where(
			and(
				lte(membershipBenefits.periodStart, now),
				gt(membershipBenefits.periodEnd, now),
			),
		)
		.orderBy(membershipBenefits.title, membershipBenefits.id);
	return { business, benefits };
}

/** Checks the current role in this business, independently of customer entry. */
export async function requireBusinessStaff(
	slug: string,
	userId: string,
	permission: "work" | "manage",
) {
	const business = await findBusiness(slug);
	if (!business) throw new Response("Negocio no encontrado", { status: 404 });

	const [assignment] = await db
		.select({ role: businessStaff.role })
		.from(businessStaff)
		.where(
			and(
				eq(businessStaff.businessId, business.id),
				eq(businessStaff.userId, userId),
			),
		)
		.limit(1);
	if (!assignment || (permission === "manage" && assignment.role !== "admin")) {
		throw new Response("Acceso denegado", { status: 403 });
	}
	return { business, role: assignment.role };
}
