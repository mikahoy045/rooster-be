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
}
