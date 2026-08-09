import { AccountModule } from "./account/account.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { ArticlesModule } from "./articles/articles.module";
import { AuthGoogleModule } from "./auth-google/auth-google.module";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { CrewsModule } from "./crews/crews.module";
import { FilesModule } from "./files/files.module";
import { MessagesModule } from "./messages/messages.module";
import { NewsModule } from "./news/news.module";
import { PostsModule } from "./posts/posts.module";
import { ProfileModule } from "./profile/profile.module";
import { SitemapModule } from "./sitemap/sitemap.module";
import { StatsModule } from "./stats/stats.module";
import { SubmissionCallsModule } from "./submission-calls/submission-calls.module";
import { ThemesModule } from "./themes/themes.module";
import { UsersModule } from "./users/users.module";

const modules = {
  AccountModule,
  AnalyticsModule,
  AuthModule,
  AuthGoogleModule,
  MessagesModule,
  CategoriesModule,
  CrewsModule,
  FilesModule,
  PostsModule,
  ProfileModule,
  ThemesModule,
  UsersModule,
  SubmissionCallsModule,
  ArticlesModule,
  NewsModule,
  SitemapModule,
  StatsModule,
};

export default Object.values(modules);
