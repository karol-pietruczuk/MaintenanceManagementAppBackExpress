import express, {Router} from 'express';
import 'express-async-errors';
import cors from "cors";
import {taskRouter} from "./routers/task.router";
import {partRouter} from "./routers/part.router";
import {handleError} from "./utils/error";
import {orderRouter} from "./routers/order.router";
import {config} from "./config/config";

const app = express();

app.use(cors({
    origin: config.corsOrigin,
}));

app.use(express.json());

const router = Router();

router.use('/task', taskRouter);
router.use('/part', partRouter);
router.use('/order', orderRouter);

app.use('/api', router);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});