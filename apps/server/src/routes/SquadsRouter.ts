import SquadController from "@/controllers/SquadController";
import { Router } from "express";

const router = Router();
export { router as SquadsRouter };

router.get("/", SquadController.get);

router.get("/:id", SquadController.getOne);
