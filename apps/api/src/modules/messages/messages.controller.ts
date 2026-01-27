import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { AllowAnonymous, PrismaQuery, Roles } from "@/decorators";
import { AuthGuard, TurnstileGuard } from "@/guards";

import { CreateMessageDto } from "./dto/create-message.dto";
import { UpdateMessageDto } from "./dto/update-message.dto";
import { MessagesService } from "./messages.service";

@Controller("messages")
@UseGuards(AuthGuard)
@Roles("ADMIN")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @AllowAnonymous()
  @UseGuards(TurnstileGuard)
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(@PrismaQuery(["name", "email", "subject", "content"]) query) {
    return this.messagesService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.messagesService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.messagesService.remove(id);
  }
}
