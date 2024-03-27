import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

export class UserAPIRepository {
    async getUserData(username: string) {
        const queryText = 'SELECT id, username, points FROM users WHERE username = $1';
        const { rows } = await pool.query(queryText, [username]);
        return rows[0] || null;
    }
}
