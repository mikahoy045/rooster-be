import { QueryResult } from 'pg';
import { User } from '../entity/User';
import { pool } from './db';

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
