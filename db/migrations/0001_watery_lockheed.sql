ALTER TABLE `shop` DROP INDEX `shop_name_unique`;--> statement-breakpoint
ALTER TABLE `shop` ADD PRIMARY KEY(`name`);