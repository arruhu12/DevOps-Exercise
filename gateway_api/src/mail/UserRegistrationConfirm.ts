/**
 * User Registration Mail Template
 */

import { config } from "dotenv"

config();

export default (receive: string) => {
    return {
        to: receive,
        from: `${process.env.MAILER_FROM_NAME} <${process.env.MAILER_FROM_ADDRESS}>`,
        subject: 'Welcome to the E-Commerce App',
        text: "Welcome"
    };
}