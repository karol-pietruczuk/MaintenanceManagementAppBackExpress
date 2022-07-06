import {pool} from "../../utils/db";
import {NewOrderEntity, OrderStatus} from "../../types";
import {OrderRecord} from "../../records/order.record";

afterAll(() => {
    pool.end();
});

const defaultObj: NewOrderEntity = {
    name: 'Test Name',
    description: 'blah',
    status: OrderStatus.Reported,
};

test('OrderRecord.find returns tasks array from database.', async () => {
    const orders = await OrderRecord.find();
    expect(orders).toBeDefined();
    orders.forEach((order) => {
        expect(order).toHaveProperty('id');
        expect(order).toHaveProperty('name');
        expect(order).toHaveProperty('description');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('createTime');
        expect(order).toHaveProperty('lastChangeTime');
    });
    expect(orders).not.toHaveLength(0);
});

test('OrderRecord.find returns array of found entries when searching for "a".', async () => {
    const orders = await OrderRecord.find(true, 'a');
    expect(orders).toBeDefined();
    expect(orders).not.toHaveLength(0);
});

test('OrderRecord.find returns empty array when searching for something that not exist.', async () => {
    const orders = await OrderRecord.find(true, '----------------------------');
    expect(orders).toEqual([]);
    expect(orders).toHaveLength(0);
});

test('OrderRecord.insert create id, createTime, lastChangeTime and inserts into database.', async () => {
    const order = new OrderRecord(defaultObj);
    await order.insert();
    expect(order.id).toBeDefined();
    expect(order.createTime).toBeDefined();
    expect(order.lastChangeTime).toBeDefined();
    const sameOrder = await OrderRecord.getOne(order.id);
    expect(sameOrder).toBeDefined();
});

test('OrderRecord.update updates name, inserts into database and return changed task.', async () => {
    const newName = '---------';
    const order = new OrderRecord(defaultObj);
    await order.insert();
    order.name = newName;
    await order.update();
    expect(newName).toBe(order.name);
    await order.delete();
});

test('OrderRecord.update updates description, inserts into database and return changed task.', async () => {
    const newDescription = '---------';
    const order = new OrderRecord(defaultObj);
    await order.insert();
    order.description = newDescription;
    await order.update();
    expect(newDescription).toBe(order.description);
    await order.delete();
});

test('OrderRecord.update updates status, inserts into database and return changed task.', async () => {
    const newStatus = OrderStatus.Accepted;
    const order = new OrderRecord(defaultObj);
    await order.insert();
    order.status = newStatus;
    await order.update();
    expect(newStatus).toBe(order.status);
    await order.delete();
});

test('OrderRecord.delete remove task from database and return deleted task.', async () => {
    const order = new OrderRecord(defaultObj);
    await order.insert();
    expect(order).toBeDefined();
    const deletedOrder = await order.delete();
    expect(order.id).toBe(deletedOrder.id);
    expect(order.name).toBe(deletedOrder.name);
    expect(order.description).toBe(deletedOrder.description);
    expect(order.status).toBe(deletedOrder.status);
    expect(order.createTime).toBe(deletedOrder.createTime);
    expect(await OrderRecord.getOne(order.id)).toBe(null);
});
