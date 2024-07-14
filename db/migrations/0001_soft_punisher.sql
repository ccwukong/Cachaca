ALTER TABLE `page` DROP INDEX `page_slug_unique`;--> statement-breakpoint
ALTER TABLE `page` MODIFY COLUMN `name` varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE `page` MODIFY COLUMN `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `page` DROP COLUMN `created_on`;--> statement-breakpoint
ALTER TABLE `page` DROP COLUMN `updated_on`;