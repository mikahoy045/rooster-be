import { Request, Response, Router } from 'express';
import { AuthService } from '../service/authService';

export const authController = Router();
const authService = new AuthService();

authController.post('/register', async (req: Request, res: Response) => {
    try {
        const user = await authService.register(req.body.username, req.body.password);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

authController.post('/login', async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body.username, req.body.password);
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

authController.post('/logout', async (req: Request, res: Response) => {
    const result = await authService.logout();
    res.json(result);
});
