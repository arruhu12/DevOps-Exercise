import { checkSchema } from "express-validator";
import SupplierManagementController from "../controllers/SupplierManagement";
import { Router } from "express";
import { deleteRequest, supplierStoreRequest, supplierUpdateRequest } from "../requests";

export const apiRouter = Router();

apiRouter.get('/suppliers', SupplierManagementController.all);
apiRouter.get('/suppliers/:id', SupplierManagementController.getById);
apiRouter.post('/suppliers/store', checkSchema(supplierStoreRequest), SupplierManagementController.store);
apiRouter.put('/suppliers/update', checkSchema(supplierUpdateRequest), SupplierManagementController.update);
apiRouter.delete('/suppliers/delete/:id', checkSchema(deleteRequest), SupplierManagementController.delete);