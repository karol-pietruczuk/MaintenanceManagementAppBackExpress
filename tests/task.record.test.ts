import {TaskRecord} from "../records/task.record";
import {TaskStatus} from "../types";

const defaultObj = {
    name: 'Test Name',
    description: 'blah',
    status: TaskStatus.Reported,
};

test('Can build TaskRecord', () => {
    const task = new TaskRecord(defaultObj);
    expect(task.name).toBe('Test Name');
    expect(task.description).toBe('blah');
    expect(task.status).toBe(TaskStatus.Reported);
});

test('Validates invalid name', () => {
    expect(() => new TaskRecord({
        ...defaultObj,
        name: null,
    })).toThrow('Nazwa zadania nie może być pusta, ani przekraczać 100 znaków.');
    expect(() => new TaskRecord({
        ...defaultObj,
        name: 'a'.repeat(101),
    })).toThrow('Nazwa zadania nie może być pusta, ani przekraczać 100 znaków.');
});