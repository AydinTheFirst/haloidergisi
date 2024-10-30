import AuthController from "@/controllers/AuthController";
import express from "express";

const router = express.Router();
export const AuthRouter = router;

router.post("/login", AuthController.login);

router.get("/me", AuthController.me);
