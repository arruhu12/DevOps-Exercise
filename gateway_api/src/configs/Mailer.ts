/**
 * Mailer Configuration
 * 
 * This file is used to create the mailer configuration for the api
 */

import { config } from "dotenv";
import { TransportOptions } from "nodemailer";

config();

export default {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    secure: process.env.MAILER_SECURE,
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
} as TransportOptions;