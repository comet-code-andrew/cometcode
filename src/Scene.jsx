import React, {useRef, useEffect, useLayoutEffect} from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Objects } from './components/Objects'
import { useControls } from "leva";
import * as THREE from "three";
import {OrbitControls} from "@react-three/drei";

function Scene() {
  const { camera } = useThree()
  const cameraRef = useRef()

  const VIEWS = {
    FREE: {
      position: new THREE.Vector3(0, 3.75, 2),
      target: new THREE.Vector3(0, 0, -20),
      name: "Free Camera"
    },
    RACING: {
      position: new THREE.Vector3(0, 3.75, 2),
      target: new THREE.Vector3(0, 0, -20),
      name: "Racing View"
    },
    TABLET: {
      position: new THREE.Vector3(0, 4, 0),
      target: new THREE.Vector3(0, 0, -3),
      name: "Tablet View"
    }
  }

  const { currentView } = useControls({
    currentView: {
      options: {
        [VIEWS.FREE.name]: 'FREE',
        [VIEWS.RACING.name]: 'RACING',
        [VIEWS.TABLET.name]: 'TABLET'
      },
      value: 'FREE'
    }
  })

  useEffect(() => {
    cameraRef.current = {
      position: camera.position.clone(),
      target: new THREE.Vector3()
    }
    camera.getWorldDirection(cameraRef.current.target).add(camera.position)
  }, [camera])

  useFrame((state, delta) => {
    if (currentView !== 'FREE') {
      const view = VIEWS[currentView]

      const lerpFactor = 3 * delta // Adjust for smooth transition speed

      // Smoothly transition camera position
      cameraRef.current.position.lerp(view.position, lerpFactor)
      camera.position.copy(cameraRef.current.position)

      // Smoothly transition camera target
      cameraRef.current.target.lerp(view.target, lerpFactor)
      camera.lookAt(cameraRef.current.target)

      camera.updateProjectionMatrix()
    }
  })

  return (
    <>
      {currentView === 'FREE' && <OrbitControls />}

      <Objects />
    </>
  )
}

export { Scene }