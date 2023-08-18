import { checkSchema } from "express-validator";
import SupplierManagementController from "../controllers/SupplierManagement";
import ProductManagementController from "../controllers/ProductManagement";
import { Router } from "express";
import { deleteRequest, employeeStoreRequest, employeeUpdateRequest, productStoreRequest, productUpdateRequest, supplierStoreRequest, supplierUpdateRequest } from "../requests";
import EmployeeManagementController from "../controllers/EmployeeManagement";

export const apiRouter = Router();

// Supplier Routes
apiRouter.get('/suppliers', SupplierManagementController.all);
apiRouter.get('/suppliers/:id', SupplierManagementController.getById);
apiRouter.post('/suppliers/store', checkSchema(supplierStoreRequest), SupplierManagementController.store);
apiRouter.put('/suppliers/update', checkSchema(supplierUpdateRequest), SupplierManagementController.update);
apiRouter.delete('/suppliers/delete/:id', checkSchema(deleteRequest), SupplierManagementController.delete);

// Product Routes
apiRouter.get('/products', ProductManagementController.all);
apiRouter.get('/products/:id', ProductManagementController.getById);
apiRouter.post('/products/store', checkSchema(productStoreRequest), ProductManagementController.store);
apiRouter.put('/products/update', checkSchema(productUpdateRequest), ProductManagementController.update);
apiRouter.delete('/products/delete/:id', checkSchema(deleteRequest), ProductManagementController.drop);

// Employee Routes
apiRouter.get('/employees', EmployeeManagementController.all);
apiRouter.get('/employees/:id', EmployeeManagementController.getById);
apiRouter.post('/employees/store', checkSchema(employeeStoreRequest), EmployeeManagementController.store);
apiRouter.put('/employees/update', checkSchema(employeeUpdateRequest), EmployeeManagementController.update);
apiRouter.delete('/employees/delete/:id', checkSchema(deleteRequest), EmployeeManagementController.drop);