import PurchasesTransactionController from "../controllers/PurchasesTransaction";
import { Router } from "express";
import RoleMiddleware from "../middlewares/RoleMiddleware";
import { checkSchema } from "express-validator";
import { purchaseTransactionStore, saleTransactionStore } from "../requests";
import SalesTransactionController from "../controllers/SalesTransaction";

export const apiRouter = Router();

// Purchases Transaction
apiRouter.use(['/purchases', '/purchase'], RoleMiddleware(['employee']));

apiRouter.get('/purchases', PurchasesTransactionController.getPurchases);
apiRouter.get('/purchase/:id', PurchasesTransactionController.getPurchasesById);
apiRouter.post('/purchase/store', checkSchema(purchaseTransactionStore), PurchasesTransactionController.storePurchase);

// Sales Transaction
apiRouter.use(['/sales', '/sale'], RoleMiddleware(['customer']));

apiRouter.get('/sales', SalesTransactionController.all);
apiRouter.get('/sale/:id', SalesTransactionController.getById);
apiRouter.post('/sale/store', checkSchema(saleTransactionStore), SalesTransactionController.storePurchase);