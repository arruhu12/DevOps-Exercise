import { Router } from "express";
import { apiRouter } from "./api";
import { docsRouter } from "./doc";

export const routers = Router();

routers.use("/api/v1/products", apiRouter);
routers.use("/api/v1/data/docs", docsRouter);