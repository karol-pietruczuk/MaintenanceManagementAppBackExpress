import {NewOrderEntity, OrderStatus} from "../../types";
import {OrderRecord} from "../../records/order.record";

const defaultObj: NewOrderEntity = {
    name: 'Test Name',
    description: 'blah',
    status: OrderStatus.Reported,
};

test('Can build OrderRecord', () => {
    const order = new OrderRecord(defaultObj);
    expect(order.name).toBe('Test Name');
    expect(order.description).toBe('blah');
    expect(order.status).toBe(OrderStatus.Reported);
});

test('Validates invalid name', () => {
    expect(() => new OrderRecord({
        ...defaultObj,
        name: null,
    })).toThrow("Order name cannot be empty or exceed 100 characters.");
    expect(() => new OrderRecord({
        ...defaultObj,
        name: 'a'.repeat(101),
    })).toThrow("Order name cannot be empty or exceed 100 characters.");
});

test('Validates invalid description', () => {
    expect(() => new OrderRecord({
        ...defaultObj,
        description: 'a'.repeat(1001),
    })).toThrow("Order description must exist and cannot exceed 1000 characters.");
});

test('Validates possibility to insert undefined to description', async () => {
    expect(() => new OrderRecord({
        ...defaultObj,
        description: undefined,
    })).toThrow("Order description must exist and cannot exceed 1000 characters.");
});