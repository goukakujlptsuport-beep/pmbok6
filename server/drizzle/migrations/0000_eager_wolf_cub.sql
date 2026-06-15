CREATE TABLE `highlights` (
	`id` text PRIMARY KEY NOT NULL,
	`book` text NOT NULL,
	`chap` text NOT NULL,
	`color` text NOT NULL,
	`note` text,
	`text` text,
	`sxp` text NOT NULL,
	`so` integer NOT NULL,
	`exp` text NOT NULL,
	`eo` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `hl_pos_uniq` ON `highlights` (`book`,`chap`,`sxp`,`so`,`exp`,`eo`);--> statement-breakpoint
CREATE TABLE `kv_store` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `question_stats` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`session_id` text NOT NULL,
	`answered_at` integer NOT NULL,
	`correct` integer NOT NULL,
	`time_ms` integer
);
--> statement-breakpoint
CREATE INDEX `idx_qstats_question` ON `question_stats` (`question_id`);--> statement-breakpoint
CREATE INDEX `idx_qstats_session` ON `question_stats` (`session_id`);--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`chap` text,
	`type` text NOT NULL,
	`question` text NOT NULL,
	`options` text,
	`answer` text NOT NULL,
	`explain_vi` text,
	`explain_en` text,
	`difficulty` integer DEFAULT 3,
	`tags` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`mode` text NOT NULL,
	`source` text,
	`chap` text,
	`total` integer NOT NULL,
	`correct` integer NOT NULL,
	`duration_s` integer,
	`started_at` integer NOT NULL,
	`finished_at` integer
);
--> statement-breakpoint
CREATE TABLE `reading_progress` (
	`book` text NOT NULL,
	`chap` text NOT NULL,
	`status` text DEFAULT 'not_started' NOT NULL,
	`scroll_pct` real DEFAULT 0,
	`time_spent` integer DEFAULT 0,
	`last_read` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rp_pk` ON `reading_progress` (`book`,`chap`);--> statement-breakpoint
CREATE TABLE `srs_cards` (
	`item_id` text PRIMARY KEY NOT NULL,
	`item_type` text NOT NULL,
	`ease` real DEFAULT 2.5,
	`interval` integer DEFAULT 1,
	`repetitions` integer DEFAULT 0,
	`next_review` integer NOT NULL,
	`last_score` integer,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `study_log` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`book` text,
	`chap` text,
	`duration_s` integer NOT NULL,
	`local_date` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vocab_terms` (
	`id` text PRIMARY KEY NOT NULL,
	`en` text NOT NULL,
	`vi` text NOT NULL,
	`desc_vi` text,
	`desc_en` text,
	`example_vi` text,
	`example_en` text,
	`category` text,
	`difficulty` integer DEFAULT 3
);
