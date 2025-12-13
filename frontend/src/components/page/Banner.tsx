export default function Banner() {
    return (
        <svg viewBox="0 0 600 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <rect width="600" height="150" fill="#0d1318"/>
            
            {/* Left minimal tribal sigil */}
            <g transform="translate(70, 75)" stroke="#47ebb4" strokeWidth="1" fill="none" opacity="0.3">
                <circle r="35"/>
                <path d="M 0 -35 L 0 -42 M 35 0 L 42 0 M 0 35 L 0 42 M -35 0 L -42 0"/>
                <circle r="22"/>
                <path d="M -15 0 L 15 0 M 0 -15 L 0 15"/>
                <path d="M -10 -10 L 10 10 M -10 10 L 10 -10"/>
            </g>
            
            {/* Right minimal tribal sigil */}
            <g transform="translate(530, 75)" stroke="#47ebb4" strokeWidth="1" fill="none" opacity="0.3">
                <circle r="35"/>
                <path d="M 0 -35 L 0 -42 M 35 0 L 42 0 M 0 35 L 0 42 M -35 0 L -42 0"/>
                <circle r="22"/>
                <path d="M -15 0 L 15 0 M 0 -15 L 0 15"/>
                <path d="M -10 -10 L 10 10 M -10 10 L 10 -10"/>
            </g>
            
            {/* Central sigil - clean and sharp */}
            <g transform="translate(300, 75)" stroke="#47ebb4" strokeWidth="0.8" fill="none" opacity="0.25">
                <path d="M 0,-40 L 34.64,-20 L 34.64,20 L 0,40 L -34.64,20 L -34.64,-20 Z"/>
                <circle r="28"/>
                <path d="M 0,-20 L 17.32,-10 L 17.32,10 L 0,20 L -17.32,10 L -17.32,-10 Z"/>
                <path d="M -18 0 L 18 0 M 0 -18 L 0 18"/>
                <circle r="5"/>
            </g>
            
            {/* Minimal connecting lines */}
            <path d="M 110 75 L 265 75" stroke="#4a5f78" strokeWidth="0.5" opacity="0.3"/>
            <path d="M 335 75 L 490 75" stroke="#4a5f78" strokeWidth="0.5" opacity="0.3"/>
            
            {/* Title */}
            <text x="300" y="62" fontFamily="'Courier New', monospace" fontSize="24" fontWeight="bold" fill="#ebf4ff" textAnchor="middle" letterSpacing="6">
                STEALTH DEBUG
            </text>
            
            {/* Clean separator line */}
            <line x1="210" y1="75" x2="390" y2="75" stroke="#4a5f78" strokeWidth="0.3" opacity="0.3"/>
            
            {/* Subtitle */}
            <text x="300" y="93" fontFamily="'Courier New', monospace" fontSize="8" fill="#57718e" textAnchor="middle" opacity="0.7" letterSpacing="3">
                REVERSE • CRACK • DISASM
            </text>
            
            {/* Bottom tribal marks */}
            <g stroke="#47ebb4" strokeWidth="0.8" fill="none" opacity="0.2">
                <circle cx="40" cy="125" r="5"/>
                <path d="M 40 115 L 40 135 M 30 125 L 50 125"/>
                <circle cx="560" cy="125" r="5"/>
                <path d="M 560 115 L 560 135 M 550 125 L 570 125"/>
            </g>
            
            {/* Hex markers */}
            <text x="25" y="140" fontFamily="monospace" fontSize="7" fill="#57718e" opacity="0.5">
                0x00
            </text>
            <text x="575" y="140" fontFamily="monospace" fontSize="7" fill="#57718e" opacity="0.5" textAnchor="end">
                0xFF
            </text>
            
            {/* Top corner marks */}
            <path d="M 20 20 L 30 20 L 30 30" stroke="#4a5f78" strokeWidth="0.5" opacity="0.2"/>
            <path d="M 580 20 L 570 20 L 570 30" stroke="#4a5f78" strokeWidth="0.5" opacity="0.2"/>
            
            {/* Bottom corner marks */}
            <path d="M 20 130 L 30 130 L 30 120" stroke="#4a5f78" strokeWidth="0.5" opacity="0.2"/>
            <path d="M 580 130 L 570 130 L 570 120" stroke="#4a5f78" strokeWidth="0.5" opacity="0.2"/>
        </svg>
    );
}