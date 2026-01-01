"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, Html } from '@react-three/drei';
import { useRef, useEffect, Suspense, Component, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

function Model({ color }: { color: string }) {
    const { scene } = useGLTF('/devpath3d.glb');
    const modelRef = useRef<THREE.Group>(null);

    // Mouse tracking for rotation
    const mouse = useRef({ x: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Normalize x to -1 to 1
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state, delta) => {
        if (modelRef.current) {
            // Target rotation based on mouse x (range: -60 to +60 degrees approx)
            const targetRotation = mouse.current.x * (Math.PI / 3);

            // Smooth interpolation
            modelRef.current.rotation.y += (targetRotation - modelRef.current.rotation.y) * delta * 5;
        }
    });

    useEffect(() => {
        // First pass: find the largest mesh (background circle)
        let maxVolume = 0;
        let largestMeshId = '';

        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();

                // Smooth the geometry
                mesh.geometry.computeVertexNormals();

                const box = mesh.geometry.boundingBox!;
                const size = new THREE.Vector3();
                box.getSize(size);
                // Use diagonal length as a proxy for size to handle flat objects better
                const diagonal = size.length();

                if (diagonal > maxVolume) {
                    maxVolume = diagonal;
                    largestMeshId = mesh.uuid;
                }
            }
        });

        // Second pass: apply materials
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const isBackground = mesh.uuid === largestMeshId;

                // Background: Dark Blue Front (#0B1120), Gold Side (#FFB800)
                // D/Content: White Front (#FFFFFF), White Side (#FFFFFF)
                const frontColor = isBackground ? '#0B1120' : '#FFFFFF';
                const sideColor = isBackground ? color : '#FFFFFF';

                // Clone material to avoid affecting other instances if any
                const material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(sideColor),
                    roughness: 0.2,
                    metalness: 1.0,
                    emissive: new THREE.Color(sideColor),
                    emissiveIntensity: 0.2,
                    transparent: true,
                    opacity: 0.9
                });

                material.onBeforeCompile = (shader) => {
                    shader.uniforms.colorFront = { value: new THREE.Color(frontColor) };
                    shader.uniforms.colorSide = { value: new THREE.Color(sideColor) };

                    shader.vertexShader = `
                        varying vec3 vObjectNormal;
                        ${shader.vertexShader}
                    `.replace(
                        '#include <begin_vertex>',
                        `
                        #include <begin_vertex>
                        vObjectNormal = normal;
                        `
                    );

                    shader.fragmentShader = `
                        uniform vec3 colorFront;
                        uniform vec3 colorSide;
                        varying vec3 vObjectNormal;
                        ${shader.fragmentShader}
                    `.replace(
                        '#include <color_fragment>',
                        `
                        #include <color_fragment>
                        float isFront = step(0.8, abs(vObjectNormal.z));
                        diffuseColor.rgb = mix(colorSide, colorFront, isFront);
                        `
                    );
                };

                mesh.material = material;
            }
        });
    }, [scene, color]);

    return (
        <group ref={modelRef} position={[0, 1.2, 0]}>
            {/* Uniform scale to avoid distortion */}
            <primitive object={scene} scale={0.012} />
        </group>
    );
}




class ModelErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: { children: ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    handleRetry = () => {
        useGLTF.clear('/devpath3d.glb');
        this.setState({ hasError: false });
    };

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}

export default function HeaderScene() {
    const { theme, systemTheme } = useTheme();
    const currentTheme = theme === 'system' ? systemTheme : theme;

    // Gold/Orange color from the logo
    const brandColor = '#FFB800';

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 5, 5]} intensity={1.5} />
                    <ModelErrorBoundary>
                        <Model color={brandColor} />
                    </ModelErrorBoundary>
                    {/* <TestBox /> */}
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}

useGLTF.preload('/devpath3d.glb');
