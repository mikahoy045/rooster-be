import { UserRepository } from '../repository/userRepository';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';

export class AuthService {
    private userRepository = new UserRepository();

    async register(username: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) throw new Error('User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(null, username, hashedPassword, 100);
        return await this.userRepository.save(newUser);
    }

    async login(username: string, password: string): Promise<{ message: string; user: User }> {
        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new Error('User not found');

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Invalid credentials');

        return { message: 'Logged in successfully', user };
    }

    async logout(): Promise<{ message: string }> {
        return { message: 'Logged out successfully' };
    }
}
