const express = require('express');
const router = express.Router({ mergeParams: true });
const { createBuilding, getBuildings } = require('../controllers/buildingController'); // Импортируем функции

// Получение всех построек в городе
router.get('/', async (req, res) => {
    const cityId = req.params.id;
    try {
        const buildings = await getBuildings(cityId);
        if (buildings) {
            res.json(buildings);
        } else {
            res.status(404).json({ error: 'Город или постройки не найдены' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Добавление нового здания в город
router.post('/', async (req, res) => {
    const cityId = req.params.id;
    const { name, x, y } = req.body;
    try {
        const newBuilding = await createBuilding(cityId, name, x, y);
        res.status(201).json(newBuilding);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании постройки' });
    }
});

module.exports = router;
