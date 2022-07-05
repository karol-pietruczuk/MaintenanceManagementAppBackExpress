import {Router} from "express";

export const orderRouter = Router()
    .get('/', async (req, res) => {
        /**
         * W req.body obiekt {
         *     search: szukanie zapotrzebowania po nazwie - domyślnie pusty string
         *     pageNumber: 1 - strona paginacji - domyślnie 1
         *     amount: ilość sztuk zapotrzebowania
         *     sort: desc/asc - najstarsze/najnowsze zapotrzebowania - domyślnie od najnowszych do najstarszych wpisow
         *     part: odniesienie do spisu czesci magazyny, jesli istnieje
         *
         * }
         */
        res.json('Send order with specified sort and with pagination 15 tasks per page. Send also number of all tasks to calculate pages.');
    })
    .post('/', async (req, res) => {
        res.json('Add new order');
    })
    .patch('/:id', async (req, res) => {
        res.json('Change order');
    })
    .delete('/:id', async (req, res) => {
        res.json('Delete order');
    });