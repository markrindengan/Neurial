import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, ContactShadows, RoundedBox, Sphere, Cylinder, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export function Robot3D({ isBouncing }: { isBouncing: boolean }) {
    const group = useRef<THREE.Group>(null);
    const headRef = useRef<THREE.Group>(null);
    const leftEyeRef = useRef<THREE.Group>(null);
    const rightEyeRef = useRef<THREE.Group>(null);

    // Warm friendly materials: Smooth pastel soft-touch plastic
    const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#f8fafc', // Warm off-white
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
        transmission: 0.15, // Subtle subsurface scattering feel
        thickness: 0.8,
    }), []);

    const jointMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#e2e8f0', // Soft pastel warm gray
        roughness: 0.5,
        metalness: 0.1,
    }), []);

    // Face panel: Soft dark pastel rather than harsh black
    const faceMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.3,
        clearcoatRoughness: 0.3,
    }), []);

    const eyeMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#34d399', // Bright mint/emerald
    }), []);

    const eyeHighlightMat = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#ffffff',
    }), []);

    // Glowing rounded orb core
    const coreMat = useMemo(() => new THREE.MeshPhysicalMaterial({
        color: '#a7f3d0',
        emissive: '#10b981',
        emissiveIntensity: 1.2,
        roughness: 0.2,
        transmission: 0.6,
        transparent: true,
        opacity: 0.85,
    }), []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Head smoothly tracks the mouse with playful bouncy interpolation
        if (headRef.current) {
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, (state.mouse.x * Math.PI) / 3, 0.12);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -(state.mouse.y * Math.PI) / 4, 0.12);
        }

        // Gentle core pulse
        coreMat.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.3;

        // Blinking logic for expressive eyes
        const blink = Math.sin(t * 4) > 0.95 ? 0.1 : 1;
        if (leftEyeRef.current && rightEyeRef.current) {
            leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, blink, 0.4);
            rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, blink, 0.4);

            // Subtle eye movement
            const eyeX = Math.sin(t * 1.5) * 0.04;
            leftEyeRef.current.position.x = -0.32 + eyeX;
            rightEyeRef.current.position.x = 0.32 + eyeX;
        }

        // Click bounce reaction (squishy and cute)
        if (group.current) {
            if (isBouncing) {
                group.current.position.y = -0.3 + Math.sin(t * 25) * 0.15;
                group.current.scale.setScalar(0.85 + Math.sin(t * 15) * 0.08);
            } else {
                group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, -0.3, 0.1);
                group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, 0.85, 0.1));
            }
        }
    });

    return (
        <group ref={group} dispose={null}>
            {/* Playful floating energy sparkles */}
            <Sparkles count={50} scale={6} size={2.5} speed={0.6} opacity={0.4} color="#6ee7b7" />
            <Sparkles count={30} scale={5} size={1.5} speed={0.8} opacity={0.3} color="#ffffff" />

            {/* High-key studio lighting */}
            <ambientLight intensity={1.5} color="#ffffff" />
            <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#f8fafc" />
            <pointLight position={[0, -2, 3]} intensity={1.4} color="#ccfbf1" distance={8} decay={2} /> {/* Soft mint under-bounce */}

            <Float speed={2.5} rotationIntensity={0.2} floatIntensity={0.6}>

                {/* Cute Over-sized Head */}
                <group ref={headRef} position={[0, 1.5, 0]}>
                    <RoundedBox args={[1.8, 1.4, 1.5]} radius={0.5} smoothness={4} material={bodyMat} />

                    {/* Soft Face Panel */}
                    <RoundedBox args={[1.3, 0.8, 0.2]} radius={0.3} smoothness={4} position={[0, 0.05, 0.7]} material={faceMat}>

                        {/* Expressive Glowing Eyes */}
                        <group ref={leftEyeRef} position={[-0.32, 0.05, 0.12]}>
                            <RoundedBox args={[0.25, 0.35, 0.05]} radius={0.12} material={eyeMat} />
                            {/* Sparkle highlight */}
                            <Sphere args={[0.05, 16, 16]} position={[0.06, 0.08, 0.03]} material={eyeHighlightMat} />
                        </group>

                        <group ref={rightEyeRef} position={[0.32, 0.05, 0.12]}>
                            <RoundedBox args={[0.25, 0.35, 0.05]} radius={0.12} material={eyeMat} />
                            {/* Sparkle highlight */}
                            <Sphere args={[0.05, 16, 16]} position={[0.06, 0.08, 0.03]} material={eyeHighlightMat} />
                        </group>
                    </RoundedBox>

                    {/* Cute little ear bumps */}
                    <Sphere args={[0.25, 32, 32]} position={[-0.9, 0, 0]} material={bodyMat} scale={[1, 1.5, 1]} />
                    <Sphere args={[0.25, 32, 32]} position={[0.9, 0, 0]} material={bodyMat} scale={[1, 1.5, 1]} />
                </group>

                {/* Soft Neck Assembly */}
                <group position={[0, 0.6, 0]}>
                    <Cylinder args={[0.25, 0.3, 0.4]} material={jointMat} />
                    <Cylinder args={[0.32, 0.32, 0.1]} position={[0, 0.1, 0]} material={bodyMat} />
                </group>

                {/* Rounded Adorable Body */}
                <group position={[0, -0.4, 0]}>
                    <RoundedBox args={[1.7, 1.6, 1.4]} radius={0.7} smoothness={4} material={bodyMat} />
                </group>

                {/* Glowing Rounded Orb Core */}
                <group position={[0, -0.1, 0.65]}>
                    <Sphere args={[0.4, 32, 32]} material={coreMat} scale={[1, 0.9, 0.6]} />
                    {/* Gentle core fill light */}
                    <pointLight intensity={1.5} color="#34d399" distance={4} decay={2} position={[0, 0, 0.2]} />
                </group>

                {/* Playful Floating Hands */}
                <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                    <group position={[-1.3, -0.6, 0.5]}>
                        <Sphere args={[0.28, 32, 32]} material={bodyMat} />
                        <Sphere args={[0.12, 16, 16]} position={[0, 0.3, 0]} material={jointMat} />
                    </group>
                </Float>

                <Float speed={4.5} rotationIntensity={0.6} floatIntensity={1.2}>
                    <group position={[1.3, -0.6, 0.5]}>
                        <Sphere args={[0.28, 32, 32]} material={bodyMat} />
                        <Sphere args={[0.12, 16, 16]} position={[0, 0.3, 0]} material={jointMat} />
                    </group>
                </Float>
            </Float>

            {/* Soft, friendly shadow */}
            <ContactShadows position={[0, -2.0, 0]} opacity={0.25} scale={9} blur={3.5} far={4} color="#94a3b8" />
        </group>
    );
}
