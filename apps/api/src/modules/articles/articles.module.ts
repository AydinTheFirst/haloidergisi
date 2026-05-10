import { Module } from "@nestjs/common";

import { SubmissionCallsModule } from "../submission-calls/submission-calls.module";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ArticleGuard } from "./guards/article.guard";

@Module({
  imports: [SubmissionCallsModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleGuard],
})
export class ArticlesModule {}
