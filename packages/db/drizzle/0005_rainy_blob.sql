ALTER TABLE "Theme" ADD COLUMN "work" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Theme" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "Theme" DROP COLUMN "subject";