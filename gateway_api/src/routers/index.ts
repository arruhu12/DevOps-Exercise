import { Router } from "express";
import { apiRouter } from "./api";

export const routers = Router();

routers.use("/api/v1", apiRouter);