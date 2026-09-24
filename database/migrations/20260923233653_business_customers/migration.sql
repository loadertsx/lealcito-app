CREATE TABLE `business_customers` (
	`user_id` text NOT NULL,
	`business_id` text NOT NULL,
	`entered_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL,
	CONSTRAINT `business_customers_pk` PRIMARY KEY(`user_id`, `business_id`),
	CONSTRAINT `fk_business_customers_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `fk_business_customers_business_id_businesses_id_fk` FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT
);
