import { Pool, QueryResult } from 'pg';
import dotenv from 'dotenv';
import { User } from '../entity/User';

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

export class UserRepository {
    async findByUsername(username: string): Promise<User | undefined> {
        const result: QueryResult<User> = await pool.query<User>(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length) {
            return result.rows[0];
        }
        return undefined;
    }

    async save(newUser: User): Promise<User> {
        const result: QueryResult<User> = await pool.query<User>(
            'INSERT INTO users (username, password, points) VALUES ($1, $2, $3) RETURNING *',
            [newUser.username, newUser.password, newUser.points]
        );

        return result.rows[0];
    }
}
