import { Request, Response } from "express";

class MiscController {
    static async chooseMilkshake(req: Request, res: Response) {
        const milkshakes = [
            "Happy Hippo",
            "Platano",
            "Chocolate",
            "Chocolate Blanco",
            "Chocolate Blanco con Galleta",
            "Chocolate Blanco con Avellana",
            "Chocolate Blanco con Filipinos",
            "Chocolate con Cookies",
            "Galleta Maria",
            "Galleta con Avellanas",
            "Ferrero Rocher",
            "Huevo Kinder",
            "Oreo",
            "Oreo con Chocolate Blanco",
            "Kit Kat",
            "Brownie",
            "Donuts",
            "Donuts de Chocolate Blanco",
            "Donuts Bombon",
            "Yogurt con Frutas del Bosque",
            "Yogurt con Mango",
            "Stracciatella",
            "Menta y Chocolate",
            "Leche Merengada",
            "Dulce de Leche",
            "Avellana",
            "Coco",
            "Mora",
            "Vainilla",
        ];

        const randomIndex = Math.floor(Math.random() * milkshakes.length);
        const randomMilkshake = milkshakes[randomIndex];

        return res.send(randomMilkshake);
    }
}

export default MiscController;