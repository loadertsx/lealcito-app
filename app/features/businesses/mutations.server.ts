import { db } from "../../core/db.server";
import { findBusiness } from "./queries.server";
import { businessCustomers } from "./schema";

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
