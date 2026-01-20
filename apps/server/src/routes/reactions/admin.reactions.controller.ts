import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

import { AdminGuard, AuthGuard } from "@/common/guards";

import { CreateReactionDto, QueryReactionDto, UpdateReactionDto } from "./reaction.dto";
import { ReactionsService } from "./reactions.service";

@Controller("admin/reactions")
@UseGuards(AuthGuard, AdminGuard)
export class AdminReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async create(@Body() createReactionDto: CreateReactionDto) {
    return this.reactionsService.create(createReactionDto);
  }

  @Get()
  async findAll(@Query() query: QueryReactionDto) {
    return this.reactionsService.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.reactionsService.findOne(id);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.reactionsService.remove(id);
  }

  @Post(":id")
  async update(@Param("id") id: string, @Body() updateReactionDto: UpdateReactionDto) {
    return this.reactionsService.update(id, updateReactionDto);
  }
}
