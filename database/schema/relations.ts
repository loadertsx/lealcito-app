import { defineRelations } from "drizzle-orm";
import {
	magicLinkRequests,
	sessions,
	users,
} from "../../app/features/auth/schema";
import {
	businessCustomers,
	businesses,
	businessStaff,
} from "../../app/features/businesses/schema";
import {
	benefits,
	businessMemberships,
	membershipBenefits,
	memberships,
} from "../../app/features/loyalty/schema";

const schema = {
	users,
	sessions,
	magicLinkRequests,
	businesses,
	businessStaff,
	businessCustomers,
	memberships,
	benefits,
	businessMemberships,
	membershipBenefits,
};

export const relations = defineRelations(schema, (relation) => ({
	users: {
		sessions: relation.many.sessions(),
		staffAssignments: relation.many.businessStaff(),
		businessEntries: relation.many.businessCustomers(),
		businessMemberships: relation.many.businessMemberships(),
		redeemedMembershipBenefits: relation.many.membershipBenefits(),
	},
	sessions: {
		user: relation.one.users({
			from: relation.sessions.userId,
			to: relation.users.id,
			optional: false,
		}),
	},
	businesses: {
		staff: relation.many.businessStaff(),
		customerEntries: relation.many.businessCustomers(),
		memberships: relation.many.memberships(),
		customerMemberships: relation.many.businessMemberships(),
	},
	businessStaff: {
		user: relation.one.users({
			from: relation.businessStaff.userId,
			to: relation.users.id,
			optional: false,
		}),
		business: relation.one.businesses({
			from: relation.businessStaff.businessId,
			to: relation.businesses.id,
			optional: false,
		}),
	},
	businessCustomers: {
		user: relation.one.users({
			from: relation.businessCustomers.userId,
			to: relation.users.id,
			optional: false,
		}),
		business: relation.one.businesses({
			from: relation.businessCustomers.businessId,
			to: relation.businesses.id,
			optional: false,
		}),
	},
	memberships: {
		business: relation.one.businesses({
			from: relation.memberships.businessId,
			to: relation.businesses.id,
			optional: false,
		}),
		benefits: relation.many.benefits(),
		customerMemberships: relation.many.businessMemberships(),
	},
	benefits: {
		membership: relation.one.memberships({
			from: relation.benefits.membershipId,
			to: relation.memberships.id,
			optional: false,
		}),
		grantedBenefits: relation.many.membershipBenefits(),
	},
	businessMemberships: {
		user: relation.one.users({
			from: relation.businessMemberships.userId,
			to: relation.users.id,
			optional: false,
		}),
		business: relation.one.businesses({
			from: relation.businessMemberships.businessId,
			to: relation.businesses.id,
			optional: false,
		}),
		membership: relation.one.memberships({
			from: [
				relation.businessMemberships.membershipId,
				relation.businessMemberships.businessId,
			],
			to: [relation.memberships.id, relation.memberships.businessId],
			optional: false,
		}),
		grantedBenefits: relation.many.membershipBenefits(),
	},
	membershipBenefits: {
		businessMembership: relation.one.businessMemberships({
			from: relation.membershipBenefits.businessMembershipId,
			to: relation.businessMemberships.id,
			optional: false,
		}),
		benefit: relation.one.benefits({
			from: relation.membershipBenefits.benefitId,
			to: relation.benefits.id,
			optional: false,
		}),
		redeemer: relation.one.users({
			from: relation.membershipBenefits.redeemedBy,
			to: relation.users.id,
		}),
	},
}));
