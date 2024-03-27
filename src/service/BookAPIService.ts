import { BookAPIRepository } from '../repository/BookAPIRepository';

export class BookAPIService {
    private bookAPIRepository = new BookAPIRepository();

    async getAllBooks() {
        return await this.bookAPIRepository.getAllBooks();
    }

    async getAllBooksWithTagsAndStock(page: number, limit: number) {
        return await this.bookAPIRepository.getAllBooksWithTagsAndStock(page, limit);
    }

    async searchBooks(searchTerm: string) {
        return await this.bookAPIRepository.searchBooks(searchTerm);
    }
}
