export enum OrderStatus {
    Reported = 'Reported',
    Accepted = 'Accepted',
    InProgress = 'InProgress',
    Ordered = 'Ordered',
    Realized = 'Realized',
}

export interface OrderEntity {
    id: string;
    name: string;
    description: string;
    status: OrderStatus;
    createTime: Date;
    lastChangeTime: Date;
}

export interface NewOrderEntity extends Omit<OrderEntity, 'id' | 'createTime' | 'lastChangeTime'> {
    id?: string;
    createTime?: Date;
    lastChangeTime?: Date
}