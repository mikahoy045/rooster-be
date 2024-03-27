import { pool } from './db';

export class UserAPIRepository {
    async getUserData(username: string) {
        const queryText = 'SELECT id, username, points FROM users WHERE username = $1';
        const { rows } = await pool.query(queryText, [username]);
        return rows[0] || null;
    }
}
