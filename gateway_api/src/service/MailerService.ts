/**
 * Mailer Service
 */

import Mailer from "../configs/Mailer";
import nodemailer from "nodemailer";
import { config } from "dotenv";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

config();

export const sendMail = async (data: MailOptions) => {
    try {
        let transporter;
        if (process.env.NODE_ENV === "development") {
            transporter = nodemailer.createTransport({
                host: process.env.MAILER_HOST,
                port: 1025
            });
        }
        else {
            transporter = nodemailer.createTransport(Mailer);
        }
        await transporter.sendMail(data);
    } catch (error) {
        throw error;
    }
}