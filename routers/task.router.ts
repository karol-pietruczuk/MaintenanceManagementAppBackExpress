import {Router} from "express";

export const taskRouter = Router()
    .get('/', async (req, res) => {
        console.log(req.body);
        /**
         * W req.body obiekt {
         *     search: szukanie zadań po nazwie - domyślnie pusty string
         *     pageNumber: 1 - strona paginacji - domyślnie 1
         *     status: status zadania - domyślnie gdy brak pokazuj zadania zgłoszone, otwarte, w realizacji, wstrzymane, brak części. Nie pokazuj zadań zamkkniętych i odrzuconych
         *     sort: desc/asc - najstarsze/najnowsze zadania - domyślnie od najnowszych do najstarszych wpisow
         *
         * }
         */
        res.json('Send tasks with specified order and with pagination 15 tasks per page. Send also number of all tasks to calculate pages.');
    })
    .post('/', async (req, res) => {
        res.json('Add new task and return task');
    })
    .patch('/:id', async (req, res) => {
        // w rea.body obiekt z statusCode - na jaki status zmieniamy task
        res.json('Change status code of task with specified id');
    })
    .delete('/:id', async (req, res) => {
        res.json('Delete task with specified id');
    });