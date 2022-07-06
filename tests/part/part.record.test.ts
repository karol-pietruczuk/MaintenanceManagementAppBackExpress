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
    })).toThrow("Nazwa części nie może być pusta, ani przekraczać 50 znaków.");
    expect(() => new PartRecord({
        ...defaultObj,
        name: 'a'.repeat(51),
    })).toThrow("Nazwa części nie może być pusta, ani przekraczać 50 znaków.");
});

test('Validates invalid amount', () => {
    expect(() => new PartRecord({
        ...defaultObj,
        amount: 1999999.99,
    })).toThrow('Ilość części nie może być mniejsza od 0 lub większa od 999999.99.');
    expect(() => new PartRecord({
        ...defaultObj,
        amount: null,
    })).toThrow('Ilość części nie może być mniejsza od 0 lub większa od 999999.99.');
});

test('Validates invalid storagePlace', async () => {
    expect(() => new PartRecord({
        ...defaultObj,
        storagePlace: 'a'.repeat(31),
    })).toThrow('Nazwa miejsca przechowywania części nie może być większe od 30.');
    expect(() => new PartRecord({
        ...defaultObj,
        storagePlace: null,
    })).toThrow('Nazwa miejsca przechowywania części nie może być większe od 30.');
});