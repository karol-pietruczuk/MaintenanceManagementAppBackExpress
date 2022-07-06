import {Router} from "express";
import {handleFindVariables} from "../utils/validation";
import {PartRecord} from "../records/part.record";
import {PartUnit} from "../types";
import {ValidationError} from "../utils/error";

export const partRouter = Router()
    .get('/', async (req, res) => {
        const {sortAsc, name, rows, page} = handleFindVariables(req.body)
        const parts = await PartRecord.find(sortAsc, name, rows, page);
        res.json(parts);
    })
    .post('/', async (req, res) => {
        const part = new PartRecord(req.body);
        await part.insert();
        res
            .status(201)
            .json(part);
    })
    .patch('/', async (req, res) => {
        const part = await PartRecord.getOne(req.body.id);
        const {name, amount, storagePlace, unit} = req.body;
        let changed = false;

        if (name && typeof name === "string" && name.length <= 50) {
            part.name = name;
            changed = true;
        }

        if (amount !== null && amount !== undefined && typeof amount === 'number' && amount <= 999999.99 && amount > 0) {
            part.amount = amount;
            changed = true;
        }

        if (storagePlace !== null && storagePlace !== undefined && typeof storagePlace === 'string' && storagePlace.length <= 30) {
            part.storagePlace = storagePlace;
            changed = true;
        }
        if (PartUnit[unit as PartUnit]) {
            part.unit = unit;
            changed = true;
        }

        if (!changed) {
            throw new ValidationError('Nothing to change!')
        }

        await part.update()
        res
            .status(202)
            .json(part);
    })
    .delete('/', async (req, res) => {
        const part = await PartRecord.getOne(req.body.id);
        await part.delete();
        res
            .status(202)
            .json(part);
    });