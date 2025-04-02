import { AuthModule } from "./auth";
import { CategoriesModule } from "./categories/categories.module";
import { FilesModule } from "./files/files.module";
import { NewsModule } from "./news/news.module";
import { PostsModule } from "./posts/posts.module";
import { SquadModule } from "./squads/squads.module";
import { UsersModule } from "./users";

export const AppRoutes = [
  AuthModule,
  UsersModule,
  CategoriesModule,
  PostsModule,
  FilesModule,
  SquadModule,
  NewsModule,
];
