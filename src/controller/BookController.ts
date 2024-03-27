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

bookController.get('/infinite', async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20; // Optionally allow changing the limit
        const books = await bookAPIService.getAllBooksWithTagsAndStock(page, limit);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

bookController.post('/search', async (req: Request, res: Response) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            res.status(400).json({ message: 'Search term is required' });
            return;
        }

        const books = await bookAPIService.searchBooks(searchTerm);
        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
