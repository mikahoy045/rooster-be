import express from 'express';
import { authController } from './controller/authController';
import dotenv from 'dotenv';
import {bookController} from './controller/BookController';
import {userController} from './controller/UserController';
import {orderController} from './controller/OrderController';

dotenv.config();

const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allow only your frontend origin to access the API
}));

const apiRouter = express.Router();

apiRouter.use('/auth', authController);
apiRouter.use('/books', bookController);
apiRouter.use('/user', userController);
apiRouter.use('/order', orderController);

app.use('/api', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
