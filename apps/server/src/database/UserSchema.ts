import mongoose, { Schema } from "mongoose";

interface ISchema {
  id: string;
  displayName: string;
  email: string;
  password: string;
  token: string;
  createdAt: number;
  role: string;
  isAdmin: boolean;
  avatar?: string;
  bio?: string;
  website?: string;
  squadId?: string;
}

const model = mongoose.model<ISchema>(
  "user",
  new Schema<ISchema>({
    id: { type: String, required: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Number, required: true },
    role: { type: String, required: false, default: "user" },
    isAdmin: { type: Boolean, required: false, default: false },
    avatar: { type: String, required: false },
    bio: { type: String, required: false },
    website: { type: String, required: false },
    squadId: { type: String, required: false, default: "" },
  })
);

export const UserModel = model;
export type IUser = ISchema & mongoose.Document;
