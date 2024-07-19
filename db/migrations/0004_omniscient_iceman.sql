ALTER TABLE `api` RENAME COLUMN `type` TO `id`;--> statement-breakpoint
ALTER TABLE `api` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `api` ADD PRIMARY KEY(`id`);