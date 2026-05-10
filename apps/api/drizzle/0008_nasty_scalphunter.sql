CREATE TABLE "News" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"keywords" text,
	"authorId" text NOT NULL,
	"isPublished" boolean DEFAULT false NOT NULL,
	"publishedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "News_slug_unique" UNIQUE("slug")
);
