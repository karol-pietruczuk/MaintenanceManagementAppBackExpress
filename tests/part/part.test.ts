import {TaskRecord} from "../../records/task.record";
import {NewPartEntity, PartUnit} from "../../types";
import {pool} from "../../utils/db";
import {PartRecord} from "../../records/part.record";

afterAll(() => {
    pool.end();
});

const defaultObj: NewPartEntity = {
    name: 'Test Name',
    amount: 5,
    unit: PartUnit.Quantity,
    storagePlace: 'magazyn3',
};

test('PartRecord.find returns tasks array from database.', async () => {
    const parts = await PartRecord.find();
    expect(parts).toBeDefined();
    parts.forEach((part) => {
        expect(part).toHaveProperty('id');
        expect(part).toHaveProperty('name');
        expect(part).toHaveProperty('amount');
        expect(part).toHaveProperty('unit');
        expect(part).toHaveProperty('storagePlace');
        expect(part).toHaveProperty('createTime');
        expect(part).toHaveProperty('lastChangeTime');
    });
    expect(parts).not.toHaveLength(0);
});

test('PartRecord.find returns array of found entries when searching for "a".', async () => {
    const parts = await PartRecord.find(true, 'a');
    expect(parts).toBeDefined();
    expect(parts).not.toHaveLength(0);
});

test('PartRecord.find returns empty array when searching for something that not exist.', async () => {
    const parts = await PartRecord.find(true, '----------------------------');
    expect(parts).toEqual([]);
    expect(parts).toHaveLength(0);
});

test('PartRecord.insert create id, createTime, lastChangeTime and inserts into database.', async () => {
    const part = new PartRecord(defaultObj);
    await part.insert();
    expect(part.id).toBeDefined();
    expect(part.createTime).toBeDefined();
    expect(part.lastChangeTime).toBeDefined();
    const samePart = await TaskRecord.getOne(part.id);
    expect(samePart).toBeDefined();
});

test('PartRecord.update updates name, inserts into database and return changed part.', async () => {
    const newName = '-----------';
    const part = new PartRecord(defaultObj);
    await part.insert();
    part.name = newName;
    await part.update();
    expect(newName).toBe(part.name);
    await part.delete();
});

test('PartRecord.update updates amount, inserts into database and return changed part.', async () => {
    const newAmount = 20;
    const part = new PartRecord(defaultObj);
    await part.insert();
    part.amount = newAmount;
    await part.update();
    expect(newAmount).toBe(part.amount);
    await part.delete();
});

test('PartRecord.update updates unit, inserts into database and return changed part.', async () => {
    const newUnit = PartUnit.Meters;
    const part = new PartRecord(defaultObj);
    await part.insert();
    part.unit = newUnit;
    await part.update();
    expect(newUnit).toBe(part.unit);
    await part.delete();
});

test('PartRecord.update updates storagePlace, inserts into database and return changed part.', async () => {
    const newStoragePlace = '------';
    const part = new PartRecord(defaultObj);
    await part.insert();
    part.storagePlace = newStoragePlace;
    await part.update();
    expect(newStoragePlace).toBe(part.storagePlace);
    await part.delete();
});

test('PartRecord.delete remove part from database and return deleted part.', async () => {
    const part = new PartRecord(defaultObj);
    await part.insert();
    expect(part).toBeDefined();
    const deletedTask = await part.delete();
    expect(part.id).toBe(deletedTask.id);
    expect(part.name).toBe(deletedTask.name);
    expect(part.amount).toBe(deletedTask.amount);
    expect(part.unit).toBe(deletedTask.unit);
    expect(part.storagePlace).toBe(deletedTask.storagePlace);
    expect(part.createTime).toBe(deletedTask.createTime);
    expect(await PartRecord.getOne(part.id)).toBe(null);
});
