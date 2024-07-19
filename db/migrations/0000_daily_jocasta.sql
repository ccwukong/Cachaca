CREATE TABLE `checkout` (
	`id` varchar(36) NOT NULL,
	`customer_id` varchar(36),
	`currency_id` tinyint NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `checkout_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `checkout_item` (
	`id` varchar(36) NOT NULL,
	`checkout_id` varchar(36) NOT NULL,
	`product_variant_id` varchar(36) NOT NULL,
	`unit_price` varchar(20) NOT NULL,
	`quantity` int NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `checkout_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collection` (
	`id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `collection_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collection_product` (
	`collection_id` varchar(36) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `collection_product_collection_id_product_id_pk` PRIMARY KEY(`collection_id`,`product_id`)
);
--> statement-breakpoint
CREATE TABLE `currency` (
	`id` tinyint NOT NULL,
	`code` varchar(3) NOT NULL,
	`symbol` varchar(3) NOT NULL,
	`name` varchar(30) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `currency_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customer` (
	`id` varchar(36) NOT NULL,
	`email` varchar(120) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`password` varchar(32) NOT NULL,
	`salt` varchar(8) NOT NULL,
	`first_name` varchar(30) NOT NULL,
	`last_name` varchar(30) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `customer_id` PRIMARY KEY(`id`),
	CONSTRAINT `customer_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `customer_address` (
	`id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`address_line_1` varchar(120),
	`address_line_2` varchar(120),
	`city` varchar(50),
	`state` varchar(60),
	`country` varchar(60),
	`zipcode` varchar(10),
	`type` varchar(10) NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `customer_address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`id` varchar(36) NOT NULL,
	`amount` varchar(20) NOT NULL,
	`checkout_id` varchar(36) NOT NULL,
	`customer_id` varchar(36) NOT NULL,
	`currency_id` tinyint NOT NULL,
	`payment_status` varchar(20) NOT NULL,
	`shipping_status` varchar(20) NOT NULL,
	`shipping_address` varchar(160) NOT NULL,
	`billing_address` varchar(160) NOT NULL,
	`shipping_method` varchar(30) NOT NULL,
	`shipping_cost` varchar(20) NOT NULL,
	`tax` varchar(20) NOT NULL,
	`discount` varchar(20) NOT NULL,
	`note` varchar(250) NOT NULL,
	`payment_method` varchar(20) NOT NULL,
	`payment_scheme` varchar(20) NOT NULL,
	`payment_instrument` varchar(20) NOT NULL,
	`payment_reference` varchar(60) NOT NULL,
	`shipping_reference` varchar(60) NOT NULL,
	`shipping_tracking` varchar(60) NOT NULL,
	`created_by` varchar(36) NOT NULL,
	`created_on` int NOT NULL,
	`updated_by` varchar(36),
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `order_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page` (
	`name` varchar(60) NOT NULL,
	`slug` varchar(60) NOT NULL,
	`content` text NOT NULL,
	`order` tinyint NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `page_name` PRIMARY KEY(`name`),
	CONSTRAINT `page_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` varchar(36) NOT NULL,
	`slug` varchar(100) NOT NULL,
	`name` varchar(120) NOT NULL,
	`description` varchar(500) NOT NULL,
	`cover_image` varchar(255) NOT NULL,
	`base_price` varchar(20) NOT NULL,
	`category_id` varchar(36) NOT NULL,
	`subcategory_id` varchar(36) NOT NULL,
	`created_by` varchar(36) NOT NULL,
	`created_on` int NOT NULL,
	`updated_by` varchar(36),
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `product_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `product_category` (
	`id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `product_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_image` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(255) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`metadata` varchar(500) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `product_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_subcategory` (
	`id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`category_id` varchar(36),
	`status` tinyint NOT NULL,
	CONSTRAINT `product_subcategory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_variant` (
	`id` varchar(36) NOT NULL,
	`name` varchar(60) NOT NULL,
	`description` varchar(500) NOT NULL,
	`cover_image` varchar(255) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`price_variant` varchar(20) NOT NULL,
	`sku` varchar(36) NOT NULL,
	`quantity` int NOT NULL,
	`variant_cat_id` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `product_variant_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_variant_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(60) NOT NULL,
	`status` tinyint NOT NULL,
	CONSTRAINT `product_variant_category_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop` (
	`name` varchar(120) NOT NULL,
	`logo` varchar(255) NOT NULL,
	`email` varchar(60),
	`phone` varchar(30),
	`address_line_1` varchar(120),
	`address_line_2` varchar(120),
	`city` varchar(50),
	`state` varchar(60),
	`country` varchar(60),
	`zipcode` varchar(10),
	`base_currency_id` tinyint NOT NULL,
	`description` varchar(500),
	`created_by` varchar(36) NOT NULL,
	`created_on` int NOT NULL,
	`updated_by` varchar(36),
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `shop_name` PRIMARY KEY(`name`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`email` varchar(120) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`password` varchar(32) NOT NULL,
	`salt` varchar(8) NOT NULL,
	`first_name` varchar(30) NOT NULL,
	`last_name` varchar(30) NOT NULL,
	`avatar` varchar(255) NOT NULL,
	`role` tinyint NOT NULL,
	`created_on` int NOT NULL,
	`updated_on` int,
	`status` tinyint NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `checkout` (`customer_id`);--> statement-breakpoint
CREATE INDEX `checkout_id_idx` ON `checkout_item` (`checkout_id`);--> statement-breakpoint
CREATE INDEX `product_variant_id_idx` ON `checkout_item` (`product_variant_id`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `customer` (`phone`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `customer_address` (`customer_id`);--> statement-breakpoint
CREATE INDEX `customer_id_idx` ON `order` (`customer_id`);--> statement-breakpoint
CREATE INDEX `checkout_id_idx` ON `order` (`checkout_id`);--> statement-breakpoint
CREATE INDEX `cat_id_idx` ON `product` (`category_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `product_image` (`product_id`);--> statement-breakpoint
CREATE INDEX `category_id_idx` ON `product_subcategory` (`category_id`);--> statement-breakpoint
CREATE INDEX `product_id_idx` ON `product_variant` (`product_id`);--> statement-breakpoint
CREATE INDEX `variant_cat_id_idx` ON `product_variant` (`variant_cat_id`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `user` (`phone`);