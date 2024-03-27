import { Request, Response, Router } from 'express';
import { Pool } from 'pg';
import { OrderService } from '../service/OrderService';

export const orderController = Router();
const orderService = new OrderService();

orderController.post('/', async (req: Request, res: Response) => {
    try {
        const { username, items } = req.body;
        if (!username || !items || items.length === 0) {
            res.status(400).json({ message: 'Invalid order data' });
            return;
        }

        const orderId = await orderService.processOrder(username, items);
        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
