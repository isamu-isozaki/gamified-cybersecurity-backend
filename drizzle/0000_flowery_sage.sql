CREATE TABLE `flags` (
	`id` integer PRIMARY KEY NOT NULL,
	`flagHash` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
