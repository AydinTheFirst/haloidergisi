import mongoose, { Schema } from "mongoose";

interface ISchema {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnail: string;
  file: string;
  timestamp: string;
  catId: string;
  status: "published" | "draft";
}

const model = mongoose.model<ISchema>(
  "magazine",
  new Schema<ISchema>({
    id: { type: String, required: true },
    categoryId: { type: String, required: true },
    catId: { type: String, required: false },
    title: { type: String, required: true },
    description: { type: String, required: false },
    thumbnail: { type: String, required: true },
    file: { type: String, required: true },
    timestamp: { type: String, required: true },
    status: { type: String, required: false, default: "draft" },
  })
);

export const MagazieModel = model;
export type IMagazine = ISchema;
