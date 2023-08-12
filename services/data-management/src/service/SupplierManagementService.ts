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
   * @param customerId string
   * @return object
   **/
  public static async getSuppliers(customerId: string) {
    try {
      const [[suppliers]] = await db.query<RowDataPacket[]>(
        "SELECT id, name FROM Suppliers WHERE customer_id = ?", [customerId]);
      return suppliers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier details by ID
   *
   * @param supplierId string
   * @param customerId string
   * @returns object
   **/
  public static async getSupplierById(supplierId: string, customerId: string) {
    try {
      const [[supplier]] = await db.query<RowDataPacket[]>(
        "SELECT id, name, address, phone_number FROM Suppliers WHERE id = ? AND customer_id = ?",
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
   * @param customerId string
   * @param body any 
   * @returns object
   **/
  public static async storeSupplier(customerId: string, body: any) {
    try {      
      const supplier:Supplier = {
        id: uuid(),
        customer_id: customerId,
        name: body.name,
        address: body.address,
        phone_number: body.phoneNumber
      }
      const result = await db.query("INSERT INTO Suppliers SET ?", supplier);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update supplier details by ID
   *
   * @param id string
   * @param customerId string
   * @param body any
   * @returns object
   **/
  public static async updateSupplier(id: string, customerId: string, body: any) {
    try {
      const supplier:Supplier = {
        id: id,
        customer_id: customerId,
        name: body.name,
        address: body.address,
        phone_number: body.phoneNumber
      }
      const result = await db.query("UPDATE Suppliers SET ? WHERE id = ?", [supplier, id]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete Supplier
   *
   * @param id string 
   * @returns object
   **/
  public static async drop(id: string) {
    try {
      const result = await db.query("DELETE FROM Suppliers WHERE id = ?", [id]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
