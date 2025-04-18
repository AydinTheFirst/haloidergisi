import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";

import { Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";
import { Role } from "@/prisma";

import { CreateUserDto, UpdateUserDto, UpdateUserSelfDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.usersService.findAll(req);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request) {
    return this.usersService.findOne(id, req);
  }

  @Delete(":id")
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Patch(":id")
  @Roles([Role.ADMIN])
  @UseGuards(AuthGuard)
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put("me")
  @UseGuards(AuthGuard)
  updateSelf(@Req() req: Request, @Body() updateUserDto: UpdateUserSelfDto) {
    return this.usersService.updateSelf(req, updateUserDto);
  }
}
