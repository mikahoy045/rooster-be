import { pool } from './db';

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

    async searchBooks(searchTerm: string) {
        const queryText = `
      SELECT b.book_id, b.title, b.writer, b.cover_image, b.points, bs.stock_quantity, array_agg(t.name) AS tags
      FROM books b
      LEFT JOIN books_tags bt ON b.book_id = bt.book_id
      LEFT JOIN tags t ON bt.tag_id = t.tag_id
      LEFT JOIN book_stock bs ON b.book_id = bs.book_id
      WHERE b.title ILIKE $1 OR b.writer ILIKE $1
      GROUP BY b.book_id, bs.stock_quantity`;

        const { rows } = await pool.query(queryText, [`%${searchTerm}%`]);
        return rows;
    }
}
