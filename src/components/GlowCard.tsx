import React, { useRef, useState, useCallback, ReactNode } from 'react';

interface GlowCardProps {
    children: ReactNode;
    className?: string;
    glowColor?: 'lavender' | 'mint' | 'blue' | 'yellow' | 'green' | 'purple' | 'red' | 'orange';
    customSize?: boolean;
    onMouseEnter?: () => void;
}

// Adapted glow hues to match Neurial pastel palette
const glowColorMap: Record<string, string> = {
    lavender: 'hsla(270, 80%, 70%, 0.35)',
    mint: 'hsla(155, 80%, 60%, 0.35)',
    blue: 'hsla(210, 80%, 70%, 0.35)',
    yellow: 'hsla(45, 90%, 65%, 0.35)',
    green: 'hsla(150, 70%, 55%, 0.35)',
    purple: 'hsla(280, 80%, 65%, 0.35)',
    red: 'hsla(0, 80%, 65%, 0.35)',
    orange: 'hsla(30, 90%, 65%, 0.35)',
};

const glowBorderMap: Record<string, string> = {
    lavender: 'hsla(270, 90%, 75%, 0.6)',
    mint: 'hsla(155, 90%, 65%, 0.6)',
    blue: 'hsla(210, 90%, 75%, 0.6)',
    yellow: 'hsla(45, 95%, 70%, 0.6)',
    green: 'hsla(150, 80%, 60%, 0.6)',
    purple: 'hsla(280, 90%, 70%, 0.6)',
    red: 'hsla(0, 90%, 70%, 0.6)',
    orange: 'hsla(30, 95%, 70%, 0.6)',
};

const GlowCard: React.FC<GlowCardProps> = ({
    children,
    className = '',
    glowColor = 'mint',
    customSize = false,
    onMouseEnter,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setIsHovered(true);
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setPosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        onMouseEnter?.();
    }, [onMouseEnter]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const spotlightColor = glowColorMap[glowColor] ?? glowColorMap.mint;
    const borderColor = glowBorderMap[glowColor] ?? glowBorderMap.mint;

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`
                relative overflow-hidden rounded-2xl
                transition-transform duration-300 ease-out
                ${className}
            `}
            style={{
                border: `1.5px solid ${isHovered ? borderColor : 'rgba(148, 163, 184, 0.12)'}`,
                transition: 'border-color 0.3s ease, transform 0.3s ease',
            }}
        >
            {/* Spotlight radial gradient that follows cursor */}
            <div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(350px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
                }}
            />

            {/* Glowing border highlight near cursor */}
            <div
                className="pointer-events-none absolute -inset-px z-0 rounded-2xl transition-opacity duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(200px circle at ${position.x}px ${position.y}px, ${borderColor}, transparent 70%)`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMaskComposite: 'xor',
                    padding: '1.5px',
                }}
            />

            {/* Card content */}
            <div className="relative z-10 h-full w-full">
                {children}
            </div>
        </div>
    );
};

export { GlowCard };
