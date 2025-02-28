const prisma = require('../prisma');

// Создание города
async function createCity(name, size) {
    return await prisma.city.create({
        data: { name, size },
    });
}

// Получение всех городов
async function getCity(id) {
    return await prisma.city.findUnique({
        where: {
            id: Number(id),
        }
    });
}

module.exports = { createCity, getCity }
