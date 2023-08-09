import { Router } from "express";
import { serve, setup } from "swagger-ui-express";
import * as docs from "../api/openapi.json"
import { createProxyMiddleware } from "http-proxy-middleware";

export const docsRouter = Router();

/**
 * OpenAPI Documentation Routes
 */

// Authentication Service Docs
docsRouter.use('/auth/docs', serve);
docsRouter.get('/auth/docs', setup(docs));

// Data Management Service Docs
docsRouter.use('/data/docs', createProxyMiddleware({
    target: process.env.DATA_MANAGEMENT_SERVICE
}));