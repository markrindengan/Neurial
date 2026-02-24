import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const robotMessages = [
    "Golazo! ⚽",
    "Vamos! 🇦🇷",
    "World Champion! 🏆",
    "Top corner! 🎯",
    "Magic touch! ✨",
    "Dribbble king! 👑",
    "Another one! 🔟",
    "The GOAT! 🐐"
];

function playGoalSound() {
    try {
        const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const now = ctx.currentTime;

        // Whistle sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(1500, now);
        osc.frequency.linearRampToValueAtTime(1600, now + 0.1);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.3);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
        setTimeout(() => ctx.close(), 400);
    } catch {
        // ignore
    }
}

export function Mascot2DInteractive({ isBouncing, onClick }: { isBouncing: boolean, onClick: () => void }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentImage, setCurrentImage] = useState("/Front View.png");

    // Track mouse to change the image simulating 3D rotation
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const xPos = (e.clientX - left) / width - 0.5; // -0.5 to 0.5
        const yPos = (e.clientY - top) / height - 0.5; // -0.5 to 0.5

        if (xPos < -0.2) {
            setCurrentImage("/Left View.png");
        } else if (xPos > 0.2) {
            setCurrentImage("/Right View.png");
        } else if (yPos < -0.2) {
            setCurrentImage("/Top View.png");
        } else if (yPos > 0.2) {
            setCurrentImage("/Bottom View.png");
        } else {
            setCurrentImage("/Front View.png");
        }
    }, []);

    const handleMouseLeave = () => {
        setCurrentImage("/Front View.png"); // Reset on leave
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative flex items-center justify-center p-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <img
                src={currentImage}
                alt="Messi Mascot"
                className={`w-full h-full object-contain transition-all duration-75 drop-shadow-2xl ${isBouncing ? "animate-bounce" : "animate-float"}`}
            />
        </div>
    );
}
