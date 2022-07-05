export enum PartUnit{
    Quantity = 'Quantity',
    Meters = 'Meters',
}

export interface PartEntity {
    id: string;
    name: string;
    amount: number;
    unit: PartUnit;
    storagePlace: string;
    createTime: Date;
    lastChangeTime: Date;
}