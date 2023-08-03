/**
 * Database Configuration
 * 
 * This file is used to create the database configuration for the api
 */

import { config } from 'dotenv';

config();

export default {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, 
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};