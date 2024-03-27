import { Request, Response, Router } from 'express';
import { UserAPIService } from '../service/UserAPIService';

export const userController = Router();
const userAPIService = new UserAPIService();

userController.get('/:username', async (req: Request, res: Response) => {
    try {
        const userData = await userAPIService.getUserData(req.params.username);
        if (userData) {
            res.json(userData);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
