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

export class BookAPIRepository {
    async getAllBooks() {
        const queryText = `
      SELECT b.book_id, b.title, b.writer, b.cover_image, b.points, array_agg(t.name) AS tags, bs.stock_quantity
      FROM books b
      LEFT JOIN books_tags bt ON b.book_id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.tag_id
      LEFT JOIN book_stock bs ON b.book_id = bs.book_id
      GROUP BY b.book_id, bs.stock_quantity`;
        const { rows } = await pool.query(queryText);
        return rows;
    }
}
