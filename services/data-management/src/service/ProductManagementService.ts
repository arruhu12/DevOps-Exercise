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
   * @param customerId number
   * @param showNameOnly boolean If **true**, the endpoint returns only products name. (optional)
   * @returns object
   **/
  public static async getProducts(customerId: number, showNameOnly=false) {
    try {
      let products;
      if (showNameOnly) {
        [products] = await db.query<RowDataPacket[]>(
          `SELECT
            id,
            name,
            buy_price,
            sell_price
          FROM products 
          WHERE customer_id = ?
          ORDER BY name`, [customerId]);
      }
      else {
        [products] = await db.query<RowDataPacket[]>(
          `SELECT
            id,
            name,
            buy_price,
            sell_price,
            stock,
            created_at,
            updated_at 
          FROM products
          WHERE customer_id = ?
          ORDER BY name`, [customerId]);
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get product details by ID
   *
   * @param customerId number
   * @param productId string
   * @returns object
   **/
  public static async getProductById(customerId: number, productId: string) {
    try {
      let [[product]] = await db.query<RowDataPacket[]>(
        "SELECT * FROM products WHERE id = ? AND customer_id = ?", [productId, customerId]);
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store Product
   *
   * @param customerId number
   * @param body any
   * @returns Promise<void>
   **/
  public static async storeProduct(customerId: number, body: any): Promise<void> {
    try {
      const product:Product = {
        id: uuid(),
        customer_id: customerId,
        name: body.name,
        buy_price: body.buyPrice,
        sell_price: body.sellPrice,
      }
      await db.query("INSERT INTO products SET ?", product);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update Product details by ID
   *
   * @param customerId number
   * @param body any
   * @returns Promise<void>
   **/
  public static async updateProductById(customerId: number, body: any): Promise<void> {
    try {
      const product:Product = {
        id: body.id,
        customer_id: customerId,
        name: body.name,
        buy_price: body.buyPrice,
        sell_price: body.sellPrice,
      }
      await db.query("UPDATE products SET ? WHERE id = ?", [product, body.id]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete products
   *
   * @param id string
   * @param customerId number
   * @returns object
   **/
  public static async deleteProduct(customerId: number, id: string) {
    try {
      const result = await db.query("DELETE FROM products WHERE id = ? AND customer_id = ?", [id, customerId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}