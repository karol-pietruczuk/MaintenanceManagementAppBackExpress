import express from 'express';
import 'express-async-errors';
import {taskRouter} from "./Routers/task.router";
import {partRouter} from "./Routers/part.router";
import {handleError} from "./utils/error";

const app = express();

app.use(express.json());

app.use('/task', taskRouter);
app.use('/part', partRouter);
app.use('/order', partRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});