import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

import { CreateSquadDto, UpdateSquadDto } from "./squads.dto";
import { SquadService } from "./squads.service";

@Controller("squads")
export class SquadController {
  constructor(private readonly squadService: SquadService) {}

  @Post()
  create(@Body() createSquadDto: CreateSquadDto) {
    return this.squadService.create(createSquadDto);
  }

  @Get()
  findAll() {
    return this.squadService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.squadService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.squadService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSquadDto: UpdateSquadDto) {
    return this.squadService.update(id, updateSquadDto);
  }

  @Patch(":id/users")
  updateUsers(@Param("id") id: string, @Body() users: { userIds: string[] }) {
    return this.squadService.updateUsers(id, users.userIds);
  }
}
