import {OrderEntity, OrderStatus} from "../types";
import {ValidationError} from "../utils/error";

interface NewOrderEntity extends Omit<OrderEntity, 'id'> {
    id?: string;
}

export class OrderRecord implements NewOrderEntity {
    public id: string;
    public name: string;
    public description: string = '';
    public status: OrderStatus = OrderStatus.Reported;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewOrderEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa zamówienia nie może być pusta, ani przekraczać 100 znaków.');
        }

        if (obj.description.length > 1000) {
            throw new ValidationError('Opis zamówienia nie może przekraczać 1000 znaków.');
        }

        this.name = obj.name;
        this.description = obj.description;
        this.status = obj.status;
    }

}