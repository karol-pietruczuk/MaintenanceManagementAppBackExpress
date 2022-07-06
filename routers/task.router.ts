import {Router} from "express";
import {TaskRecord} from "../records/task.record";
import {TaskStatus} from "../types";
import {ValidationError} from "../utils/error";

export const taskRouter = Router()
    .get('/', async (req, res) => {
        const sortAsc = (req.body.sortAsc || typeof req.body.sortAsc === 'boolean') ? req.body.sortAsc : true;
        const name = (req.body.name || typeof req.body.name === 'string') ? req.body.name : '';
        const rows = (req.body.rows || typeof req.body.rows === 'number') ? req.body.rows : 15;
        const page = (req.body.page || typeof req.body.page === 'number') ? req.body.page : 1;
        const tasks = await TaskRecord.find(sortAsc, name, rows, page);
        res.json(tasks);
    })
    .post('/', async (req, res) => {
        const task = new TaskRecord(req.body);
        await task.insert();
        res
            .status(201)
            .json(task);
    })
    .patch('/', async (req, res) => {
        if (!TaskStatus[req.body.status as TaskStatus]) {
            throw new ValidationError('Invalid task status!');
        }
        const task = await TaskRecord.getOne(req.body.id);
        task.status = req.body.status;
        await task.update()
        res
            .status(202)
            .json(task);
    })
    .delete('/', async (req, res) => {
        const task = await TaskRecord.getOne(req.body.id);
        await task.delete();
        res
            .status(202)
            .json(task);
    });