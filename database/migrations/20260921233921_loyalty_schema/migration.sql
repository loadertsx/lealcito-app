CREATE TABLE `magic_link_requests` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL,
	`token_hash` text NOT NULL,
	`business_slug` text,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT "magic_link_requests_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "magic_link_requests_email_normalized_check" CHECK("email" = lower(trim("email")))
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "sessions_id_not_null_check" CHECK("id" is not null)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`email` text NOT NULL,
	`name` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT "users_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "users_email_normalized_check" CHECK("email" = lower(trim("email")))
);
--> statement-breakpoint
CREATE TABLE `business_staff` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`business_id` text NOT NULL,
	`role` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_business_staff_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `fk_business_staff_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "business_staff_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "business_staff_role_check" CHECK("role" in ('admin', 'staff'))
);
--> statement-breakpoint
CREATE TABLE `businesses` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`timezone` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT "businesses_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "businesses_slug_normalized_check" CHECK(length("slug") > 0 and "slug" = lower(trim("slug")))
);
--> statement-breakpoint
CREATE TABLE `benefits` (
	`id` text PRIMARY KEY,
	`membership_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_benefits_membership_id_memberships_id_fk` FOREIGN KEY (`membership_id`) REFERENCES `memberships`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "benefits_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "benefits_active_check" CHECK("active" in (0, 1))
);
--> statement-breakpoint
CREATE TABLE `memberships` (
	`id` text PRIMARY KEY,
	`business_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_memberships_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "memberships_id_not_null_check" CHECK("id" is not null)
);
--> statement-breakpoint
CREATE TABLE `business_memberships` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`business_id` text NOT NULL,
	`membership_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`joined_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_business_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `fk_business_memberships_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `business_memberships_membership_business_fk` FOREIGN KEY (`membership_id`,`business_id`) REFERENCES `memberships`(`id`,`business_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "business_memberships_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "business_memberships_status_check" CHECK("status" in ('active', 'suspended'))
);
--> statement-breakpoint
CREATE TABLE `membership_benefits` (
	`id` text PRIMARY KEY,
	`business_membership_id` text NOT NULL,
	`benefit_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	`redeemed_at` integer,
	`redeemed_by` text,
	`created_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `fk_membership_benefits_business_membership_id_business_memberships_id_fk` FOREIGN KEY (`business_membership_id`) REFERENCES `business_memberships`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `fk_membership_benefits_benefit_id_benefits_id_fk` FOREIGN KEY (`benefit_id`) REFERENCES `benefits`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `fk_membership_benefits_redeemed_by_users_id_fk` FOREIGN KEY (`redeemed_by`) REFERENCES `users`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT "membership_benefits_id_not_null_check" CHECK("id" is not null),
	CONSTRAINT "membership_benefits_period_check" CHECK("period_start" < "period_end"),
	CONSTRAINT "membership_benefits_redemption_pair_check" CHECK(("redeemed_at" is null and "redeemed_by" is null) or ("redeemed_at" is not null and "redeemed_by" is not null))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `magic_link_requests_token_hash_unique` ON `magic_link_requests` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_hash_unique` ON `sessions` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `business_staff_user_id_business_id_unique` ON `business_staff` (`user_id`,`business_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `businesses_slug_unique` ON `businesses` (`slug`);--> statement-breakpoint
CREATE INDEX `benefits_membership_id_idx` ON `benefits` (`membership_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `memberships_id_business_id_unique` ON `memberships` (`id`,`business_id`);--> statement-breakpoint
CREATE INDEX `memberships_business_id_idx` ON `memberships` (`business_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `business_memberships_user_id_business_id_unique` ON `business_memberships` (`user_id`,`business_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `membership_benefits_membership_benefit_period_start_unique` ON `membership_benefits` (`business_membership_id`,`benefit_id`,`period_start`);--> statement-breakpoint
CREATE INDEX `membership_benefits_membership_period_idx` ON `membership_benefits` (`business_membership_id`,`period_start`,`period_end`);