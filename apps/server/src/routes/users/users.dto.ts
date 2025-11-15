import { PartialType } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

import { BaseQueryDto } from "@/common/dto/query.dto";

export class CreateUserDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  squadId?: string;
}

export class QueryUsersDto extends BaseQueryDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
