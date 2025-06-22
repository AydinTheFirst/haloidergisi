import type { User } from "./User";

import { BaseModel } from "./BaseModel";

export class Squad extends BaseModel {
  description!: string;

  name!: string;

  order!: number;

  users?: User[];
}
