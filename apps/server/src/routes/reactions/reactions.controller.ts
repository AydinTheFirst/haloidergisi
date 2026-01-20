import { Body, Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";

import { GetUser } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";

import { ReactionDto } from "./reaction.dto";
import { ReactionsService } from "./reactions.service";

@Controller("reactions")
@UseGuards(AuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Delete(":id")
  @UseGuards(AuthGuard)
  async removeReaction(@Param("id") id: string, @GetUser("id") userId: string) {
    return this.reactionsService.removeReaction(userId, id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async upsertReaction(@Body() reactionDto: ReactionDto, @GetUser("id") userId: string) {
    return this.reactionsService.upsertReaction(userId, reactionDto);
  }
}
