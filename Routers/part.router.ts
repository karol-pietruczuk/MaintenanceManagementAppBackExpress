import {Router} from "express";

export const partRouter = Router()
    .get('/', async (req, res) => {
        /**
         * W req.body obiekt {
         *     search: szukanie części po nazwie - domyślnie pusty string
         *     pageNumber: 1 - strona paginacji - domyślnie 1
         *     amount: ilość sztuk
         *     sort: desc/asc - najstarsze/najnowsze czesci - domyślnie od najnowszych do najstarszych wpisow
         *     order: odniesienie do aktywnych zapotrzebowac na ta czesc
         *
         * }
         */
        res.json('Send parts with specified order and with pagination 15 tasks per page. Send also number of all tasks to calculate pages.');
    })
    .post('/', async (req, res) => {
        res.json('Add new part');
    })
    .patch('/:id', async (req, res) => {
        res.json('Change part');
    })
    .delete('/:id', async (req, res) => {
        res.json('Delete part');
    });