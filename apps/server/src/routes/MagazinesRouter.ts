import express, { Router } from "express";
import { isAdmin, isLoggedIn } from "@/lib/passport";
import MagazinesController from "@/controllers/MagazinesController";

const router: Router = express.Router();
export { router as MagazinesRouter };

router.get("/", MagazinesController.getAll);

router.get("/:id", MagazinesController.getOneById);

router.post("/", isLoggedIn, isAdmin, MagazinesController.create);

router.put("/:id", isLoggedIn, isAdmin, MagazinesController.updateOne);

router.delete("/:id", isLoggedIn, isAdmin, MagazinesController.deleteOne);
