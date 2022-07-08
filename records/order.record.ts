import {NewOrderEntity, OrderEntity, OrderStatus} from "../types";
import {ValidationError} from "../utils/error";
import {FieldPacket, format} from "mysql2";
import {handleId} from "../utils/validation";
import {pool} from "../utils/db";

type OrderRecordResults = [OrderEntity[], FieldPacket[]];

export class OrderRecord implements NewOrderEntity {
    public id: string;
    public name: string;
    public description: string;
    public status: OrderStatus;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewOrderEntity) {
        if (!obj.name || typeof obj.name !== "string" || obj.name.length > 100) {
            throw new ValidationError('Order name cannot be empty or exceed 100 characters.');
        }

        if (obj.description === null || obj.description === undefined || typeof obj.description !== "string" || obj.description.length > 1000) {
            throw new ValidationError('Order description must exist and cannot exceed 1000 characters.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.status = OrderStatus[obj.status] ? obj.status : OrderStatus.Reported;
        this.createTime = obj.createTime ? obj.createTime : new Date();
        this.lastChangeTime = obj.lastChangeTime ? obj.lastChangeTime : new Date();

    }

    static async getOne(id: string): Promise<OrderRecord | null> {
        if (typeof id !== 'string') {
            throw new ValidationError('Invalid id!');
        }
        const [results] = await pool.execute("SELECT * FROM `orders` WHERE `id` = :id", {
            id,
        }) as OrderRecordResults;

        return results.length === 0 ? null : new OrderRecord(results[0]);
    }

    static async find(sortAsc = true, name = '', rows = 15, page = 1): Promise<OrderRecord [] | []> {
        const [results] = await pool.execute("SELECT * FROM `orders` WHERE `name` LIKE :search ORDER BY `lastChangeTime` " + format(sortAsc ? "ASC " : "DESC ") + "LIMIT :rows OFFSET :offset", {
            search: `%${name}%`,
            offset: (page - 1) * rows,
            rows,
        }) as OrderRecordResults;

        return results.map((result) => {
            const {
                id, name, description, status, createTime, lastChangeTime
            } = result;
            return new OrderRecord({
                id, name, description, status, createTime, lastChangeTime
            })
        });
    }

    async insert(): Promise<OrderRecord> {
        this.id = handleId(this.id);

        this.createTime = new Date();
        this.lastChangeTime = new Date();

        await pool.execute("INSERT INTO `orders`(`id`, `name`, `description`, `status`, `createTime`, `lastChangeTime`) VALUES (:id, :name, :description, :status, :createTime, :lastChangeTime)", this);

        return this;
    }

    async update(): Promise<OrderRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("UPDATE `orders` SET `name` = :name, `description` = :description, `status` = :status, `lastChangeTime` = :lastChangeTime WHERE `id` = :id", {
            id: this.id,
            name: this.name,
            description: this.description,
            status: this.id,
            lastChangeTime: this.lastChangeTime,
        });
        return this;
    }

    async delete(): Promise<OrderRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("DELETE FROM `orders` WHERE `id` = :id", {
            id: this.id,
        });
        return this;
    }

}