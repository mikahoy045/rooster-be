import { BookAPIRepository } from '../repository/BookAPIRepository';

export class BookAPIService {
    private bookAPIRepository = new BookAPIRepository();

    async getAllBooks() {
        return await this.bookAPIRepository.getAllBooks();
    }
}
