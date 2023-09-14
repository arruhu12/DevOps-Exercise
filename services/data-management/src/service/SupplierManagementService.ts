/**
 * Supplier Management Service
 */

import { RowDataPacket } from "mysql2";
import { db } from "./DatabaseService";
import { v4 as uuid } from "uuid";
import { Supplier } from "../models/Supplier";

export default class SupplierManagementService {
  /**
   * Get a list of suppliers
   *
   * @param customerId number
   * @return object
   **/
  public static async getSuppliers(customerId: number) {
    try {
      const [suppliers] = await db.query<RowDataPacket[]>(
        "SELECT id, name FROM suppliers WHERE customer_id = ?", [customerId]);
      return suppliers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier details by ID
   *
   * @param customerId number
   * @param supplierId string
   * @returns object
   **/
  public static async getSupplierById(customerId: number, supplierId: string) {
    try {
      const [[supplier]] = await db.query<RowDataPacket[]>(
        "SELECT id, name, address, phone_number FROM suppliers WHERE id = ? AND customer_id = ?",
        [supplierId, customerId]
      );
      return supplier;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store Supplier
   *
   * @param customerId number
   * @param body any 
   * @returns object
   **/
  public static async storeSupplier(customerId: number, body: any) {
    try {
      const supplier: Supplier = {
        id: uuid(),
        customer_id: customerId,
        name: body.name,
        address: body.address ?? '-',
        phone_number: body.phoneNumber ?? '-'
      }
      const result = await db.query("INSERT INTO suppliers SET ?", supplier);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update supplier details by ID
   *
   * @param customerId number
   * @param supplierId string
   * @param body any
   * @returns object
   **/
  public static async updateSupplier(customerId: number, supplierId: string, body: any) {
    try {
      const supplier: Supplier = {
        id: supplierId,
        customer_id: customerId,
        name: body.name,
        address: body.address,
        phone_number: body.phoneNumber
      }
      const result = await db.query("UPDATE suppliers SET ? WHERE id = ?", [supplier, supplierId]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Supplier
   *
   * @param customerId number
   * @param supplierId string 
   * @returns object
   **/
  public static async drop(customerId: number, supplierId: string) {
    try {
      const result = await db.query("DELETE FROM suppliers WHERE id = ? AND customer_id = ?", [supplierId, customerId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
