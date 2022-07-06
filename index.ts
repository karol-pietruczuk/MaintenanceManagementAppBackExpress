import express from 'express';
import 'express-async-errors';
import {taskRouter} from "./routers/task.router";
import {partRouter} from "./routers/part.router";
import {handleError} from "./utils/error";
import {orderRouter} from "./routers/order.router";

const app = express();

app.use(express.json());

app.use('/task', taskRouter);
app.use('/part', partRouter);
app.use('/order', orderRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});