"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function FloatingBlob({ position, color, speed = 1 }: { 
  position: [number, number, number], 
  color: string, 
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.3
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.5
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 32, 32]}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <MeshDistortMaterial
        color={color}
        speed={2}
        distort={0.4}
        radius={1}
        transparent
        opacity={0.6}
      />
    </Sphere>
  )
}

function AnimatedParticles() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <FloatingBlob position={[-3, 2, -5]} color="#ec4899" speed={0.8} />
      <FloatingBlob position={[3, -1, -3]} color="#a855f7" speed={1.2} />
      <FloatingBlob position={[0, 3, -7]} color="#f472b6" speed={0.6} />
      <FloatingBlob position={[-2, -2, -4]} color="#c084fc" speed={1.0} />
      <FloatingBlob position={[4, 1, -6]} color="#f9a8d4" speed={0.9} />
    </group>
  )
}

interface Animated3DBackgroundProps {
  className?: string
  intensity?: number
}

export function Animated3DBackground({ 
  className = "", 
  intensity = 0.3 
}: Animated3DBackgroundProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={intensity} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <AnimatedParticles />
      </Canvas>
    </div>
  )
} 