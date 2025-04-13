import express, { Request, Response } from 'express'
import { Building } from '../models/building';
const router = express.Router({ mergeParams: true });
const { createBuilding, updateBuilding, removeBuilding, getBuildings } = require('../controllers/buildingController'); // Импортируем функции

interface BuildingParams {
    id: string; 
}

// Получение всех построек в городе
router.get('/', async (req: Request<BuildingParams>, res: Response) => {
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

// Добавление нового здания
router.post('/', async (req, res) => {
    const newBuilding: Building = req.body;
    try {
        const newBuildingResponse = await createBuilding(newBuilding);
        res.status(201).json(newBuildingResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании постройки' });
    }
});

// Изменение данных в постройке
router.post('/:id', async (req, res) => {
    const id = req.params.id;
    const newData: Building = req.body;
    try {
        const updateResponse = await updateBuilding(id, newData);
        res.status(201).json(updateResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при изменении постройки' });
    }
})


// Удаление здания
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const removeBuildingResponse = await removeBuilding(id);
        res.status(201).json(removeBuildingResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при удалении постройки' });
    }
})

export default router