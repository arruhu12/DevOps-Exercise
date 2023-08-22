/**
 * User Context Service
 * 
 * Get User Context and provide it
 */

import UserContextInterface from "interfaces/UserContextInterface";
import jwtDecode from "jwt-decode";

export default class UserContextService {
    /**
     * Decode JWT Token
     * 
     * @param token: string
     * @returns UserContextInterface
     */
    private static decodeJwtToken(token: string): UserContextInterface {
        try {
            return jwtDecode(token);
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Get Customer ID
     * 
     * @param token: string
     * @returns number
     */
    public static getCustomerId(token: string): number {
        try {
            const result = this.decodeJwtToken(token).context.user;
            return Number(result.customerId!);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get Employee ID
     * 
     * @param token: string
     * @returns string
     */
    public static getEmployeeId(token: string): string {
        try {
            const result = this.decodeJwtToken(token).context.user;
            return result.employeeId!;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get User Role
     * 
     * @param token: string
     * @returns string[]
     */
    public static getUserRole(token: string): string[] {
        try {
            const result = this.decodeJwtToken(token).context;
            return result.roles!;
        } catch (error) {
            throw error;
        }
    }
}