import {TaskRecord} from "../../records/task.record";
import {NewTaskEntity, TaskStatus} from "../../types";

const defaultObj: NewTaskEntity = {
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
    })).toThrow('Task name cannot be empty or exceed 100 characters.');
    expect(() => new TaskRecord({
        ...defaultObj,
        name: 'a'.repeat(101),
    })).toThrow('Task name cannot be empty or exceed 100 characters.');
});

test('Validates invalid description', () => {
    expect(() => new TaskRecord({
        ...defaultObj,
        description: 'a'.repeat(1001),
    })).toThrow('Task description must exist and cannot exceed 1000 characters.');
});

test('Validates possibility to insert undefined to description', async () => {
    expect(() => new TaskRecord({
        ...defaultObj,
        description: undefined,
    })).toThrow('Task description must exist and cannot exceed 1000 characters.');
});