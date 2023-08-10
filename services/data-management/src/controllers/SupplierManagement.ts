/**
 * Supplier Management Controller
 */

import { Request, Response } from "express";
import SupplierManagementService from "../service/SupplierManagementService";
import { errorResponse, successResponse } from "../utils/writer";
import { camelCaseKeys, snakeCaseKeys } from "../utils/keyConverter";
import { validationResult } from "express-validator";



export default class SupplierManagementController {

  /**
   * Get Suppliers
   * 
   * @param req Request
   * @param res Response
   * @return Responses
   */
  public static async all(req: Request, res: Response) {
    try {
      const suppliers = await SupplierManagementService.getSuppliers();
      if (!suppliers) {
        return successResponse(res, 200, 'Supplier List Empty', []);
      }
      return successResponse(res, 200, 'Supplier List Fetched Successfully', suppliers);
    } catch (error) {
      errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }
  
  /**
   * Get Supplier by Id
   * 
   * @param req Request
   * @param res Response
   * @return Responses
   */
  public static async getById(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Bad Request');
      }
      
      // Check if supplier exists or not
      const supplier = await SupplierManagementService.getSupplierById(req.params.id);
      if (!supplier) {
        return errorResponse(res, 404, 'NOT_FOUND', 'Supplier Not Found');
      }
      return successResponse(res, 200, 'Supplier Fetched Successfully', camelCaseKeys(supplier));
    } catch (error) {
      errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Store Supplier
   * 
   * @param req Request
   * @param res Response
   * @return Responses
   */
  public static async store(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Store Supplier
      await SupplierManagementService.storeSupplier(req.body);
      return successResponse(res, 201, 'Supplier Created Successfully');
    } catch (error) {
      errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Update Supplier
   * 
   * @param req Request
   * @param res Response
   * @returns Responses
   */
  public static async update(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Check if supplier exists or not
      const supplier = await SupplierManagementService.getSupplierById(req.body.id);
      if (!supplier) {
        return errorResponse(res, 404, 'NOT_FOUND', 'Supplier Not Found');
      }

      // Update Supplier
      await SupplierManagementService.updateSupplier(req.body.id, req.body);
      return successResponse(res, 200, 'Supplier Updated Successfully');
    } catch (error) {
      errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Delete Supplier
   * 
   * @param req Request
   * @param res Response
   * @returns Responses
   */
  public static async delete(req: Request, res: Response) {
    try {
      // Check supplier id validation
      
      // Check if supplier exists or not
      const supplier = await SupplierManagementService.getSupplierById(req.params.id);
      if (!supplier) {
        return errorResponse(res, 404, 'NOT_FOUND', 'Supplier Not Found');
      }

      // Delete Supplier
      await SupplierManagementService.drop(req.params.id);
      return successResponse(res, 200, 'Supplier Deleted Successfully');
    } catch (error) {
      errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }
}