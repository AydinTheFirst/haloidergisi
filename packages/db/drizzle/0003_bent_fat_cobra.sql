ALTER TABLE "Theme" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "Theme" DROP COLUMN "work";--> statement-breakpoint
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_title_unique" UNIQUE("title");