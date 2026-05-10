import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const roleEnum = pgEnum("Role", ["USER", "ADMIN"]);

export const PostStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
} as const;
export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus];
export const postStatusEnum = pgEnum("PostStatus", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const PostReactionType = {
  LIKE: "LIKE",
  DISLIKE: "DISLIKE",
} as const;
export type PostReactionType = (typeof PostReactionType)[keyof typeof PostReactionType];
export const postReactionTypeEnum = pgEnum("PostReactionType", ["LIKE", "DISLIKE"]);

export const ProviderType = {
  GOOGLE: "GOOGLE",
} as const;
export type ProviderType = (typeof ProviderType)[keyof typeof ProviderType];
export const providerTypeEnum = pgEnum("ProviderType", ["GOOGLE"]);

export const users = pgTable("User", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  emailVerifiedAt: timestamp("emailVerifiedAt"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  roles: roleEnum("roles").array().notNull().default(["USER"]),
  crewId: text("crewId"),
});

export const providers = pgTable(
  "Provider",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    providerId: text("providerId").notNull(),
    provider: providerTypeEnum("provider").notNull(),
    userId: text("userId").notNull(),
  },
  (t) => [unique("Provider_provider_providerId_unique").on(t.provider, t.providerId)],
);

export const profiles = pgTable("Profile", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  website: text("website"),
  avatarUrl: text("avatarUrl"),
  title: text("title"),
  bio: text("bio"),
  userId: text("userId").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tokens = pgTable("Token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text("token").notNull().unique(),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const posts = pgTable("Post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  status: postStatusEnum("status").notNull().default("DRAFT"),
  title: text("title").notNull(),
  content: text("content"),
  coverImage: text("coverImage"),
  attachment: text("attachment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  categoryId: text("categoryId"),
});

export const categories = pgTable("Category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const themes = pgTable("Theme", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  work: text("work").notNull(),
  category: text("category").notNull(),
  postId: text("postId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const pageVisits = pgTable(
  "PageVisit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    url: text("url").notNull(),
    date: date("date").notNull(),
    count: integer("count").notNull().default(1),
  },
  (t) => [unique().on(t.url, t.date)],
);

export const notificationSettings = pgTable("NotificationSettings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().unique(),
  emailNotifications: boolean("emailNotifications").notNull().default(true),
  newPost: boolean("newPost").notNull().default(true),
  securityAlert: boolean("securityAlert").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const files = pgTable("File", {
  key: text("key").primaryKey(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const crews = pgTable("Crew", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const postReactions = pgTable(
  "PostReaction",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    type: postReactionTypeEnum("type").notNull(),
    postId: text("postId").notNull(),
    userId: text("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (t) => [unique().on(t.postId, t.userId, t.type)],
);

export const messages = pgTable("Message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  tokens: many(tokens),
  providers: many(providers),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  notificationSettings: one(notificationSettings, {
    fields: [users.id],
    references: [notificationSettings.userId],
  }),
  crew: one(crews, {
    fields: [users.crewId],
    references: [crews.id],
  }),
  postReactions: many(postReactions),
}));

export const providersRelations = relations(providers, ({ one }) => ({
  user: one(users, {
    fields: [providers.userId],
    references: [users.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  postReactions: many(postReactions),
  themes: many(themes),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const notificationSettingsRelations = relations(notificationSettings, ({ one }) => ({
  user: one(users, {
    fields: [notificationSettings.userId],
    references: [users.id],
  }),
}));

export const crewsRelations = relations(crews, ({ many }) => ({
  users: many(users),
}));

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postReactions.userId],
    references: [users.id],
  }),
}));

export const themesRelations = relations(themes, ({ one }) => ({
  post: one(posts, {
    fields: [themes.postId],
    references: [posts.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Token = typeof tokens.$inferSelect;
export type NewToken = typeof tokens.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type PageVisit = typeof pageVisits.$inferSelect;
export type NewPageVisit = typeof pageVisits.$inferInsert;

export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type NewNotificationSettings = typeof notificationSettings.$inferInsert;

export type File = typeof files.$inferSelect;
export type NewFile = typeof files.$inferInsert;

export type Crew = typeof crews.$inferSelect;
export type NewCrew = typeof crews.$inferInsert;

export type PostReaction = typeof postReactions.$inferSelect;
export type NewPostReaction = typeof postReactions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Theme = typeof themes.$inferSelect;
export type NewTheme = typeof themes.$inferInsert;
