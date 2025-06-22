import type { Comment } from "./Comment";
import type { UserRole } from "./enums";
import type { Reaction } from "./Reaction";
import type { Squad } from "./Squad";

import { User } from "./User";

export class ClientUser extends User {
  comments?: Comment[];

  email!: string;

  emailVerifiedAt!: string;

  password!: string;

  reactions?: Reaction[];

  roles!: UserRole;

  squad?: Squad;

  squadId?: string;
}
