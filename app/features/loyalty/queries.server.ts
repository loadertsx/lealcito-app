import { and, eq, gt, lte } from "drizzle-orm";
import { db } from "../../core/db.server";
import { findBusiness } from "../businesses/queries.server";
import { businessMemberships, membershipBenefits } from "./schema";

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
