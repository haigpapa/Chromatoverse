import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Color mapping for different roles
const ROLE_COLORS = {
  'UI Component': '#667eea',
  'Styling': '#f093fb',
  'API Service': '#4facfe',
  'Utility': '#43e97b',
  'State Management': '#fa709a',
  'Routing': '#feca57',
  'Configuration': '#ee5a6f',
  'Testing': '#c471ed',
  'Documentation': '#48dbfb',
  'Other': '#a29bfe'
}

function Node({ node, position, onClick }) {
  const meshRef = useRef()
  const color = ROLE_COLORS[node.role] || ROLE_COLORS['Other']

  // Size based on dependencies (but with min/max bounds)
  const size = Math.max(0.3, Math.min(1.5, node.size * 0.15))

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick(node)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        roughness={0.5}
        metalness={0.5}
      />
    </mesh>
  )
}

function ConnectionLine({ start, end }) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end])

  return (
    <Line
      points={points}
      color="#ffffff"
      lineWidth={0.5}
      opacity={0.2}
      transparent
    />
  )
}

function Constellation({ nodes, links, onNodeClick }) {
  // Create a simple force-directed layout
  const nodePositions = useMemo(() => {
    const positions = new Map()

    // Simple circular layout for Phase 0
    const radius = Math.max(5, nodes.length * 0.5)
    const angleStep = (2 * Math.PI) / nodes.length

    nodes.forEach((node, index) => {
      const angle = index * angleStep
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = (Math.random() - 0.5) * 3 // Add some depth variation

      positions.set(node.id, [x, y, z])
    })

    return positions
  }, [nodes])

  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Render connections */}
      {links.map((link, index) => {
        const startPos = nodePositions.get(link.source)
        const endPos = nodePositions.get(link.target)

        if (startPos && endPos) {
          return (
            <ConnectionLine
              key={`link-${index}`}
              start={startPos}
              end={endPos}
            />
          )
        }
        return null
      })}

      {/* Render nodes */}
      {nodes.map((node) => {
        const position = nodePositions.get(node.id)
        if (position) {
          return (
            <Node
              key={node.id}
              node={node}
              position={position}
              onClick={onNodeClick}
            />
          )
        }
        return null
      })}

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
      />
    </Canvas>
  )
}

export default Constellation
