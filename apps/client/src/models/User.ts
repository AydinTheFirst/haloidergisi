import type { Profile } from "./Profile";

import { BaseModel } from "./BaseModel";

export class User extends BaseModel {
  profile?: Profile;

  username!: string;
}
