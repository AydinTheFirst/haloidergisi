import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class LoginDto {
  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class RegisterDto {
  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
