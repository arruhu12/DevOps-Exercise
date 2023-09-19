import PurchasesTransactionController from "../controllers/PurchasesTransaction";
import { Router } from "express";
import RoleMiddleware from "../middlewares/RoleMiddleware";
import { checkSchema } from "express-validator";
import { purchaseTransactionStore, purchaseTransactionWeightUpdate, saleTransactionStore } from "../requests";
import SalesTransactionController from "../controllers/SalesTransaction";
import ReportController from "../controllers/ReportController";

export const apiRouter = Router();

// Purchases Transaction
apiRouter.use(['/purchases', '/purchase'], RoleMiddleware(['employee']));

apiRouter.get('/purchases', PurchasesTransactionController.getPurchases);
apiRouter.get('/purchase/:id', PurchasesTransactionController.getPurchasesById);
apiRouter.post('/purchase/store', checkSchema(purchaseTransactionStore), PurchasesTransactionController.storePurchase);
apiRouter.put('/purchase/update', checkSchema(purchaseTransactionWeightUpdate), PurchasesTransactionController.updatePurchase);

// Sales Transaction
apiRouter.use(['/sales', '/sale'], RoleMiddleware(['customer']));

apiRouter.get('/sales', SalesTransactionController.all);
apiRouter.get('/sale/:id', SalesTransactionController.getById);
apiRouter.post('/sale/store', checkSchema(saleTransactionStore), SalesTransactionController.storePurchase);

// Report
apiRouter.use(['/report', '/reports'], RoleMiddleware(['customer']));

apiRouter.get('/report/dashboard', ReportController.getDashboard);
apiRouter.get('/reports', ReportController.getReports);
apiRouter.get('/report/:id', ReportController.getReportDetail);