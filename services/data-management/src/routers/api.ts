import { checkSchema } from "express-validator";
import SupplierManagementController from "../controllers/SupplierManagement";
import ProductManagementController from "../controllers/ProductManagement";
import { Router } from "express";
import { deleteRequest, employeeStoreRequest, productStoreRequest, supplierStoreRequest } from "../requests";
import EmployeeManagementController from "../controllers/EmployeeManagement";
import RoleMiddleware from "../middlewares/RoleMiddleware";

export const apiRouter = Router();

// Supplier Routes
apiRouter.use('/suppliers', RoleMiddleware(['customer', 'employee']));
apiRouter.use('/supplier', RoleMiddleware(['customer']));

apiRouter.get('/suppliers', SupplierManagementController.all);
apiRouter.get('/supplier/:id', SupplierManagementController.getById);
apiRouter.post('/supplier/store', checkSchema(supplierStoreRequest), SupplierManagementController.store);
apiRouter.put('/supplier/update', checkSchema(supplierStoreRequest), SupplierManagementController.update);
apiRouter.delete('/supplier/delete/:id', checkSchema(deleteRequest), SupplierManagementController.delete);

// Product Routes
apiRouter.use(['/products', '/product/:id'], RoleMiddleware(['customer', 'employee']));
apiRouter.use(['/product/store', '/product/update', '/product/delete'], RoleMiddleware(['customer']));

apiRouter.get('/products', ProductManagementController.all);
apiRouter.get('/product/:id', ProductManagementController.getById);
apiRouter.post('/product/store', checkSchema(productStoreRequest), ProductManagementController.store);
apiRouter.put('/product/update', checkSchema(productStoreRequest), ProductManagementController.update);
apiRouter.delete('/product/delete/:id', checkSchema(deleteRequest), ProductManagementController.drop);

// Employee Routes
apiRouter.use('/employee/:id', RoleMiddleware(['customer', 'employee']));
apiRouter.use(['/employees', '/employee/store', '/employee/update', '/employee/delete'], RoleMiddleware(['customer']));

apiRouter.get('/employees', EmployeeManagementController.all);
apiRouter.get('/employee/:id', EmployeeManagementController.getById);
apiRouter.post('/employee/store', checkSchema(employeeStoreRequest), EmployeeManagementController.store);
apiRouter.put('/employee/update', checkSchema(employeeStoreRequest), EmployeeManagementController.update);
apiRouter.delete('/employee/delete/:id', checkSchema(deleteRequest), EmployeeManagementController.drop);