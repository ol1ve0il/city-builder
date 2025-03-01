import express from 'express';
import cityRouter from './routes/cities'

const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/cities', cityRouter);

app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
});