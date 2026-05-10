CREATE TABLE "PostTheme" (
	"postId" text NOT NULL,
	"themeId" text NOT NULL,
	"work" text NOT NULL,
	"category" text NOT NULL,
	CONSTRAINT "PostTheme_postId_themeId_work_category_pk" PRIMARY KEY("postId","themeId","work","category")
);
--> statement-breakpoint
ALTER TABLE "_PostThemes" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "_PostThemes" CASCADE;--> statement-breakpoint
ALTER TABLE "Profile" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Profile" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "File" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "File" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Message" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Post" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "PageVisit" ALTER COLUMN "date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Category" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Token" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Token" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Token" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Crew" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Crew" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "PostReaction" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "PostReaction" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "emailVerifiedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "roles" SET DEFAULT '{"USER"}'::"public"."Role"[];--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "roles" SET DATA TYPE "public"."Role"[] USING "roles"::"public"."Role"[];--> statement-breakpoint
ALTER TABLE "User" ALTER COLUMN "roles" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "NotificationSettings" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "NotificationSettings" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "NotificationSettings" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "NotificationSettings" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Theme" ALTER COLUMN "createdAt" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "Theme" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_unique" UNIQUE("userId");--> statement-breakpoint
ALTER TABLE "Post" ADD CONSTRAINT "Post_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "PageVisit" ADD CONSTRAINT "PageVisit_url_date_unique" UNIQUE("url","date");--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_provider_providerId_unique" UNIQUE("provider","providerId");--> statement-breakpoint
ALTER TABLE "Token" ADD CONSTRAINT "Token_token_unique" UNIQUE("token");--> statement-breakpoint
ALTER TABLE "Crew" ADD CONSTRAINT "Crew_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_userId_type_unique" UNIQUE("postId","userId","type");--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_unique" UNIQUE("userId");--> statement-breakpoint
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_name_unique" UNIQUE("name");