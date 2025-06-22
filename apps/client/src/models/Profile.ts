import type { User } from "./User";

import { BaseModel } from "./BaseModel";

export class Profile extends BaseModel {
  avatarUrl?: string;

  bio?: string;

  displayName?: string;

  title?: string;

  user!: User;

  userId!: string;

  website?: string;
}
