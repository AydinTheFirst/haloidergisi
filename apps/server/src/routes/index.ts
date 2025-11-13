import { AccountModule } from "./account/account.module";
import { AuthModule } from "./auth";
import { CategoriesModule } from "./categories/categories.module";
import { CommentsModule } from "./comments/comments.module";
import { FilesModule } from "./files/files.module";
import { NewsModule } from "./news/news.module";
import { PostsModule } from "./posts/posts.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { ReactionsModule } from "./reactions/reactions.module";
import { SquadModule } from "./squads/squads.module";
import { UsersModule } from "./users";

const AppModules = {
  AccountModule,
  AuthModule,
  CategoriesModule,
  CommentsModule,
  FilesModule,
  NewsModule,
  PostsModule,
  ProfilesModule,
  ReactionsModule,
  SquadModule,
  UsersModule,
};

export default Object.values(AppModules);
