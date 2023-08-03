/**
 * User Registration Mail Template
 * 
 * Create a mail template for user registration
 */

import { config } from "dotenv"

config();

export default (receive: string, token: string) => {
    return {
        to: receive,
        from: `${process.env.MAILER_FROM_NAME} <${process.env.MAILER_FROM_ADDRESS}>`,
        subject: 'Welcome to the Buku Sawit App',
        text: "Welcome. Please click on the link below to confirm your email address. \n\n" +
                `${process.env.APP_URL}/api/v1/activation/${token}`
    };
}