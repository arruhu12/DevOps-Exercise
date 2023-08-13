/**
 * Product Management Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { v4 as uuid } from "uuid";
import { Product } from "models/Product";

export default class ProductManagementService {
  /**
   * Get a list of products
   *
   * @param customerId string
   * @param showNameOnly boolean If **true**, the endpoint returns only products name. (optional)
   * @returns object
   **/
  public static async getProducts(customerId: string, showNameOnly=false) {
    try {
      let products;
      if (showNameOnly) {
        [products] = await db.query<RowDataPacket[]>(
          "SELECT id, name FROM Products WHERE customer_id = ?", [customerId]);
      }
      else {
        [products] = await db.query<RowDataPacket[]>(
          "SELECT * FROM Products WHERE customer_id = ?", [customerId]);
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get product details by ID
   *
   * @param productId string
   * @param customerId string
   * @returns object
   **/
  public static async getProductById(productId: string, customerId: string) {
    try {
      let [[product]] = await db.query<RowDataPacket[]>(
        "SELECT * FROM Products WHERE id = ? AND customer_id = ?", [productId, customerId]);
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store Product
   *
   * @param customerId string
   * @param body any
   * @returns object
   **/
  public static async storeProduct(customerId: string, body: any) {
    try {
      const product:Product = {
        id: uuid(),
        customer_id: customerId,
        name: body.name,
        price: body.price
      }
      const result = await db.query("INSERT INTO Products SET ?", product);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Product details by ID
   *
   * @param customerId string
   * @param body any
   * @returns object
   **/
  public static async updateProductById(customerId: string, body: any) {
    try {
      const product:Product = {
        id: body.id,
        customer_id: customerId,
        name: body.name,
        price: body.price
      }
      const result = await db.query("UPDATE Products SET ? WHERE id = ?", [product, body.id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete products
   *
   * @param id string
   * @param customerId string
   * @returns object
   **/
  public static async deleteProduct(id: string, customerId: string) {
    try {
      const result = await db.query("DELETE FROM Products WHERE id = ? AND customer_id = ?", [id, customerId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}