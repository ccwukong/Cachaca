ALTER TABLE `customer_address` RENAME COLUMN `address_line_1` TO `address`;--> statement-breakpoint
ALTER TABLE `shop` RENAME COLUMN `address_line_1` TO `address`;--> statement-breakpoint
ALTER TABLE `customer_address` MODIFY COLUMN `address` varchar(250);--> statement-breakpoint
ALTER TABLE `shop` MODIFY COLUMN `address` varchar(250);--> statement-breakpoint
ALTER TABLE `shop` ADD `banners` text;--> statement-breakpoint
ALTER TABLE `customer_address` DROP COLUMN `address_line_2`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `address_line_2`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `created_by`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `created_on`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `updated_by`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `updated_on`;