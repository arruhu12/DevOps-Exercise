import { customerActivation, customerRegistration } from "../controllers/CustomerRegistration";
import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";
import { userChangePasswordRequest, userLoginRequest, userRegistrationRequest, userUpdateRequest } from "../requests";
import AuthenticationController from "../controllers/Authentication";
import CustomerController from "../controllers/Customer";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import { config } from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

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
apiRouter.get('/profile', AuthenticationMiddleware('customer'), CustomerController.getProfile);
apiRouter.put('/profile', AuthenticationMiddleware('customer'), checkSchema(userUpdateRequest), CustomerController.updateProfile);
apiRouter.put('/profile/password', AuthenticationMiddleware('customer'), checkSchema(userChangePasswordRequest), AuthenticationController.changePassword);

apiRouter.use('/products', createProxyMiddleware({
    target: 'http://192.168.10.3:8000',
    changeOrigin: true
}));