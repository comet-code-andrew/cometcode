import {Environment, useIntersect, Html, useGLTF, PresentationControls, useScroll, GizmoHelper} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import React, {useMemo, useRef} from 'react'
import * as THREE from 'three'

import {useControls} from "leva";
import {Galaxy} from "./galaxy";
import {SiteName} from "./SiteName";
import {Tablet} from "./Tablet";
import {Planet} from "./Planet";


function Objects() {
  const {height, width} = useThree((state) => state.viewport)

  const tablet = useGLTF('./tablet.glb')
  const {gl} = useThree();


  const parameter_options = useMemo(() => {
    return {
      x: {value: 0, min: -10, max: 10, step: .1},
      y: {value: .01, min: -10, max: 10, step: .001},
      z: {value: -0.02, min: -10, max: 10, step: .1},
      distance: {value: .2, min: -10, max: 10, step: .1},
    }
  }, [])
  const parameters = useControls('Tablet controls', parameter_options)

  const scrollData = useScroll();

  return (
    <>
      <GizmoHelper>
        <pointLight color="blue" position={[8, -25, 5]} intensity={20}/>
      </GizmoHelper>

      <GizmoHelper>
        <pointLight color="red" position={[0, -height * 2.25, 5]} intensity={10}/>
      </GizmoHelper>
      {/*<ambientLight color="white" intensity={5}/>*/}
      <Environment preset="city"/>


      {/*<Item color="blue" position={[width / 2, -height * 1, 0]}>*/}
      {/*  <dodecahedronGeometry/>*/}
      {/*</Item>*/}
      {/*<Item color="gray" position={[-width / 5, -height * 1.8, -2]}>*/}
      {/*  <coneGeometry args={[1, 1, 6]}/>*/}
      {/*</Item>*/}
      {/*<Item color="purple" position={[width / 4, -height * 2, 0]}>*/}
      {/*  <coneGeometry args={[1.5, 2, 3]}/>*/}
      {/*</Item>*/}
      {/*<Item color="orange" position={[-width / 12, -height * 2.25, 0.5]}>*/}
      {/*  <coneGeometry args={[0.75, 2.5, 12]}/>*/}
      {/*</Item>*/}

      <Galaxy/>
      <SiteName/>

      <PresentationControls>
        <primitive scale={4} object={tablet.scene} position={[0, -height * 1, 3]} rotation-x={90 * (Math.PI / 180)}>
          >
          <Html
            transform
            wrapperClass="htmlScreen"
            distanceFactor={parameters.distance}
            portal={{current: gl.domElement.parentNode}}
            rotation-x={270 * (Math.PI / 180)}
            position={[parameters.x, parameters.y, parameters.z]}
            occlude={"blending"}
          >
            <iframe src="https://bruno-simon.com/html/"/>
          </Html>
        </primitive>
      </PresentationControls>

      <Planet position={[0.0, -height * 2.25, 0]}/>

    </>
  )
}

function Item({color, position, children}) {
  const visible = useRef()
  const ref = useIntersect((isVisible) => (visible.current = isVisible))
  const [xRandomFactor, yRandomFactor] = useMemo(() => [(0.5 - Math.random()) * 0.5, (0.5 - Math.random()) * 0.5], [])

  useFrame(({clock}, delta) => {
    const elapsedTime = clock.getElapsedTime()

    ref.current.rotation.x = elapsedTime * xRandomFactor
    ref.current.rotation.y = elapsedTime * yRandomFactor

    const scale = THREE.MathUtils.damp(ref.current.scale.x, visible.current ? 1.5 : 0.2, 5, delta)
    ref.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={ref} position={position}>
      {children}
      <meshPhysicalMaterial transparent color={color}/>
    </mesh>
  )
}

export {Objects}