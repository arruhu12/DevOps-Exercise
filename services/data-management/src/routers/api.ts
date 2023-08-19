import { checkSchema } from "express-validator";
import SupplierManagementController from "../controllers/SupplierManagement";
import ProductManagementController from "../controllers/ProductManagement";
import { Router } from "express";
import { deleteRequest, employeeStoreRequest, employeeUpdateRequest, productStoreRequest, productUpdateRequest, supplierStoreRequest, supplierUpdateRequest } from "../requests";
import EmployeeManagementController from "../controllers/EmployeeManagement";

export const apiRouter = Router();

// Supplier Routes
apiRouter.get('/suppliers', SupplierManagementController.all);
apiRouter.get('/supplier/:id', SupplierManagementController.getById);
apiRouter.post('/supplier/store', checkSchema(supplierStoreRequest), SupplierManagementController.store);
apiRouter.put('/supplier/update', checkSchema(supplierUpdateRequest), SupplierManagementController.update);
apiRouter.delete('/supplier/delete/:id', checkSchema(deleteRequest), SupplierManagementController.delete);

// Product Routes
apiRouter.get('/products', ProductManagementController.all);
apiRouter.get('/product/:id', ProductManagementController.getById);
apiRouter.post('/product/store', checkSchema(productStoreRequest), ProductManagementController.store);
apiRouter.put('/product/update', checkSchema(productUpdateRequest), ProductManagementController.update);
apiRouter.delete('/product/delete/:id', checkSchema(deleteRequest), ProductManagementController.drop);

// Employee Routes
apiRouter.get('/employees', EmployeeManagementController.all);
apiRouter.get('/employee/:id', EmployeeManagementController.getById);
apiRouter.post('/employee/store', checkSchema(employeeStoreRequest), EmployeeManagementController.store);
apiRouter.put('/employee/update', checkSchema(employeeUpdateRequest), EmployeeManagementController.update);
apiRouter.delete('/employee/delete/:id', checkSchema(deleteRequest), EmployeeManagementController.drop);