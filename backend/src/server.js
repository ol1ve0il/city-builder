const express = require('express');
const cors = require('cors');
const cityRouter = require('./routes/cities.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/cities', cityRouter);

app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
});