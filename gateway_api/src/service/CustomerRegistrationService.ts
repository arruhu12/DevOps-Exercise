/**
 * Activate a registered account
 *
 * activationCode String 
 * returns AccountActivationSuccessResponse
 **/
// exports.activateAccount = function(activationCode) {
//   return new Promise(function(resolve, reject) {
//     var examples = {};
//     examples['application/json'] = {
//   "success" : true,
//   "message" : "Account Activated Successfully"
// };
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       resolve();
//     }
//   });
// }
import { pool } from "./DatabaseService";
import { RowDataPacket } from "mysql2";
import { User } from "models/User";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { Customer } from "models/Customer";


/**
 * Register a new account
 *
 * body RegisterAccountRequest 
 * returns APISuccessResponse
 **/
export const registerAccount = async (body: any) => {
    try {
        const user: User = {
            id: uuid(),
            email: body.email,
            password: await bcrypt.hash(body.password, 10),
            phone_number: body.phoneNumber,
            is_active: false
        }

        const customer: Customer = {
            id: uuid(),
            user_id: user.id,
            first_name: body.firstName,
            last_name: body.lastName === undefined ? null : body.lastName,
            company_name: body.companyName,
            company_address: body.companyAddress
        };
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        await connection.query(`INSERT INTO Users SET ?;`, [user]);
        await connection.query(`INSERT INTO Customers SET ?;`, [customer]);
        await connection.commit(); 
        return true;
    } catch (error) {
        throw error;
    }
}


/**
 * Check Exists User
 * 
 * Check if email was registered
 * 
 * body CheckEmailRequest 
 * returns Boolean
 **/
export const checkEmail = async (email: string) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`SELECT * FROM Users WHERE email = ?`, [email]);
        return rows.length > 0;
    } catch (error) {
        throw error;
    }
}
