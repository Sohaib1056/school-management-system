import pg from 'pg';
import { loadEnv } from './env.js';

loadEnv();

const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const query = (text, params) => pool.query(text, params);

export default { pool, query };
