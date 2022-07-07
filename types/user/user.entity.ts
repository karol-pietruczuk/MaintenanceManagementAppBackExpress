export enum UserType {
    Admin = 'Admin',
    Maintenance = 'Maintenance',
    Production = 'Production',
    Warehouse = 'Warehouse',
}

export interface UserEntity {
    id: string;
    email: string;
    password: string;
    userType: UserType;
    refreshToken: string;
    createTime: Date;
    lastChangeTime: Date;
}

export interface NewUserEntity extends Omit<UserEntity, 'id' | 'refreshToken' | 'createTime' | 'lastChangeTime'> {
    id?: string;
    refreshToken?: string;
    createTime?: Date;
    lastChangeTime?: Date
}