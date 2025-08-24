DROP INDEX "session_token_unique";--> statement-breakpoint
ALTER TABLE `component` ALTER COLUMN "source_code" TO "source_code" text NOT NULL DEFAULT '';--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);