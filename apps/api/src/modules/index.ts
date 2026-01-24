import { AccountModule } from "./account/account.module";
import { AnalyticsModule } from "./analytics/analytics.module";
import { AuthGoogleModule } from "./auth-google/auth-google.module";
import { AuthModule } from "./auth/auth.module";
import { FilesModule } from "./files/files.module";
import { PostsModule } from "./posts/posts.module";
import { ProfileModule } from "./profile/profile.module";
import { UsersModule } from "./users/users.module";

const modules = {
  AuthModule,
  AuthGoogleModule,
  ProfileModule,
  AnalyticsModule,
  AccountModule,
  FilesModule,
  PostsModule,
  UsersModule,
};

export default Object.values(modules);
