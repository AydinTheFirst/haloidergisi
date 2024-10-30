import express, { Router } from "express";
import { ApiRouter } from "./ApiRouter";
import { APIError } from "@/lib/http";
import fs from "fs";

const router = Router();
export { router };

router.use("/api", ApiRouter);

const clientPath = "../client/dist";
router.use(express.static(clientPath));

router.use((_req, res) => {
  if (!fs.existsSync(clientPath)) return APIError(res, "Client not found");
  res.sendFile("index.html", { root: clientPath });
});
