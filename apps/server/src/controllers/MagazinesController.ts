import { MagazieModel } from "@/database/MagazineSchema";
import { APIError, ZodError } from "@/lib/http";
import { z } from "zod";
import { Request, Response } from "express";
import { uuid } from "@/helpers/utils";
import { AWS } from "@/lib/aws";
import { IUser } from "@/database/UserSchema";

const NewMagazineSchema = z.object({
  categoryId: z.string().min(3),
  title: z.string().min(3),
  description: z.string().min(3),
  status: z.string().min(3),
});

class MagazinesController {
  async getAll(req: Request, res: Response) {
    const user: IUser = req.user as IUser;

    const data =
      user && user.isAdmin
        ? await MagazieModel.find()
        : await MagazieModel.find({ status: "published" });

    res.send(data);
  }

  async getOneById(req: Request, res: Response) {
    const model = await MagazieModel.findOne({ id: req.params.id });
    res.send(model);
  }

  async create(req: Request, res: Response) {
    const parse = NewMagazineSchema.safeParse(req.body);
    if (!parse.success) return ZodError(res, parse.error);

    const { categoryId, title, description, status } = parse.data;

    const files = req.files as Express.Multer.File[];
    const thumbnail = files.find((file) => file.fieldname === "thumbnail");
    const file = files.find((file) => file.fieldname === "file");

    if (!thumbnail || !file) {
      return APIError(res, "Please upload thumbnail and file");
    }

    const model = await MagazieModel.create({
      id: uuid(),
      categoryId,
      title,
      description,
      status,
      timestamp: Date.now(),
      thumbnail: await AWS.uploadFile(thumbnail!),
      file: await AWS.uploadFile(file!),
    });

    await model.save();

    res.send(model);
  }

  async updateOne(req: Request, res: Response) {
    const model = await MagazieModel.findOne({ id: req.params.id });
    if (!model) return APIError(res, "Magazine not found!");

    const files = req.files as Express.Multer.File[];
    const thumbnail = files.find((file) => file.fieldname === "thumbnail");
    const file = files.find((file) => file.fieldname === "file");

    if (thumbnail) {
      await AWS.deleteFile(model.thumbnail);
      req.body.thumbnail = await AWS.uploadFile(thumbnail);
    }

    if (file) {
      await AWS.deleteFile(model.file);
      req.body.file = await AWS.uploadFile(file);
    }

    Object.assign(model, req.body);
    await model.save();

    res.send(model);
  }

  async deleteOne(req: Request, res: Response) {
    const id = req.params.id;
    const model = await MagazieModel.findOne({ id });
    if (!model) return APIError(res, "Magazine not found!");
    await model.deleteOne();
    return res.send(model);
  }
}

export default new MagazinesController();
