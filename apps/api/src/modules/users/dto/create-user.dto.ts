import { User } from "@repo/db";
import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsDateString()
  emailVerifiedAt?: Date | null | undefined;

  @IsOptional()
  @IsString()
  crewId?: string | null | undefined;
}
