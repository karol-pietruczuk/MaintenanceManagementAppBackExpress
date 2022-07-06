export enum TaskStatus {
    Reported = 'Reported',
    Open = 'Open',
    InProgress = 'InProgress',
    Paused = 'Paused',
    MissingParts = 'MissingParts',
    Closed = 'Closed',
    Rejected = 'Rejected',
}

export interface TaskEntity {
    id: string;
    name: string;
    description: string;
    status: TaskStatus;
    createTime: Date;
    lastChangeTime: Date;
}

export interface NewTaskEntity extends Omit<TaskEntity, 'id' | 'createTime' | 'lastChangeTime'> {
    id?: string;
    createTime?: Date;
    lastChangeTime?: Date
}