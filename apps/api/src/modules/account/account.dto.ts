import { PartialType } from "@nestjs/mapped-types";
import { User, NotificationSettings } from "@repo/db";
import { IsBoolean, IsString } from "class-validator";

export class CreateAccountDto implements Partial<User> {
  @IsString()
  email: string;
}

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class DeleteAccountDto {
  @IsString()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class CreateNotificationsDto implements Partial<NotificationSettings> {
  @IsBoolean()
  emailNotifications: boolean;

  @IsBoolean()
  newPost: boolean;

  @IsBoolean()
  securityAlert: boolean;
}

export class UpdateNotificationsDto extends PartialType(CreateNotificationsDto) {}
