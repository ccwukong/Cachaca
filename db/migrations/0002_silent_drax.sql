ALTER TABLE `order` RENAME COLUMN `shipping_cost` TO `shipping_fee`;--> statement-breakpoint
ALTER TABLE `order` MODIFY COLUMN `payment_status` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `order` MODIFY COLUMN `shipping_status` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `order` MODIFY COLUMN `shipping_method` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `order` MODIFY COLUMN `payment_method` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `order` MODIFY COLUMN `payment_scheme` tinyint NOT NULL;--> statement-breakpoint
ALTER TABLE `order` ADD `tax_rate` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `order` ADD `voucher` varchar(50) NOT NULL;