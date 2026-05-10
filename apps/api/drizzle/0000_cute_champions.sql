-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."PostReactionType" AS ENUM('LIKE', 'DISLIKE');--> statement-breakpoint
CREATE TYPE "public"."PostStatus" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."ProviderType" AS ENUM('GOOGLE');--> statement-breakpoint
CREATE TYPE "public"."Role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "Profile" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website" text,
	"avatarUrl" text,
	"title" text,
	"bio" text,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "File" (
	"key" text PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Message" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Post" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"status" "PostStatus" DEFAULT 'DRAFT' NOT NULL,
	"title" text NOT NULL,
	"content" text,
	"coverImage" text,
	"attachment" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"categoryId" text
);
--> statement-breakpoint
CREATE TABLE "PageVisit" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"date" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Provider" (
	"id" text PRIMARY KEY NOT NULL,
	"providerId" text NOT NULL,
	"provider" "ProviderType" NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Token" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expiresAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Crew" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PostReaction" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "PostReactionType" NOT NULL,
	"postId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"emailVerifiedAt" timestamp(3),
	"password" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"roles" "Role""[] DEFAULT '{"RAY['USER'::"Role"}',
	"crewId" text
);
--> statement-breakpoint
CREATE TABLE "NotificationSettings" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"emailNotifications" boolean DEFAULT true NOT NULL,
	"newPost" boolean DEFAULT true NOT NULL,
	"securityAlert" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Theme" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_PostThemes" (
	"A" text NOT NULL,
	"B" text NOT NULL
);

*/