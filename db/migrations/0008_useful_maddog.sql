ALTER TABLE `shop` MODIFY COLUMN `address` json;--> statement-breakpoint
ALTER TABLE `shop` MODIFY COLUMN `banners` json;--> statement-breakpoint
ALTER TABLE `shop` ADD `other` json;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `city`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `state`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `country`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `zipcode`;--> statement-breakpoint
ALTER TABLE `shop` DROP COLUMN `copyright`;