/**
 * Create a MySQL Connection
 */

import { createPool } from 'mysql2';
import { config } from 'dotenv';

config();

export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, 
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
}).promise();