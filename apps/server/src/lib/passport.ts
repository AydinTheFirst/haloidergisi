import "./AuthMethods";
import { Handler } from "express";
import { IUser, UserModel } from "@/database/UserSchema";

export const BearerAuth: Handler = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  const user = await UserModel.findOne({
    token,
  });

  if (!user) return next();

  req.user = user;

  next();
};

export const isLoggedIn: Handler = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .send("You need to be logged in to access this route!");
  }

  next();
};

export const isAdmin: Handler = (req, res, next) => {
  const user: IUser = req.user as IUser;

  if (!user.isAdmin) {
    return res.status(403).send("You cannot access this route!");
  }

  next();
};
