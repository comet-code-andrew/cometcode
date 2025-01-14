import React, {useRef, useEffect, useLayoutEffect} from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Objects } from './components/Objects'
import { useControls } from "leva";
import * as THREE from "three";
import {OrbitControls} from "@react-three/drei";

function Scene() {
  const { camera } = useThree()

  const VIEWS = {
    FREE: {
      position: new THREE.Vector3(0, 3, 2),
      target: new THREE.Vector3(0, 0, -20),
      name: "Free Camera"
    },
    RACING: {
      position: new THREE.Vector3(0, 3.75, 2),
      target: new THREE.Vector3(0, 0, -20),
      name: "Racing View"
    },
    TABLET: {
      position: new THREE.Vector3(0, 4, -0),
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
      value: 'FREE' // Set FREE as default
    }
  })

  useFrame(() => {
    if (currentView !== 'FREE') {
      const view = VIEWS[currentView];

      // Update camera position and look-at only for fixed views
      camera.position.copy(view.position);
      camera.lookAt(view.target);
      camera.updateProjectionMatrix();
    }
    // When in FREE mode, do nothing - allowing manual camera control
  });

  return (
    <>
      {currentView === 'FREE' && <OrbitControls />}

      <Objects />
    </>
  )
}

export { Scene }