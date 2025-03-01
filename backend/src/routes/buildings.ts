import express, { Request, Response } from 'express'
import { Building } from '../models/building';
const router = express.Router({ mergeParams: true });
const { createBuilding, getBuildings } = require('../controllers/buildingController'); // Импортируем функции

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

// Добавление нового здания в город
router.post('/', async (req, res) => {
    const newBuilding: Building = req.body;
    try {
        const newBuildingResponse = await createBuilding(newBuilding);
        res.status(201).json(newBuildingResponse);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании постройки' });
    }
});

export default router