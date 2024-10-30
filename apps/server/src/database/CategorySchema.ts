import mongoose, { Schema } from "mongoose";
import { IMagazine } from "./MagazineSchema";

interface ISchema {
  id: string;
  title: string;
  description: string;
  magazines: IMagazine[];
}

const model = mongoose.model<ISchema>(
  "category",
  new Schema<ISchema>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: false },
    magazines: { type: [], required: true },
  })
);

export const CategoryModel = model;
export type ICategory = ISchema & mongoose.Document;
