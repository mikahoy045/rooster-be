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

    async cancelOrder(orderId: number): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query('UPDATE orders SET status = \'cancelled\' WHERE order_id = $1', [orderId]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async processPayment(orderId: number, username: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const totalPointsQuery = `
            SELECT SUM(b.points * oi.quantity) AS total_points
            FROM order_items oi
            JOIN books b ON oi.book_id = b.book_id
            WHERE oi.order_id = $1
            GROUP BY oi.order_id`;
            const totalPointsResult = await client.query(totalPointsQuery, [orderId]);
            if (totalPointsResult.rows.length === 0) {
                throw new Error("Order not found or has no items");
            }
            const totalPoints = totalPointsResult.rows[0].total_points;


            const updatePointsQuery = 'UPDATE users SET points = points - $1 WHERE username = $2 AND points >= $1';
            const updatePointsParams = [totalPoints, username];
            const updatePointsResult = await client.query(updatePointsQuery, updatePointsParams);
            if (updatePointsResult.rowCount === 0) {
                throw new Error("Insufficient points for this transaction or user not found");
            }

            const updateOrderStatusQuery = 'UPDATE orders SET status = $1 WHERE order_id = $2';
            const updateOrderStatusParams = ['paid', orderId];
            await client.query<any>(updateOrderStatusQuery, updateOrderStatusParams);

            const orderItemsQuery = 'SELECT book_id, quantity FROM order_items WHERE order_id = $1';
            const orderItems = await client.query(orderItemsQuery, [orderId]);
            for (const item of orderItems.rows) {
                const updateStockQuery = 'UPDATE book_stock SET stock_quantity = stock_quantity - $1 WHERE book_id = $2';
                const updateStockParams = [item.quantity, item.book_id];
                await client.query(updateStockQuery, updateStockParams);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getAllOrders() {
        const queryText = `
      SELECT o.order_id, o.username, o.order_date, o.status, json_agg(json_build_object('bookId', b.book_id, 'title', b.title, 'writer', b.writer, 'tags', t.tags)) AS books
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN books b ON oi.book_id = b.book_id
      LEFT JOIN (
        SELECT bt.book_id, array_agg(t.name) AS tags
        FROM books_tags bt
        JOIN tags t ON bt.tag_id = t.tag_id
        GROUP BY bt.book_id
      ) t ON b.book_id = t.book_id
      WHERE o.status NOT IN ('cancelled', 'paid')
      GROUP BY o.order_id
      ORDER BY o.order_date DESC;
    `;
        const { rows } = await pool.query(queryText);
        return rows;
    }

    async getOrdersByUsername(username: string) {
        const queryText = `
      SELECT o.order_id, o.username, o.order_date, o.status, json_agg(json_build_object('bookId', b.book_id, 'title', b.title, 'writer', b.writer, 'tags', t.tags)) AS books
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN books b ON oi.book_id = b.book_id
      LEFT JOIN (
        SELECT bt.book_id, array_agg(t.name) AS tags
        FROM books_tags bt
        JOIN tags t ON bt.tag_id = t.tag_id
        GROUP BY bt.book_id
      ) t ON b.book_id = t.book_id
      WHERE o.username = $1 AND o.status NOT IN ('cancelled', 'paid')
      GROUP BY o.order_id
      ORDER BY o.order_date DESC;
    `;
        const { rows } = await pool.query(queryText, [username]);
        return rows;
    }

}
