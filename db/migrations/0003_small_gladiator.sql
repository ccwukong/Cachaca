CREATE TABLE `api` (
	`type` tinyint NOT NULL,
	`config` varchar(500) NOT NULL,
	CONSTRAINT `api_type` PRIMARY KEY(`type`)
);
--> statement-breakpoint
ALTER TABLE `product_category` ADD CONSTRAINT `product_category_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `product_subcategory` ADD CONSTRAINT `product_subcategory_slug_unique` UNIQUE(`slug`);--> statement-breakpoint
ALTER TABLE `product_category` ADD `slug` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `product_subcategory` ADD `slug` varchar(100) NOT NULL;