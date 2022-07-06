import {v4 as uuid} from "uuid";
import {ValidationError} from "./error";

export const handleId = (id: string): string => {
    if (!id) {
        return uuid();
    } else {
        throw new ValidationError('Cannot insert something that is already inserted!');
    }
};

export const handleFindVariables = (
    obj: any
): {
    sortAsc: boolean;
    name: string;
    rows: number;
    page: number;
} => {
    const sortAsc = (obj.sortAsc || typeof obj.sortAsc === 'boolean') ? obj.sortAsc : true;
    const name = (obj.name || typeof obj.name === 'string') ? obj.name : '';
    const rows = (obj.rows || typeof obj.rows === 'number') ? obj.rows : 15;
    const page = (obj.page || typeof obj.page === 'number') ? obj.page : 1;
    return {
        sortAsc,
        name,
        rows,
        page,
    }
};