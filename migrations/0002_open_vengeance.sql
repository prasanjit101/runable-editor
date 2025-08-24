DROP INDEX "session_token_unique";--> statement-breakpoint
ALTER TABLE `component` ALTER COLUMN "name" TO "name" text;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
ALTER TABLE `component` ADD `source_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `component` ADD `edits` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `component` DROP COLUMN `code`;