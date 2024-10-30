import { IUser } from "@/database/UserSchema";
import { generateToken } from "@/helpers/utils";
import { APIError } from "@/lib/http";
import { Handler, Request, Response } from "express";
import passport from "passport";

class AuthController {
  login(req: Request, res: Response) {
    passport.authenticate(
      "local",
      async (err: any, user: IUser, message: string) => {
        if (err) return APIError(res, err);
        if (!user) return APIError(res, message);

        user.token = generateToken();
        await user.save();

        return res.send({ token: user.token });
      }
    )(req, res);
  }

  me: Handler = (req, res) => {
    if (!req.user) return APIError(res, "User not found");

    const user = req.user as IUser;

    res.send({
      ...user.toJSON(),
      roles: [user.isAdmin ? "admin" : "user"],
    });
  };
}

export default new AuthController();
