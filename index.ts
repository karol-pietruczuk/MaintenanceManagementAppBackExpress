import express from 'express';
import 'express-async-errors';

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    res.json('Backend is Alive!');
});

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});