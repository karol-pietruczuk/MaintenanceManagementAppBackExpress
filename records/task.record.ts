import {TaskEntity, TaskStatus} from "../types";
import {ValidationError} from "../utils/error";
import {pool} from "../utils/db";
import {FieldPacket, format} from "mysql2";
import {v4 as uuid} from "uuid";

interface NewTaskEntity extends Omit<TaskEntity, 'id' | 'createTime' | 'lastChangeTime'> {
    id?: string;
    createTime?: Date;
    lastChangeTime?: Date
}

type TaskRecordResults = [TaskEntity[], FieldPacket[]];

export class TaskRecord implements NewTaskEntity {
    public id: string;
    public name: string;
    public description: string;
    public status: TaskStatus;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewTaskEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa zadania nie może być pusta, ani przekraczać 100 znaków.');
        }

        if (obj.description && obj.description.length > 1000) {
            throw new ValidationError('Opis zadania nie może przekraczać 1000 znaków.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description ? obj.description : '';
        this.status = TaskStatus[obj.status] ? obj.status : TaskStatus.Reported;
        this.createTime = obj.createTime ? obj.createTime : new Date();
        this.lastChangeTime = obj.lastChangeTime ? obj.lastChangeTime : new Date();
    }

    static async getOne(id: string): Promise<TaskRecord | null> {
        if (typeof id !== 'string') {
            throw new ValidationError('Invalid id!');
        }
        const [results] = await pool.execute("SELECT * FROM `tasks` WHERE `id` = :id", {
            id,
        }) as TaskRecordResults;

        return results.length === 0 ? null : new TaskRecord(results[0]);
    }

    static async find(sortAsc = true, name = '', rows = 15, page = 1): Promise<TaskRecord [] | []> {
        const [results] = await pool.execute("SELECT * FROM `tasks` WHERE `name` LIKE :search ORDER BY `lastChangeTime` " + format(sortAsc ? "ASC " : "DESC ") + "LIMIT :rows OFFSET :offset", {
            search: `%${name}%`,
            offset: (page - 1) * rows,
            rows,
        }) as TaskRecordResults;

        return results.map((result) => {
            const {
                id, name, description, status, createTime, lastChangeTime
            } = result;
            return new TaskRecord({
                id, name, description, status, createTime, lastChangeTime
            })
        });
    }

    async insert(): Promise<TaskRecord> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted!');
        }

        this.createTime = new Date();
        this.lastChangeTime = new Date();

        await pool.execute("INSERT INTO `tasks`(`id`, `name`, `description`, `status`, `createTime`, `lastChangeTime`) VALUES (:id, :name, :description, :status, :createTime, :lastChangeTime)", this);

        return this;
    }

    async update(): Promise<TaskRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("UPDATE `tasks` SET `status` = :status, `lastChangeTime` = :lastChangeTime WHERE `id` = :id", {
            id: this.id,
            status: this.id,
            lastChangeTime: this.lastChangeTime,
        });
        return this;
    }

    async delete(): Promise<TaskRecord> {
        this.lastChangeTime = new Date();
        await pool.execute("DELETE FROM `tasks` WHERE `id` = :id", {
            id: this.id,
        });
        return this;
    }
}