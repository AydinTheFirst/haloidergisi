import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { AllowAnonymous, PrismaQuery, type PrismaQueryParams, Roles } from "@/decorators";
import { AuthGuard } from "@/guards";

import { CrewsService } from "./crews.service";
import { CreateCrewDto } from "./dto/create-crew.dto";
import { UpdateCrewDto } from "./dto/update-crew.dto";

@Controller("crews")
@UseGuards(AuthGuard)
export class CrewsController {
  constructor(private readonly crewsService: CrewsService) {}

  @Post()
  @Roles("ADMIN")
  create(@Body() createCrewDto: CreateCrewDto) {
    return this.crewsService.create(createCrewDto);
  }

  @Get()
  @AllowAnonymous()
  findAll(@PrismaQuery() query: PrismaQueryParams) {
    return this.crewsService.findAll(query);
  }

  @Get(":id")
  @AllowAnonymous()
  findOne(@Param("id") id: string) {
    return this.crewsService.findOne(id);
  }

  @Patch(":id")
  @Roles("ADMIN")
  update(@Param("id") id: string, @Body() updateCrewDto: UpdateCrewDto) {
    return this.crewsService.update(id, updateCrewDto);
  }

  @Delete(":id")
  @Roles("ADMIN")
  remove(@Param("id") id: string) {
    return this.crewsService.remove(id);
  }
}
