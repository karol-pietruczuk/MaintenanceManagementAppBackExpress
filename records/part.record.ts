import {NewPartEntity, PartEntity, PartUnit} from "../types";
import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {FieldPacket, format} from "mysql2";
import {handleId} from "../utils/validation";

type PartRecordResults = [PartEntity[], FieldPacket[]];

export class PartRecord implements NewPartEntity {

    public id: string;
    public name: string;
    public amount: number;
    public unit: PartUnit;
    public storagePlace: string;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewPartEntity) {
        if (!obj.name || typeof obj.name !== "string" || obj.name.length > 50) {
            throw new ValidationError('Nazwa części nie może być pusta, ani przekraczać 50 znaków.');
        }

        if (obj.amount === null || obj.amount === undefined || typeof obj.amount !== 'number' || obj.amount > 999999.99 || obj.amount < 0) {
            throw new ValidationError('Ilość części nie może być mniejsza od 0 lub większa od 999999.99.');
        }

        if (obj.storagePlace === null || obj.storagePlace === undefined || typeof obj.storagePlace !== 'string' || obj.storagePlace.length > 30) {
            throw new ValidationError('Nazwa miejsca przechowywania części nie może być większe od 30.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.amount = obj.amount;
        this.unit = PartUnit[obj.unit] ? obj.unit : PartUnit.Quantity;
        this.storagePlace = obj.storagePlace;
        this.createTime = obj.createTime ? obj.createTime : new Date();
        this.lastChangeTime = obj.lastChangeTime ? obj.lastChangeTime : new Date();
    }

    static async getOne(id: string): Promise<PartRecord | null> {
        if (typeof id !== 'string') {
            throw new ValidationError('Invalid id!');
        }
        const [results] = await pool.execute("SELECT * FROM `parts` WHERE `id` = :id", {
            id,
        }) as PartRecordResults;

        return results.length === 0 ? null : new PartRecord(results[0]);
    }

    static async find(sortAsc = true, name = '', rows = 15, page = 1): Promise<PartRecord [] | []> {
        const [results] = await pool.execute("SELECT * FROM `parts` WHERE `name` LIKE :search ORDER BY `lastChangeTime` " + format(sortAsc ? "ASC " : "DESC ") + "LIMIT :rows OFFSET :offset", {
            search: `%${name}%`,
            offset: (page - 1) * rows,
            rows,
        }) as PartRecordResults;

        return results.map((result) => {
            const {
                id, name, amount, unit, storagePlace, createTime, lastChangeTime
            } = result;
            return new PartRecord({
                id, name, amount, unit, storagePlace, createTime, lastChangeTime
            })
        });
    }

    async insert(): Promise<PartRecord> {
        this.id = handleId(this.id);

        this.createTime = new Date();
        this.lastChangeTime = new Date();

        await pool.execute("INSERT INTO `parts`(`id`, `name`, `amount`, `unit`, `storagePlace`, `createTime`, `lastChangeTime`) VALUES (:id, :name, :amount, :unit, :storagePlace, :createTime, :lastChangeTime)", this);

        return this;
    }

    async update(): Promise<PartRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("UPDATE `parts` SET `name` = :name, `amount` = :amount, `unit` = :unit, `storagePlace` = :storagePlace, `lastChangeTime` = :lastChangeTime WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            amount: this.amount,
            unit: this.unit,
            storagePlace: this.storagePlace,
            lastChangeTime: this.lastChangeTime,
        });
        return this;
    }

    async delete(): Promise<PartRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("DELETE FROM `parts` WHERE `id` = :id", {
            id: this.id,
        });
        return this;
    }

}