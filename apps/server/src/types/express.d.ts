import { User } from "@/database/UserSchema"; // User modelinizin olduğu yerden import edin

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
