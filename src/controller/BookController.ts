import { Request, Response, Router } from 'express';
import { BookAPIService } from '../service/BookAPIService';

export const bookController = Router();
const bookAPIService = new BookAPIService();

bookController.get('/', async (req: Request, res: Response) => {
    try {
        const books = await bookAPIService.getAllBooks();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
