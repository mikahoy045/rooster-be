import { pool } from './db';

export class OrderRepository {

    async createOrder(username: string): Promise<number> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const orderInsertResult = await client.query(
                'INSERT INTO orders(username) VALUES ($1) RETURNING order_id',
                [username]
            );
            const orderId = orderInsertResult.rows[0].order_id;

            await client.query('COMMIT');
            return orderId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async addOrderItem(orderId: number, bookId: number, quantity: number): Promise<void> {
        const queryText = `
      INSERT INTO order_items(order_id, book_id, quantity) 
      VALUES ($1, $2, $3)`;
        await pool.query(queryText, [orderId, bookId, quantity]);
    }

    async getOrderItems(orderId: number) {
        const queryText = `
      SELECT oi.book_id, b.title, b.writer, oi.quantity
      FROM order_items oi
      JOIN books b ON oi.book_id = b.book_id
      WHERE oi.order_id = $1`;
        const { rows } = await pool.query(queryText, [orderId]);
        return rows;
    }

}
