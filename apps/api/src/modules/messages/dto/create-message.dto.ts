import { Message } from "@repo/db";
import { IsEmail, IsString } from "class-validator";

export class CreateMessageDto implements Partial<Message> {
  @IsString()
  content: string;

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  subject: string;
}
