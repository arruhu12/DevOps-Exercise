import { Router } from "express";
import { apiRouter } from "./api";
import { docsRouter } from "./doc";

export const routers = Router();

routers.use("/api/v1", apiRouter);
routers.use("/api/v1/docs/report", docsRouter);