/**
 * Create a MySQL Connection
 */

import Database from '../configs/Database';
import { createPool } from 'mysql2';


export const db = createPool(Database).promise();