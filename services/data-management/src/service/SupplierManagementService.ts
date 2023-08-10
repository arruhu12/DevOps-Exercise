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
   * @return object
   **/
  public static async getSuppliers() {
    try {
      const [[suppliers]] = await db.query<RowDataPacket[]>("SELECT id, name FROM Suppliers");
      return suppliers;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get supplier details by ID
   *
   * @param supplierId string
   * @returns object
   **/
  public static async getSupplierById(supplierId: string) {
    try {
      const [[supplier]] = await db.query<RowDataPacket[]>(
        "SELECT id, name, address, phone_number FROM Suppliers WHERE id = ?",
        [supplierId]
      );
      return supplier;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Store Supplier
   *
   * @param body any 
   * @returns object
   **/
  public static async storeSupplier(body: any) {
    try {      
      const supplier:Supplier = {
        id: uuid(),
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
   * @param body any
   * @returns object
   **/
  public static async updateSupplier(id: string, body: any) {
    try {
      const supplier:Supplier = {
        id: id,
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
