import { OrderRepository } from '../repository/OrderRepository';

export class OrderService {
    private orderRepository = new OrderRepository();

    async processOrder(username: string, items: { bookId: number; quantity: number }[]): Promise<number> {
        const orderId = await this.orderRepository.createOrder(username);

        for (const item of items) {
            await this.orderRepository.addOrderItem(orderId, item.bookId, item.quantity);
            // Update book_stock here. Omitted for brevity.
        }

        return orderId;
    }

    async cancelOrder(orderId: number): Promise<void> {
        await this.orderRepository.cancelOrder(orderId);
    }

    async processPayment(orderId: number, username: string): Promise<void> {
        await this.orderRepository.processPayment(orderId, username);
    }

    async getAllOrders() {
        return await this.orderRepository.getAllOrders();
    }

    async getOrdersByUsername(username: string) {
        return await this.orderRepository.getOrdersByUsername(username);
    }
}
