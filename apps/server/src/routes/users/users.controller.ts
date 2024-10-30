import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import { GetUser, Roles } from "@/common/decorators";
import { AuthGuard } from "@/common/guards";
import { Role, User } from "@/prisma";

import { CreateUserDto, UpdateUserDto } from "./users.dto";
import { UsersService } from "./users.service";

@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles([Role.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.usersService.findAll(user);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @GetUser() user: User) {
    return this.usersService.findOne(id, user);
  }

  @Delete(":id")
  @Roles([Role.ADMIN])
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  @Patch(":id")
  @Roles([Role.ADMIN])
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
