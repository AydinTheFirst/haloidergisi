CREATE TABLE "ThemeConfig" (
	"id" text PRIMARY KEY NOT NULL,
	"primaryColor" text DEFAULT 'oklch(0.205 0 0)' NOT NULL,
	"primaryDarkColor" text DEFAULT 'oklch(0.922 0 0)' NOT NULL,
	"accentColor" text,
	"radius" text DEFAULT '0.625rem' NOT NULL,
	"fontFamily" text DEFAULT 'Inter Variable, sans-serif' NOT NULL,
	"preset" text DEFAULT 'default' NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
