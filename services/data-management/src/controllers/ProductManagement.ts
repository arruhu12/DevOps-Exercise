/**
 * Product Management Controller
 */

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import ProductManagementService from "../service/ProductManagementService";
import UserContextService from "../service/UserContextService";
import { camelCaseKeys } from "../utils/keyConverter";
import { errorResponse, successResponse } from "../utils/writer";

export default class ProductManagementController {
  /**
   * Get Products
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async all(req: Request, res: Response) {
    try {
      // Get Customer ID
      const customerId = UserContextService.getCustomerId(req.headers.authorization!);

      // Get Products
      const products = await ProductManagementService.getProducts(customerId, Boolean(req.query.showNameOnly));
      if (!products) {
        return successResponse(res, 200, 'Product List Empty', []);
      }
      return successResponse(res, 200, 'Products Fetched Successfully', camelCaseKeys(products));
    } catch (error) {
      return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Get Product by ID
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async getById(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Bad Request');
      }

      // Get Customer ID
      const customerId = UserContextService.getCustomerId(req.headers.authorization!);

      // Get Product
      const product = await ProductManagementService.getProductById(req.params.id, customerId);
      if (!product) {
        return errorResponse(res, 404, 'NOT_FOUND', 'Product Not Found');
      }
      return successResponse(res, 200, 'Products Fetched Successfully', camelCaseKeys(product));
    } catch (error) {
      return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Store Product
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async store(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Get Customer ID
      const customerId = UserContextService.getCustomerId(req.headers.authorization!);

      // Store Product
      await ProductManagementService.storeProduct(customerId, req.body);
      return successResponse(res, 201, 'Products Stored Successfully');
    } catch (error) {
      return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Update Product
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async update(req: Request, res: Response) {
    try {
      // Get Validation Result and return error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, "INPUT_VALIDATION_ERROR", "Input Validation Error", errors.array());
      }

      // Get Customer ID
      const customerId = UserContextService.getCustomerId(req.headers.authorization!);

      // Check if product exists or not
      const product = await ProductManagementService.getProductById(req.body.id, customerId);
      if (!product) {
        return errorResponse(res, 404, 'NOT_FOUND', 'Product Not Found');
      }

      // Update Product
      await ProductManagementService.updateProductById(customerId, req.body);
      return successResponse(res, 200, 'Products Updated Successfully');
    } catch (error) {
      return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }

  /**
   * Delete Product
   * 
   * @param req Request
   * @param res Response
   * @returns Response
   */
  public static async drop(req: Request, res: Response) {
    try {
      if (!req.params.id) {
        return errorResponse(res, 400, 'VALIDATION_ERROR', 'Bad Request');
      }

      // Get Customer ID
      const customerId = UserContextService.getCustomerId(req.headers.authorization!);

      // Delete Product
      await ProductManagementService.deleteProduct(req.params.id, customerId);
      return successResponse(res, 200, 'Product Deleted Successfully');
    } catch (error) {
      return errorResponse(res, 500, 'INTERNAL_SERVER_ERROR', 'Internal Server Error', error);
    }
  }
}