"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation, useMotionValue, useSpring } from "framer-motion";
import { Magnet } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface MagnetizeButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    particleCount?: number;
    attractRadius?: number;
    idleLabel?: string;
    activeLabel?: string;
    hideIcon?: boolean;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    duration: number;
}

function MagnetizeButton({
    className,
    particleCount = 12,
    attractRadius = 50,
    idleLabel = "Hover me",
    activeLabel = "Attracting",
    hideIcon = false,
    children,
    onClick,
    ...restProps
}: MagnetizeButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const particlesControl = useAnimation();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Smooth hardware-accelerated motion values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    useEffect(() => {
        const newParticles = Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            x: Math.random() * 360 - 180,
            y: Math.random() * 360 - 180,
            offsetX: Math.random() * 60 - 30,
            offsetY: Math.random() * 60 - 30,
            duration: Math.random() * 4 + 3,
        }));
        setParticles(newParticles);
    }, [particleCount]);

    useEffect(() => {
        if (!particles.length) return;

        if (isHovered) {
            particlesControl.start({
                x: 0,
                y: 0,
                transition: {
                    type: "spring",
                    stiffness: 50,
                    damping: 10,
                },
            });
        } else {
            particlesControl.start((i) => {
                const p = particles[i];
                if (!p) return {};
                return {
                    x: [p.x, p.x + p.offsetX, p.x],
                    y: [p.y, p.y + p.offsetY, p.y],
                    transition: {
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                };
            });
        }
    }, [isHovered, particles, particlesControl]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = wrapperRef.current.getBoundingClientRect();

        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);

        // Directly set the motion values to follow the cursor (scaled by a fraction for smoothness)
        x.set(middleX * 0.2);
        y.set(middleY * 0.2);
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const buttonContent = children ? (
        children
    ) : (
        <span className="relative w-full flex items-center justify-center gap-2 pointer-events-none select-none">
            {!hideIcon && (
                <Magnet
                    className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isHovered && "scale-110"
                    )}
                />
            )}
            {isHovered ? activeLabel : idleLabel}
        </span>
    );

    return (
        <div
            ref={wrapperRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative inline-flex items-center justify-center p-8 -m-8" // This padded outer div is the STATIC magnetic field interceptor
        >
            {/* Particles layer */}
            {particles.map((particle, index) => (
                <motion.div
                    key={index}
                    custom={index}
                    initial={{ x: particle.x, y: particle.y }}
                    animate={particlesControl}
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        pointerEvents: "none",
                    }}
                    className={cn(
                        "w-1.5 h-1.5 rounded-full absolute -translate-x-1/2 -translate-y-1/2",
                        "bg-emerald-400 dark:bg-emerald-300",
                        "transition-opacity duration-300",
                        isHovered ? "opacity-100" : "opacity-40"
                    )}
                />
            ))}

            <motion.div
                style={{ x: springX, y: springY }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
            >
                <Button
                    {...restProps}
                    onClick={onClick}
                    className={cn(
                        "min-w-40 relative cursor-pointer select-none",
                        "bg-emerald-50 dark:bg-emerald-900/40",
                        "hover:bg-emerald-100 dark:hover:bg-emerald-800/50",
                        "text-emerald-700 dark:text-emerald-300",
                        "border border-emerald-300/60 dark:border-emerald-600/40",
                        "shadow-sm hover:shadow-md hover:shadow-emerald-200/30",
                        "transition-colors duration-300",
                        className
                    )}
                >
                    {buttonContent}
                </Button>
            </motion.div>
        </div>
    );
}

export { MagnetizeButton };
