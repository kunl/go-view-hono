CREATE TABLE `projectDatas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectId` integer NOT NULL,
	`createTime` text NOT NULL,
	`createUserId` integer NOT NULL,
	`content` text NOT NULL,
	`updateTime` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projectId` ON `projectDatas` (`projectId`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`projectName` text NOT NULL,
	`indexImage` text,
	`remarks` text,
	`state` integer DEFAULT -1 NOT NULL,
	`isDelete` integer DEFAULT -1 NOT NULL,
	`createTime` text DEFAULT '1734489598368' NOT NULL,
	`createUserId` integer DEFAULT -1 NOT NULL,
	`updateTime` text DEFAULT '1734489598368' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`nickname` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);