import {TaskRecord} from "../../records/task.record";
import {NewTaskEntity, TaskStatus} from "../../types";
import {pool} from "../../utils/db";

afterAll(() => {
   pool.end();
});

const defaultObj: NewTaskEntity = {
    name: 'Test Name',
    description: 'blah',
    status: TaskStatus.Reported,
};

test('TaskRecord.find returns tasks array from database.', async () => {
    const tasks = await TaskRecord.find();
    expect(tasks).toBeDefined();
    tasks.forEach((task) => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('name');
        expect(task).toHaveProperty('description');
        expect(task).toHaveProperty('status');
        expect(task).toHaveProperty('createTime');
        expect(task).toHaveProperty('lastChangeTime');
    });
    expect(tasks).not.toHaveLength(0);
});

test('TaskRecord.find returns array of found entries when searching for "a".', async () => {
    const tasks = await TaskRecord.find(true, 'a');
    expect(tasks).toBeDefined();
    expect(tasks).not.toHaveLength(0);
});

test('TaskRecord.find returns empty array when searching for something that not exist.', async () => {
    const tasks = await TaskRecord.find(true, '----------------------------');
    expect(tasks).toEqual([]);
    expect(tasks).toHaveLength(0);
});

test('TaskRecord.insert create id, createTime, lastChangeTime and inserts into database.', async () => {
    const task = new TaskRecord(defaultObj);
    await task.insert();
    expect(task.id).toBeDefined();
    expect(task.createTime).toBeDefined();
    expect(task.lastChangeTime).toBeDefined();
    const sameTask = await TaskRecord.getOne(task.id);
    expect(sameTask).toBeDefined();
});

test('TaskRecord.update change task status from "Reported" to "Open", inserts into database and return changed task.', async () => {
    const newStatus = TaskStatus.Closed;
    const task = new TaskRecord(defaultObj);
    await task.insert();
    task.status = newStatus;
    await task.update();
    expect(newStatus).toBe(task.status);
    await task.delete();
});

test('TaskRecord.delete remove task from database and return deleted task.', async () => {
    const task = new TaskRecord(defaultObj);
    await task.insert();
    expect(task).toBeDefined();
    const deletedTask = await task.delete();
    expect(task.id).toBe(deletedTask.id);
    expect(task.name).toBe(deletedTask.name);
    expect(task.description).toBe(deletedTask.description);
    expect(task.status).toBe(deletedTask.status);
    expect(task.createTime).toBe(deletedTask.createTime);
    expect(await TaskRecord.getOne(task.id)).toBe(null);
});
