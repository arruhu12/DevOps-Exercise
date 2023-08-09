import { Router } from "express";
import { serve, setup } from "swagger-ui-express";
import * as docs from "../api/openapi.json"

export const docsRouter = Router();

docsRouter.use('/', serve);
docsRouter.get('/', setup(docs));