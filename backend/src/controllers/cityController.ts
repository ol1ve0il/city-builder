import { City } from '../models/city';
import prisma from '../prisma'
// Создание города
async function createCity(newCity: City) {
    return await prisma.city.create({
        data: newCity,
    });
}

async function getAllCities() {
    return await prisma.city.findMany();
}

// Получение всех городов
async function getCity(id: City['id']) {
    return await prisma.city.findUnique({
        where: {
            id: Number(id),
        }
    });
}

module.exports = { createCity, getAllCities, getCity }
