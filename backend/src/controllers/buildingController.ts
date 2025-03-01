import { City } from '@prisma/client';
import { Building } from '../models/building';
import prisma from '../prisma'
// Создание постройки в городе
async function createBuilding(newBuilding: Building) {
    return await prisma.building.create({
        data: { 
            newBuilding
        },
    });
}

// Получение всех построек в городе
async function getBuildings(cityId: Building['cityId']) {
    return await prisma.building.findMany({
        where: {
            cityId: Number(cityId),
        }
    });
}

module.exports = { createBuilding, getBuildings }
