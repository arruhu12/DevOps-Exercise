import { Router } from "express";
import { serve, setup } from "swagger-ui-express";
import * as docs from "../api/openapi.json"
import { createProxyMiddleware } from "http-proxy-middleware";

export const docsRouter = Router();

/**
 * OpenAPI Documentation Routes
 */

// Authentication Service Docs
docsRouter.use('/docs/auth', serve);
docsRouter.get('/docs/auth', setup(docs));

// Data Management Service Docs
docsRouter.use('/docs/data', createProxyMiddleware({
    target: process.env.DATA_MANAGEMENT_SERVICE
}));

// Transaction Service Docs
docsRouter.use('/docs/transaction', createProxyMiddleware({
    target: process.env.TRANSACTION_SERVICE
}));

// Report Service Docs
docsRouter.use('/docs/report', createProxyMiddleware({
    target: process.env.REPORT_SERVICE
}));