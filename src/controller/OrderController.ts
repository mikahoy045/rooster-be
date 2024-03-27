import { Request, Response, Router } from 'express';
import { Pool } from 'pg';
import { OrderService } from '../service/OrderService';

export const orderController = Router();
const orderService = new OrderService();

orderController.post('/buy', async (req: Request, res: Response) => {
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

orderController.post('/cancel', async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;
        await orderService.cancelOrder(orderId);
        res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

orderController.post('/pay', async (req: Request, res: Response) => {
    try {
        const { orderId, username } = req.body;
        await orderService.processPayment(orderId, username);
        res.status(200).json({ message: 'Payment successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

orderController.get('/all', async (req: Request, res: Response) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

orderController.get('/user/:username', async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const orders = await orderService.getOrdersByUsername(username);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
