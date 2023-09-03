import { customerActivation, customerRegistration } from "../controllers/CustomerRegistration";
import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";
import { userChangePasswordRequest, userLoginRequest, userRegistrationRequest, userUpdateRequest } from "../requests";
import AuthenticationController from "../controllers/Authentication";
import CustomerController from "../controllers/Customer";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import { config } from "dotenv";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import RoleMiddleware from "../middlewares/RoleMiddleware";

export const apiRouter = Router();
config();

apiRouter.get("/", (req: Request, res: Response) => {
    res.send("Hello Guys");
});

/**
 * Authentication Routes
 */

// Registration Routes
apiRouter.post('/register', checkSchema(userRegistrationRequest), customerRegistration);
apiRouter.get('/activation/:activationCode', customerActivation);

// Authentication Routes
apiRouter.post('/login', checkSchema(userLoginRequest), AuthenticationController.login);

// Customer Profile
apiRouter.get('/profile', [
    AuthenticationMiddleware(),
    RoleMiddleware(['customer'])
], CustomerController.getProfile);
apiRouter.put('/profile', [
    AuthenticationMiddleware(),
    RoleMiddleware(['customer'])
], checkSchema(userUpdateRequest), CustomerController.updateProfile);
apiRouter.put('/profile/password', [
    AuthenticationMiddleware(),
    RoleMiddleware(['customer'])
], checkSchema(userChangePasswordRequest), AuthenticationController.changePassword);

// Data Management Routes
apiRouter.use([
    '/products', '/product',
    '/suppliers', '/supplier',
    '/employees', '/employee',
    ], 
    [
        AuthenticationMiddleware(),
        createProxyMiddleware({
        target: process.env.DATA_MANAGEMENT_SERVICE,
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            proxyReq.setHeader('Authorization', `Bearer ${req.headers.authorization}`);
            fixRequestBody(proxyReq, req);
        }})
    ]
);


// Transaction Management Routes
apiRouter.use(['/purchases', '/purchase'], AuthenticationMiddleware());
apiRouter.use(['/sales', '/sale'], AuthenticationMiddleware());

// Transaction Management Routes - Proxy
apiRouter.use(['/purchases', '/purchase', '/sales', '/sale', '/report'],
[
    AuthenticationMiddleware(),
    createProxyMiddleware({
    target: process.env.TRANSACTION_SERVICE,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', `Bearer ${req.headers.authorization}`);
        fixRequestBody(proxyReq, req);
    }
    })
]
);