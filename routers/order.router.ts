import {Router} from "express";
import {handleFindVariables} from "../utils/validation";
import {OrderRecord} from "../records/order.record";
import {OrderStatus, UserType} from "../types";
import {AccessError, ValidationError} from "../utils/error";
import {AuthenticationRequest} from "../types/auth/auth";
import {authenticate} from "../utils/auth";
import {UserRecord} from "../records/user.record";

export const orderRouter = Router()
    .get('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType === UserType.Production) throw new AccessError("Forbidden");

        const {sortAsc, name, rows, page} = handleFindVariables(req.body)
        const tasks = await OrderRecord.find(sortAsc, name, rows, page);
        res.json(tasks);
    })
    .post('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType === UserType.Production || user.userType === UserType.Warehouse) throw new AccessError("Forbidden");

        const order = new OrderRecord(req.body);
        await order.insert();
        res
            .status(201)
            .json(order);
    })
    .patch('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType === UserType.Production) throw new AccessError("Forbidden");

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
    .delete('/', authenticate, async (req: AuthenticationRequest, res) => {
        const user = await UserRecord.getOne(req.user.id, true);
        if (user.userType !== UserType.Admin) throw new AccessError("Forbidden");

        const order = await OrderRecord.getOne(req.body.id);
        await order.delete();
        res
            .status(202)
            .json(order);
    });