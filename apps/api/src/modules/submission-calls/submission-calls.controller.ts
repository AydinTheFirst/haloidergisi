import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Role } from "@repo/db";

import { Auth, AllowAnonymous, OptionalAuth, Roles } from "../../decorators/auth.decorators";
import { CreateSubmissionCallDto, UpdateSubmissionCallDto } from "./dto/submission-call.dto";
import { SubmissionCallsService } from "./submission-calls.service";

@Controller("submission-calls")
export class SubmissionCallsController {
  constructor(private readonly submissionCallsService: SubmissionCallsService) {}

  @Get()
  findAll() {
    return this.submissionCallsService.findAll();
  }

  @Get("active")
  @AllowAnonymous()
  findActive() {
    return this.submissionCallsService.findActive();
  }

  @Get(":id")
  @AllowAnonymous()
  findOne(@Param("id") id: string) {
    return this.submissionCallsService.findOne(id);
  }

  @Get(":id/check-submission")
  @OptionalAuth()
  async checkSubmission(@Param("id") id: string, @Auth("id") userId?: string) {
    if (!userId) return { hasSubmitted: false };
    const article = await this.submissionCallsService.checkSubmission(id, userId);
    return { hasSubmitted: !!article, articleId: article?.id };
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSubmissionCallDto) {
    return this.submissionCallsService.create(dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  update(@Param("id") id: string, @Body() dto: UpdateSubmissionCallDto) {
    return this.submissionCallsService.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.submissionCallsService.remove(id);
  }
}
