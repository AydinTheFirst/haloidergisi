CREATE TYPE "public"."ArticleStatus" AS ENUM('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'REVISION_REQ');--> statement-breakpoint
CREATE TABLE "Article" (
	"id" text PRIMARY KEY NOT NULL,
	"callId" text NOT NULL,
	"authorId" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"fileUrl" text,
	"status" "ArticleStatus" DEFAULT 'PENDING' NOT NULL,
	"adminNote" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SubmissionCall" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
