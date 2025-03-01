import express from 'express'
import buildingsRouter from './buildings'
import { City } from '../models/city';
const router = express.Router();

const { createCity, getAllCities, getCity } = require('../controllers/cityController');

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
        const city: City = await getCity(cityId);
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
    const newCity: City = req.body;
    try {
        const newCityResponse = await createCity(newCity);
        res.status(201).json(newCityResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании города' });
    }
});

export default router;
