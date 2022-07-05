import {PartEntity, PartUnit} from "../types";
import {ValidationError} from "../utils/error";

interface NewPartEntity extends Omit<PartEntity, 'id'> {
    id?: string;
}

export class PartRecord implements NewPartEntity {

    public id: string;
    public name: string;
    public amount: number = 0;
    public unit: PartUnit = PartUnit.Quantity;
    public storagePlace: string;
    public createTime: Date;
    public lastChangeTime: Date;

    constructor(obj: NewPartEntity) {
        if (!obj.name || obj.name.length > 50) {
            throw new ValidationError('Nazwa części nie może być pusta, ani przekraczać 50 znaków.');
        }

        if (obj.amount > 999999.99 || obj.amount < 0) {
            throw new ValidationError('Ilość części nie może być mniejsza od 0 lub większa od 999999.99.');
        }

        if (obj.storagePlace.length > 30) {
            throw new ValidationError('Nazwa miejsca przechowywania części nie może być większe od 30.');
        }

        this.name = obj.name;
        this.amount = obj.amount;
        this.unit = obj.unit;
        this.storagePlace = obj.storagePlace;
    }

}