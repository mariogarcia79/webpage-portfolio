import { useState } from "react";
import { Wheel } from "react-custom-roulette";

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

// Formato que pide la librería
const data = milkshakes.map((shake) => ({
    option: shake,
}));

export default function MilkshakeRoulette() {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);

    const spin = () => {
        if (mustSpin) return;

        const newPrize = Math.floor(Math.random() * data.length);

        setPrizeNumber(newPrize);
        setMustSpin(true);
    };

    return (
        <div className="roulette-container">
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                onStopSpinning={() => {
                    setMustSpin(false);
                    setSelected(data[prizeNumber].option);
                }}
                backgroundColors={["#ff9f1c", "#2ec4b6"]}
                textColors={["#ffffff"]}
            />

            <button onClick={spin} disabled={mustSpin}>
                {mustSpin ? "Girando..." : "Girar"}
            </button>

            {selected && (
                <h2 className="result">🥤 {selected}</h2>
            )}
        </div>
    );
}