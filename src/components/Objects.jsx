import {
  Environment,
  useIntersect,
  Html,
  useGLTF,
  PresentationControls,
} from '@react-three/drei'
import {useFrame, useLoader, useThree} from '@react-three/fiber'
import React, {useMemo, useRef, Suspense, useEffect} from 'react'
import { EffectComposer, Bloom } from '@react-three/postprocessing'


import {useControls} from "leva";
import {Galaxy} from "./galaxy";
import {SiteName} from "./SiteName";
import {SpaceStation} from "./SpaceStation";
import {Mars} from "./Mars";
import {SunLight} from "./SunLight";
import {Portal} from "./Portal";
import {Cockpit} from "./Cockpit";
import {SpaceHighway} from "./SpaceHighway"
import * as THREE from "three";

// function RotatingEnvironment() {
//   console.log("RotatingEnvironment is being instantiated!");  // Add this
//
//   const rotationRef = useRef([0, 0, 0])
//
//   useFrame((state, delta) => {
//     rotationRef.current[1] += delta * 5
//     console.log("Current rotation: ", rotationRef.current[1]);  // And this! Very helpful.
//   })
//
//   return (
//     <Environment
//       background={true}
//       preset="sunset"
//       environmentRotation={rotationRef.current}
//       backgroundRotation={rotationRef.current}
//     />
//   )
// }

// function RotatingEnvironment() {
//   const { scene } = useThree()
//   const rotationRef = useRef(new THREE.Euler(0, 0, 0))
//
//   useFrame((state, delta) => {
//     // Rotate around Z-axis
//     rotationRef.current.z += delta * 0.1 // Adjust speed as needed
//     scene.background.rotation.copy(rotationRef.current)
//   })
//
//   return (
//     <Environment
//       background={true}
//       files={"./omega.hdr"}
//       rotation={rotationRef.current}
//     />
//   )
// }

// useFrame((state, delta) => {
//   if (scene.backgroundRotation) {
//     scene.backgroundRotation.z += delta * 0.05
//     scene.environmentRotation.z += delta * 0.05
//   }
// })

const degToRad = (degrees) => degrees * (Math.PI / 180)

function RotatingEnvironment() {
  const scene = useThree((state) => state.scene)
  const LOOK_RIGHT = 90  // 45 degrees to the right (adjust as needed)
  const LOOK_UP = 35     // 15 degrees up (adjust as needed)

  useEffect(() => {
    if (scene.backgroundRotation && scene.environmentRotation) {
      scene.backgroundRotation.set(
        degToRad(-LOOK_UP),   // Negative because looking up is rotating down
        degToRad(LOOK_RIGHT),  // Negative because we're rotating the environment, not the camera
        0
      )
      scene.environmentRotation.set(
        degToRad(-LOOK_UP),
        degToRad(LOOK_RIGHT),
        0
      )
    }
  }, [scene])

  useFrame((state, delta) => {
    if (scene.backgroundRotation) {
      scene.backgroundRotation.z += delta * 0.03
      scene.environmentRotation.z += delta * 0.3
    }
  })

  return (
    <Environment
      files={"./omega.hdr"}
      background={true}
    />
  )
}

export default RotatingEnvironment

// function RotatingEnvironment() {
//   const rotation = useRef([0, 0, 0])
//
//   useFrame((state, delta) => {
//     rotation.current[2] += delta * 0.5   // z-axis rotation
//   })
//
//   return (
//     <Environment
//       files={"./omega.hdr"}
//       background={true}   // Very important!
//       backgroundRotation={rotation.current}  // The secret sauce
//     />
//   )
// }


function Objects() {
  const {height, width} = useThree((state) => state.viewport)
  const {gl} = useThree();
  const tablet = useGLTF('./the_tablet.glb')

  const parameter_options = useMemo(() => {
    return {
      x: {value: 0, min: -10, max: 10, step: .1},
      y: {value: -7.7, min: -10, max: 10, step: .001},
      z: {value: 1.125, min: -10, max: 10, step: .1},
      distance: {value: 2.4, min: -10, max: 10, step: .1},
    }
  }, [])
  const parameters = useControls('Tablet controls', parameter_options)


  return (
    <>
      {/*<RotatingEnvironment/>*/}

      {/*<ambientLight color="white" intensity={.5}/>*/}
      {/*<RotatingEnvironment/>*/}
      {/*<Environment background={"only"} files={"./omega.hdr"}*/}
      {/*             environmentRotation={[10, Math.PI / 10, 10]}*/}
      {/*             backgroundRotation={[10, Math.PI / 10, 10]}*/}
      {/*/>*/}
      {/*</RotatingEnvironment>*/}
      {/*<Environment background={"only"} files={"./omega.hdr"}/>*/}
      {/*<SunLight/>*/}


      {/*<PresentationControls>*/}
      {/*  <Html*/}
      {/*    transform*/}
      {/*    wrapperClass="htmlScreen"*/}
      {/*    distanceFactor={parameters.distance}*/}
      {/*    portal={{current: gl.domElement.parentNode}}*/}
      {/*    position={[parameters.x, parameters.y, parameters.z]}*/}
      {/*    occlude={"blending"}*/}
      {/*    receiveShadow={true}*/}
      {/*    prepend={true}*/}
      {/*    zIndexRange={[100, 0]}*/}
      {/*  >*/}
      {/*    /!*<iframe src="http://cometcoder.com.s3-website-us-west-1.amazonaws.com/"/>*!/*/}
      {/*    <iframe src="http://localhost:3001"/>*/}

      {/*  </Html>*/}
      {/*  <primitive scale={2} object={tablet.scene} position={[0, -height * 1, 1]}>*/}
      {/*  </primitive>*/}
      {/*</PresentationControls>*/}
      {/*<SpaceStation position={[0.0, -height * 5.25, 0]}/>*/}
      {/*<Mars position={[0.0, -height * 5.25, 0]}/>*/}
      {/*<Portal position={[0.0, -height * 5.25, 0]}/>*/}
      <ambientLight intensity={0.5}/>
      <directionalLight position={[10, 10, 5]} intensity={1}/>

      <SpaceHighway/>
      <Cockpit/>
      {/*<Galaxy/>*/}

    </>
  )
}


export {Objects}
