const prisma = require('../prisma');

// Создание постройки в городе
async function createBuilding(cityId, name, x, y) {
    return await prisma.building.create({
        data: { 
            cityId: Number(cityId), 
            name, 
            x: Number(x), 
            y: Number(y),
        },
    });
}

// Получение всех построек в городе
async function getBuildings(cityId) {
    return await prisma.building.findMany({
        where: {
            cityId: Number(cityId),
        }
    });
}

module.exports = { createBuilding, getBuildings }
