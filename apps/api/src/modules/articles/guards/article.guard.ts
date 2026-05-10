import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Role } from "@repo/db";

import { ArticlesService } from "../articles.service";

@Injectable()
export class ArticleGuard implements CanActivate {
  constructor(private readonly articlesService: ArticlesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const articleId = request.params.id;
    const method = request.method;

    if (!user) {
      throw new ForbiddenException("Authentication required.");
    }

    // Admins have full access to everything
    if (user.roles?.includes(Role.ADMIN)) {
      return true;
    }

    if (!articleId) {
      return true;
    }

    const article = await this.articlesService.findOne(articleId);

    // Ownership check
    if (article.authorId !== user.id) {
      throw new ForbiddenException("Bu işlem için yetkiniz yok.");
    }

    // Method specific status checks for regular users
    if (method === "PATCH") {
      // Regular users can only edit if PENDING or REVISION_REQ
      if (article.status !== "PENDING" && article.status !== "REVISION_REQ") {
        throw new ForbiddenException("İnceleme aşamasındaki veya onaylanmış yazılar düzenlenemez.");
      }
    }

    if (method === "DELETE") {
      // Regular users can only delete if not approved/reviewing
      if (article.status === "APPROVED" || article.status === "REVIEWING") {
        throw new ForbiddenException("Onaylanmış veya incelemedeki yazılar silinemez.");
      }
    }

    return true;
  }
}
