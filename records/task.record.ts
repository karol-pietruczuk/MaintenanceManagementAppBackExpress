import {TaskEntity, TaskStatus} from "../types";
import {ValidationError} from "../utils/error";

interface NewTaskEntity extends Omit<TaskEntity, 'id'> {
    id?: string;
}

export class TaskRecord implements NewTaskEntity {
    public id: string;
    public name: string;
    public description: string = '';
    public status: TaskStatus = TaskStatus.Reported;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewTaskEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa zadania nie może być pusta, ani przekraczać 100 znaków.');
        }

        if (obj.description.length > 1000) {
            throw new ValidationError('Opis zadania nie może przekraczać 1000 znaków.');
        }

        this.name = obj.name;
        this.description = obj.description;
        this.status = obj.status;
    }

}