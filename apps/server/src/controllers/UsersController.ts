import { IUser, UserModel } from "@/database/UserSchema";
import { APIError, ZodError } from "@/lib/http";
import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { generateToken } from "@/helpers/utils";

const NewUserSchema = z.object({
  displayName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const mutateUser = (user: IUser) => {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
    website: user.website,
    bio: user.bio,
    squadId: user.squadId,
  };
};

class UsersController {
  constructor() {}

  async getAll(req: Request, res: Response) {
    const allUsers = await UserModel.find();
    const users = req.user?.isAdmin ? allUsers : allUsers.map(mutateUser);
    res.send(users);
  }

  getMe(req: Request, res: Response) {
    res.send(req.user);
  }

  async getOneById(req: Request, res: Response) {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return APIError(res, "User not found");

    res.send(req.isAdmin ? user : mutateUser(user));
  }

  async create(req: Request, res: Response) {
    const parse = NewUserSchema.safeParse(req.body);
    if (!parse.success) return ZodError(res, parse.error);

    const { displayName, email, password } = parse.data;

    const isExist = await UserModel.findOne({
      email,
    });

    if (isExist) return APIError(res, "User already exist");

    const hash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      id: v4(),
      displayName,
      email,
      password: hash,
      role: "user",
      isAdmin: false,
      createdAt: Date.now(),
      token: generateToken(),
    });

    res.send(user);
  }

  async update(req: Request, res: Response) {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) return APIError(res, "User not found");

    Object.assign(user, req.body);
    await user.save();

    res.send(user);
  }

  async deleteOneById(req: Request, res: Response) {
    const user = await UserModel.findOneAndDelete({ id: req.params.id });
    if (!user) return APIError(res, "User not found");

    res.send(user);
  }

  async updateSelf(req: Request, res: Response) {
    const user = await UserModel.findOne({ id: req.user?.id });
    if (!user) return APIError(res, "User not found");

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      req.body.password = hash;
    }

    req.body.role = user.role;

    Object.assign(user, req.body);
    await user.save();

    res.send(user);
  }
}

export default new UsersController();
