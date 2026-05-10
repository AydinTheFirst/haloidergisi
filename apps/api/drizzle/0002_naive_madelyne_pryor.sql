ALTER TABLE "PostTheme" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "PostTheme" CASCADE;--> statement-breakpoint
ALTER TABLE "Theme" DROP CONSTRAINT "Theme_name_unique";--> statement-breakpoint
ALTER TABLE "Theme" ADD COLUMN "postId" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" ADD COLUMN "work" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" DROP COLUMN "name";