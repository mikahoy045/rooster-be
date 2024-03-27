import express from 'express';
import { authController } from './controller/authController';
import dotenv from 'dotenv';
import {bookController} from './controller/BookController';
import {userController} from './controller/UserController';
import {orderController} from './controller/OrderController';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const apiRouter = express.Router();

apiRouter.use('/auth', authController);
apiRouter.use('/books', bookController);
apiRouter.use('/user', userController);
apiRouter.use('/buy', orderController);

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
