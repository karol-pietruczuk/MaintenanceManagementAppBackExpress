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