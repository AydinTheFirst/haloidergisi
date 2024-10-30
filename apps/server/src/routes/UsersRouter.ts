import UsersController from "@/controllers/UsersController";
import { isAdmin, isLoggedIn } from "@/lib/passport";
import { Router } from "express";

const router = Router();
export { router as UsersRouter };

router.get("/", UsersController.getAll);

router.get("/@me", isLoggedIn, UsersController.getMe);

router.get("/:id", UsersController.getOneById);

router.post("/", UsersController.create);

router.put("/:id", isLoggedIn, isAdmin, UsersController.update);

router.put("/", isLoggedIn, UsersController.updateSelf);

router.delete("/:id", isLoggedIn, isAdmin, UsersController.deleteOneById);
