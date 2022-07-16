import {Router} from "express";
import {TaskRecord} from "../records/task.record";
import {TaskStatus, UserType} from "../types";
import {AccessError, ValidationError} from "../utils/error";
import {handleFindVariables} from "../utils/validation";
import {authenticate} from "../utils/auth";
import {AuthenticationRequest} from "../types/auth/auth";
import {UserRecord} from "../records/user.record";

export const taskRouter = Router()
    .get('/:sortAsc/:rows/:page/:name?', authenticate, async (req: AuthenticationRequest, res) => {
        const {sortAsc, name, rows, page} = handleFindVariables(req.params)
        const tasks = await TaskRecord.find(sortAsc, name, rows, page);
        res.json(tasks);
    })
    .get('/', authenticate, async (req: AuthenticationRequest, res) => {
        const tasks = await TaskRecord.find();
        res.json(tasks);
    })
    .post('/', authenticate, async (req: AuthenticationRequest, res) => {
        const task = new TaskRecord(req.body);
        await task.insert();
        res
            .status(201)
            .json(task);
    })
    .patch('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType !== UserType.Admin && user.userType !== UserType.Maintenance) throw new AccessError("Forbidden");

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
    .delete('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType !== UserType.Admin) throw new AccessError("Forbidden");

        const task = await TaskRecord.getOne(req.body.id);
        await task.delete();
        res
            .status(202)
            .json(task);
    });