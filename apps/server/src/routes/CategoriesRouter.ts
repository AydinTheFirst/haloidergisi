import CategoriesController from "@/controllers/CategoriesController";
import { isAdmin, isLoggedIn } from "@/lib/passport";
import express from "express";

const router = express.Router();
export { router as CategoriesRouter };

router.get("/", CategoriesController.getAll);

router.get("/:id", CategoriesController.getOneById);

router.get("/:id/magazines", CategoriesController.getMagazines);

router.post("/", isLoggedIn, isAdmin, CategoriesController.create);

router.put("/:id", isLoggedIn, isAdmin, CategoriesController.updateOne);

router.delete("/:id", isLoggedIn, isAdmin, CategoriesController.deleteOne);
