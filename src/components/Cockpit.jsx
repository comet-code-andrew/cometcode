import React, {useEffect, useRef, useState} from 'react'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {OrbitControls, TransformControls} from '@react-three/drei'
import { Color, Vector3 } from 'three'

export function Cockpit(props) {
  const { scene } = useLoader(GLTFLoader, '/testv5.glb')
  const [hoveredMesh, setHoveredMesh] = useState(null)
  const [clickedMesh, setClickedMesh] = useState(null)

  const highlightColor = new Color(0x00ff00)
  const clickedColor = new Color(0xff0000)

  const pressDistance = .10  // Adjust as needed
  const pressDuration = 100   // Milliseconds
  const originalPositions = useRef({})

  const handlePointerOver = (e) => {
    e.stopPropagation()
    setHoveredMesh(e.object)
  }

  const handlePointerOut = (e) => {
    e.stopPropagation()
    setHoveredMesh(null)
  }

  const handleClick = (e) => {
    e.stopPropagation()
    const mesh = e.object
    setClickedMesh(mesh)
    pressButton(mesh)

    console.log('Button clicked:', mesh.name); // Add this line
    sendMessageToIframe({ type: 'buttonClick', button: mesh.name });

    setTimeout(() => setClickedMesh(null), pressDuration);

  }



  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = child.material.clone()
      if (child === clickedMesh) {
        child.material.color.set(clickedColor)
      } else if (child === hoveredMesh) {
        child.material.color.set(highlightColor)
      } else {
        child.material.color.set(child.userData.originalColor || 0xffffff)
      }
    }
  })

  useEffect(() => {
    // enableShadows(scene);  // Add this line!

    scene.traverse((child) => {
      if (child.isMesh) {
        // Smooth normals
        child.geometry.computeVertexNormals();

        child.castShadow = true;  // Enable shadow casting
        child.receiveShadow = true;  // Enable shadow receiving (if needed)


        if (child.material) {
          // Adjust material properties
          child.material.flatShading = true;
          child.material.envMapIntensity = 1.5; // Adjust as needed
          child.material.roughness = 0.5; // Adjust as needed
          child.material.metalness = 0.5; // Adjust as needed
          child.material.needsUpdate = true;
        }

        // Store original position
        originalPositions.current[child.uuid] = child.position.clone()

        // Store original color
        child.userData.originalColor = child.material.color.clone()
      }
    })
  }, [scene])

// In Cockpit.jsx
//   const sendMessageToIframe = (message) => {
//     const iframe = document.querySelector('iframe');
//     if (iframe) {
//       // Use iframe's src as target origin
//       iframe.contentWindow.postMessage(message, 'http://localhost:3001');
//       console.log('Message sent to iframe:', message);
//     } else {
//       console.error('Iframe not found');
//     }
//   };
  const sendMessageToIframe = (message) => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage(message, '*');
      console.log('Message sent to iframe:', message);
    } else {
      console.error('Iframe not found');
    }
  };




  const pressButton = (mesh) => {
    const originalPosition = originalPositions.current[mesh.uuid]
    if (!originalPosition) return

    // Calculate press direction (local -Z axis)
    const pressDirection = new Vector3(0, 0, -1)
    pressDirection.applyQuaternion(mesh.quaternion)
    pressDirection.normalize()

    // Animate press
    mesh.position.copy(originalPosition).add(pressDirection.multiplyScalar(pressDistance))
    setTimeout(() => {
      mesh.position.copy(originalPosition)
    }, pressDuration)
  }

  return (
    <>
    <OrbitControls/>
    <TransformControls>
      <primitive
        object={scene}
        {...props}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}

      />
    </TransformControls>
    </>
  )
}