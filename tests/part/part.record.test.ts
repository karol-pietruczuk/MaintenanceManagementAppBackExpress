import {NewPartEntity, PartUnit} from "../../types";
import {PartRecord} from "../../records/part.record";

const defaultObj: NewPartEntity = {
    name: 'Test Name',
    amount: 5,
    unit: PartUnit.Quantity,
    storagePlace: 'magazyn3',
};

test('Can build PartRecord', () => {
    const part = new PartRecord(defaultObj);
    expect(part.name).toBe('Test Name');
    expect(part.amount).toBe(5);
    expect(part.unit).toBe(PartUnit.Quantity);
    expect(part.storagePlace).toBe('magazyn3');
});

test('Validates invalid name', () => {
    expect(() => new PartRecord({
        ...defaultObj,
        name: null,
    })).toThrow("Part name cannot be empty or exceed 50 characters.");
    expect(() => new PartRecord({
        ...defaultObj,
        name: 'a'.repeat(51),
    })).toThrow("Part name cannot be empty or exceed 50 characters.");
});

test('Validates invalid amount', () => {
    expect(() => new PartRecord({
        ...defaultObj,
        amount: 1999999.99,
    })).toThrow('Parts amount must exist and cannot be less than 0 or greater than 999999.99.');
    expect(() => new PartRecord({
        ...defaultObj,
        amount: null,
    })).toThrow('Parts amount must exist and cannot be less than 0 or greater than 999999.99.');
});

test('Validates invalid storagePlace', async () => {
    expect(() => new PartRecord({
        ...defaultObj,
        storagePlace: 'a'.repeat(31),
    })).toThrow('Storage place name must exist and cannot be greater than 30 characters.');
    expect(() => new PartRecord({
        ...defaultObj,
        storagePlace: null,
    })).toThrow('Storage place name must exist and cannot be greater than 30 characters.');
});