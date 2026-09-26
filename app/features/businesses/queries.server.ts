import { and, eq } from "drizzle-orm";
import { db } from "../../core/db.server";
import { businessMemberships } from "../loyalty/schema";
import { businessCustomers, businesses, businessStaff } from "./schema";

/** Returns a public business identity, or null for an unknown slug. */
export async function findBusiness(slug: string) {
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
