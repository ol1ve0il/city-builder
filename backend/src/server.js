const express = require('express');
const app = express();
app.use(express.json());

const cityRouter = require('./routes/cities.js');

app.use('/cities', cityRouter);

app.listen(3000, () => {
    console.log(`Сервер запущен на http://localhost:3000`);
});