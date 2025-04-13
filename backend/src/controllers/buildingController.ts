import { Building } from '../models/building';
import prisma from '../prisma'
// Создание постройки в городе
async function createBuilding(newBuilding: Building) {
    return await prisma.building.create({
        data: newBuilding
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

async function removeBuilding(id: Building['id']) {
    return await prisma.building.delete({
        where: {
            id: Number(id),
        }
    })
}

async function updateBuilding(id: Building['id'], newData: Building) {
    return await prisma.building.update({
        where: {
            id: Number(id),
        },
        data: newData,
    })
}

module.exports = { createBuilding, updateBuilding, removeBuilding, getBuildings }
