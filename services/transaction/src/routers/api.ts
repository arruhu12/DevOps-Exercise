import PurchasesTransactionController from "../controllers/PurchasesTransaction";
import { Router } from "express";
import RoleMiddleware from "../middlewares/RoleMiddleware";
import { checkSchema } from "express-validator";
import { purchaseTransactionStore } from "../requests";

export const apiRouter = Router();

// Purchases Transaction
apiRouter.use(['/purchases', '/purchase'], RoleMiddleware(['employee']));

apiRouter.get('/purchases', PurchasesTransactionController.getPurchases);
apiRouter.get('/purchase/:id', PurchasesTransactionController.getPurchasesById);
apiRouter.post('/purchase/store', checkSchema(purchaseTransactionStore), PurchasesTransactionController.storePurchase);