import { useState } from "react";
import "./MilkshakeRoulette.css";

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

export default function MilkshakeRoulette() {
    const [rotation, setRotation] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [spinning, setSpinning] = useState(false);

    const spin = () => {
        if (spinning) return;

        setSpinning(true);

        const randomIndex = Math.floor(Math.random() * milkshakes.length);
        const degreesPerItem = 360 / milkshakes.length;

        const extraSpins = 5 * 360; // vueltas completas
        const finalRotation =
            extraSpins + (360 - randomIndex * degreesPerItem);

        setRotation((prev) => prev + finalRotation);

        setTimeout(() => {
            setSelected(milkshakes[randomIndex]);
            setSpinning(false);
        }, 4000);
    };

    return (
        <div className="roulette-container">
            <div
                className="roulette"
                style={{
                    transform: `rotate(${rotation}deg)`,
                }}
            >
                {milkshakes.map((shake, index) => {
                    const angle = (360 / milkshakes.length) * index;
                    return (
                        <div
                            key={index}
                            className="slice"
                            style={{
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            <span>{shake}</span>
                        </div>
                    );
                })}
            </div>

            <div className="pointer">▼</div>

            <button onClick={spin} disabled={spinning}>
                {spinning ? "Girando..." : "Girar"}
            </button>

            {selected && (
                <h2 className="result">🥤 {selected}</h2>
            )}
        </div>
    );
}