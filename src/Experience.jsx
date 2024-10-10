import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from "./Scene"
import { Leva } from "leva"
import { Loader } from "@react-three/drei"

export default function Experience() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Media query to check if the device width is less than or equal to 768px
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    // Set initial value
    setIsMobile(mediaQuery.matches)

    // Define callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches)
    }

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleMediaQueryChange)

    // Clean up function to remove the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange)
    }
  }, [])

  const mobileFOV = 90 // Wider FOV for mobile
  const desktopFOV = 60 // Narrower FOV for desktop

  return (
    <>
      <Leva
        oneLineLabels
        titleBar={false}
        theme={{
          sizes: {
            rootWidth: '320px',
            controlWidth: '150px',
          },
        }}
        fill={false}  // This makes it a floating panel
        flat={false}  // This gives it a bit of depth
        collapsed={false} // Expanded by default, change to true if you want it collapsed initially

      />
      <Canvas
        shadows
        camera={{
          fov: isMobile ? mobileFOV : desktopFOV,
          near: 0.1,
          far: 1000,
          position: [0, 0, 5] // Adjust as needed
        }}
      >

        <Scene />
      </Canvas>
    </>
  )
}