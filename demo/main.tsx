import { OrbitControls, PerspectiveCamera, Sky, Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useRef, useState } from 'react'
import { Color, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import {
  useListBlade,
  usePaneFolder,
  usePaneInput,
  useSliderBlade,
  useButtonBlade,
  useTextBlade,
  useTweakpane,
} from '../src'
import './index.css'

export function App() {
  const meshRef = useRef<Mesh>(null!)
  const [fruitCount, setFruitCount] = useState(0)

  const pane = useTweakpane(
    {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      color: '#ffa500',
      bool: false,
    },
    {
      title: 'Scene Settings',
    }
  )

  const [time] = useSliderBlade(pane, {
    label: 'Sky',
    value: 0.6,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })

  const [ambientLight] = useSliderBlade(pane, {
    label: 'Ambient Light Intensity',
    index: 0,
    value: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    format: (value) => value.toFixed(2),
  })

  const [title] = useTextBlade(pane, {
    label: 'Title',
    value: 'Hello World',
    parse: (value) => value,
    format: (value) => value,
  })

  const [fruit] = useListBlade(pane, {
    label: 'Fruit',
    options: [
      {
        text: 'Apple 🍎',
        value: '🍎',
      },
      {
        text: 'Orange 🍊',
        value: '🍊',
      },
      {
        text: 'Banana 🍌',
        value: '🍌',
      },
    ],
    value: 'box',
    view: 'list',
  })

  useButtonBlade(pane, {
    title: 'Add Fruit',
    label: 'Counter'
  }, () => {
    setFruitCount(prev => prev + 1)
  })

  const [outBool] = usePaneInput(
    pane,
    'bool',
    {
      label: 'Boolean',
      value: false
    }
  )
  
  const folder = usePaneFolder(pane, {
    title: 'Box Settings',
  })

  usePaneInput(
    folder,
    'position',
    {
      label: 'Pos',
      x: {
        min: -6,
        max: 6,
      },
      y: {
        min: -6,
        max: 6,
      },
      z: {
        min: -6,
        max: 6,
      },
    },
    (event) => {
      const { x, y, z } = event.value
      const mesh = meshRef.current!
      mesh.position.set(x, y, z)
    }
  )

  usePaneInput(
    folder,
    'rotation',
    {
      label: 'Rotation',
      x: {
        min: -180,
        max: 180,
        step: 18,
      },
      y: {
        min: -180,
        max: 180,
        step: 18,
      },
      z: {
        min: -180,
        max: 180,
        step: 18,
      },
    },
    (event) => {
      const { x, y, z } = event.value
      const mesh = meshRef.current!
      mesh.rotation.setFromVector3(
        new Vector3(x, y, z).multiplyScalar(Math.PI / 180)
      )
    }
  )

  usePaneInput(folder, 'scale', { label: 'Scale' }, (event) => {
    const { x, y, z } = event.value
    const mesh = meshRef.current!
    mesh.scale.set(x, y, z)
  })

  usePaneInput(folder, 'color', { label: 'Color' }, (event) => {
    const mesh = meshRef.current!
    const material = mesh.material as MeshStandardMaterial

    material.color.set(new Color(event.value))
  })

  return (
    <div className="app">
      <Canvas dpr={2}>
        <OrbitControls makeDefault />
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 4]}
        />
        <Sky
          azimuth={1}
          inclination={time}
          distance={1000}
        />
        <ambientLight intensity={ambientLight} />

        <pointLight position={[2, 2, 2]} />

        <mesh ref={meshRef}>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Stats />
      </Canvas>
      <div className="tooltip">
        <h1>
          {title} {fruit} {fruitCount} {outBool ? '✓' : '✗'}
        </h1>
      </div>
    </div>
  )
}
