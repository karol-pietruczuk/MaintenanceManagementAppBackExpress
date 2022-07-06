import {Router} from "express";
import {handleFindVariables} from "../utils/validation";
import {OrderRecord} from "../records/order.record";
import {OrderStatus} from "../types";
import {ValidationError} from "../utils/error";

export const orderRouter = Router()
    .get('/', async (req, res) => {
        const {sortAsc, name, rows, page} = handleFindVariables(req.body)
        const tasks = await OrderRecord.find(sortAsc, name, rows, page);
        res.json(tasks);
    })
    .post('/', async (req, res) => {
        const order = new OrderRecord(req.body);
        await order.insert();
        res
            .status(201)
            .json(order);
    })
    .patch('/', async (req, res) => {
        const order = await OrderRecord.getOne(req.body.id);
        const {name, description, status} = req.body;
        let changed = false;

        if (name && typeof name === "string" && name.length <= 100) {
            order.name = name;
            changed = true;
        }

        if (description !== null && description !== undefined && typeof description === "string" && description.length <= 1000) {
            order.description = description;
            changed = true;
        }

        if (OrderStatus[status as OrderStatus]) {
            order.status = status;
            changed = true;
        }

        if (!changed) {
            throw new ValidationError('Nothing to change!')
        }

        await order.update()
        res
            .status(202)
            .json(order);
    })
    .delete('/', async (req, res) => {
        const order = await OrderRecord.getOne(req.body.id);
        await order.delete();
        res
            .status(202)
            .json(order);
    });