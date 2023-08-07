import { customerActivation, customerRegistration } from "../controllers/CustomerRegistration";
import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";
import { userLoginRequest, userRegistrationRequest } from "../requests";
import AuthenticationController from "../controllers/Authentication";
import CustomerController from "../controllers/Customer";
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";

export const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response) => {
    res.send("Hello Guys");
});

// Registration Routes
apiRouter.post('/register', checkSchema(userRegistrationRequest), customerRegistration);
apiRouter.get('/activation/:activationCode', customerActivation);

// Authentication Routes
apiRouter.post('/login', checkSchema(userLoginRequest), AuthenticationController.login);

// Customer Profile
apiRouter.get('/profile', AuthenticationMiddleware, CustomerController.getProfile);