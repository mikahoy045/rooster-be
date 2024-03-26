import express from 'express';
import { authController } from './controller/authController';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/auth', authController);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
