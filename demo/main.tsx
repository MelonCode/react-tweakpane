import { OrbitControls, PerspectiveCamera, Sky, Stats } from '@react-three/drei'
import { Canvas, MeshProps, ThreeEvent } from '@react-three/fiber'
import {
  EffectComposer,
  Outline,
  Select,
  Selection,
} from '@react-three/postprocessing'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Color, Mesh, MeshStandardMaterial, Vector3 } from 'three'
import {
  usePaneFolder,
  usePaneInput,
  useSliderBlade,
  useTweakpane,
} from '../src'
import './index.css'

export function App() {
  const pane = useTweakpane({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    color: '#ffffff',
  })

  const meshRef = useRef<Mesh>(null!)

  const [enabled, setEnabled] = useState<boolean>(false)

  const folder = usePaneFolder(pane, {
    title: 'Selected Object',
    disabled: !enabled,
  })

  const [time] = useSliderBlade(pane, {
    label: 'Sky',
    index: 0,
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

  const [, setPosition] = usePaneInput(folder, 'position', (event) => {
    const { x, y, z } = event.value
    const mesh = meshRef.current!
    mesh.position.set(x, y, z)
  })

  const [, setRotation] = usePaneInput(
    folder,
    'rotation',
    {
      x: {
        min: -180,
        max: 180,
      },
      y: {
        min: -180,
        max: 180,
      },
      z: {
        min: -180,
        max: 180,
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

  const [, setScale] = usePaneInput(folder, 'scale', (event) => {
    const { x, y, z } = event.value
    const mesh = meshRef.current!
    mesh.scale.set(x, y, z)
  })

  const [, setColor] = usePaneInput(folder, 'color', (event) => {
    const mesh = meshRef.current!
    const material = mesh.material as MeshStandardMaterial

    material.color.set(new Color(event.value))
  })

  const select = useCallback((event: ThreeEvent<MouseEvent>) => {
    const mesh = event.object as Mesh
    const material = mesh.material as MeshStandardMaterial
    meshRef.current = mesh

    const { x, y, z } = mesh.position
    const { x: rx, y: ry, z: rz } = mesh.rotation
    const { x: sx, y: sy, z: sz } = mesh.scale

    setPosition({ x, y, z })
    setRotation({ x: rx, y: ry, z: rz })
    setScale({ x: sx, y: sy, z: sz })
    setColor('#' + material.color.getHexString())
    setEnabled(true)
  }, [])

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
        <Selection>
          <EffectComposer
            multisampling={1}
            autoClear={false}
          >
            <Outline
              blur
              visibleEdgeColor={0xffffff}
              edgeStrength={100}
            />
          </EffectComposer>
          <Selection>
            <EffectComposer
              multisampling={12}
              autoClear={false}
            >
              <Outline
                blur
                visibleEdgeColor={0xffffff}
                edgeStrength={100}
                width={1200}
              />
            </EffectComposer>
            <Box
              onClick={select}
              position={[-1, 0, 0]}
            />
            <Box
              onClick={select}
              position={[1, 0, 0]}
            />
          </Selection>
        </Selection>
        <Stats />
      </Canvas>
      {!enabled && (
        <div className="tooltip">
          <h1> Click on a box to select it </h1>
        </div>
      )}
    </div>
  )
}

function Box(props: MeshProps) {
  const [hovered, hover] = useState<boolean>(false)

  return (
    <Select enabled={hovered}>
      <mesh
        {...props}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Select>
  )
}
