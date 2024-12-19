CREATE TABLE `projectDatas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`createTime` text DEFAULT '2024-12-19 11:21:43' NOT NULL,
	`createUserId` integer NOT NULL,
	`content` text NOT NULL,
	`updateTime` text DEFAULT '2024-12-19 11:21:43' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projectId` ON `projectDatas` (`projectId`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` text NOT NULL,
	`projectName` text NOT NULL,
	`indexImage` text,
	`remarks` text,
	`state` integer DEFAULT -1 NOT NULL,
	`isDelete` integer DEFAULT -1 NOT NULL,
	`createTime` text DEFAULT '2024-12-19 11:21:43' NOT NULL,
	`createUserId` integer DEFAULT -1 NOT NULL,
	`updateTime` text DEFAULT '2024-12-19 11:21:43' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_projectId_unique` ON `projects` (`projectId`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`nickname` text NOT NULL,
	`password` text NOT NULL,
	`salt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);