import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from '@react-three/postprocessing'
import { Mesh } from 'three'
import { Stats } from '@react-three/drei'
import { usePaneInput, useTweakpane } from '../src'
import { Pane } from 'tweakpane'

function Box(props) {
  const ref = useRef<Mesh>()
  const [hovered, hover] = useState(false)
  useFrame(
    (state, delta) =>
      ref.current && (ref.current!.rotation.x = ref.current.rotation.y += delta)
  )

  return (
    <Select enabled={hovered}>
      <mesh
        ref={ref}
        {...props}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <boxGeometry />
        <meshStandardMaterial color={props.color} />
      </mesh>
    </Select>
  )
}

export function App() {
  const ref = useRef<Mesh>()
  const pane = useTweakpane(
    {
      state: '#ff00d6',
      eventBased: '#ff00d6',
    },
    {
      title: 'Cube',
    }
  )

  const [color] = usePaneInput(pane, 'state')
  usePaneInput(pane, 'eventBased', {}, (a) => {
    ref.current!.material.color.set(a.value)
  })

  return (
    <div className="app">
      <Canvas dpr={2}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
        />
        <pointLight position={[-10, -10, -10]} />
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
          <Box
            color={color}
            position={[-1, 0, 0]}
          />
          <Box
            ref={ref}
            position={[1, 0, 0]}
          />
          <mesh
            position-y={2}
            ref={ref}
          >
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </Selection>
        <Stats />
      </Canvas>
    </div>
  )
}
