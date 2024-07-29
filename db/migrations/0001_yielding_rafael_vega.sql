CREATE TABLE `email_template` (
	`name` varchar(50) NOT NULL,
	`content` text NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `email_template_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
DROP TABLE `api`;--> statement-breakpoint
DROP TABLE `product_subcategory`;--> statement-breakpoint
ALTER TABLE `product_category` ADD `parent_id` varchar(36);--> statement-breakpoint
ALTER TABLE `product` DROP COLUMN `subcategory_id`;