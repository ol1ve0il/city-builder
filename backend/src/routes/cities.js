const express = require('express');
const router = express.Router();

const { createCity, getAllCities, getCity } = require('../controllers/cityController');

const buildingsRouter = require('./buildings.js')

router.use('/:id/buildings', buildingsRouter); // Подключаем маршруты для построек

router.get('/', async (req, res) => {
    try {
        const allCities = await getAllCities();
        if (allCities.length > 0) {
            res.json(allCities);
        } else {
            res.status(404).json({ error: 'Ничего не найдено' })
        }
    } catch {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
})

// Получение информации о городе
router.get('/:id', async (req, res) => {
    const cityId = req.params.id;
    try {
        const city = await getCity(cityId);
        if (city) {
            res.json(city);
        } else {
            res.status(404).json({ error: 'Город не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создание нового города
router.post('/', async (req, res) => { 
    const { name, size } = req.body;
    try {
        const newCity = await createCity(name, size);
        res.status(201).json(newCity);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании города' });
    }
});

module.exports = router;
