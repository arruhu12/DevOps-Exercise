import { customerActivation, customerRegistration } from "../controllers/CustomerRegistration";
import { Router, Request, Response } from "express";
import { checkSchema } from "express-validator";
import { userRegistrationRequest } from "../requests";

export const apiRouter = Router();

apiRouter.get("/", (req: Request, res: Response) => {
    res.send("Hello Guys");
});

apiRouter.post('/register', checkSchema(userRegistrationRequest), customerRegistration);
apiRouter.get('/activation/:activationCode', customerActivation);
