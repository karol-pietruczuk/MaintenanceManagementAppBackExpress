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
    })).toThrow("Nazwa zamówienia nie może być pusta, ani przekraczać 100 znaków.");
    expect(() => new OrderRecord({
        ...defaultObj,
        name: 'a'.repeat(101),
    })).toThrow("Nazwa zamówienia nie może być pusta, ani przekraczać 100 znaków.");
});

test('Validates invalid description', () => {
    expect(() => new OrderRecord({
        ...defaultObj,
        description: 'a'.repeat(1001),
    })).toThrow("Opis zamówienia nie może przekraczać 1000 znaków.");
});

test('Validates possibility to insert undefined to description', async () => {
    expect(() => new OrderRecord({
        ...defaultObj,
        description: undefined,
    })).toThrow("Opis zamówienia nie może przekraczać 1000 znaków.");
});