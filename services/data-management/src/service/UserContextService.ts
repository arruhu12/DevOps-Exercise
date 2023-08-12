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
     * @returns string
     */
    public static getCustomerId(token: string): string {
        try {
            const result = this.decodeJwtToken(token).context.user;
            return result.customerId ?? result.id;
        } catch (error) {
            throw error;
        }
    }
}