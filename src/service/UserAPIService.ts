import { UserAPIRepository } from '../repository/UserAPIRepository';

export class UserAPIService {
    private userAPIRepository = new UserAPIRepository();

    async getUserData(username: string) {
        return await this.userAPIRepository.getUserData(username);
    }
}
