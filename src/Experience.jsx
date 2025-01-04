import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from "./Scene"
import {Leva, LevaPanel} from "leva"
import { Loader, Stats } from "@react-three/drei"



export default function Experience() {

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    setIsMobile(mediaQuery.matches)
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches)
    }
    mediaQuery.addEventListener('change', handleMediaQueryChange)
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
      <LevaPanel/>
      <Canvas
        shadows
        camera={{
          fov: isMobile ? mobileFOV : desktopFOV,
          near: 0.1,
          far: 1000,
          // position: [0, 0, 5] // Adjust as needed
        }}
        // frameloop="demand"

      >
        <Stats showPanel={0} className="fps" /> {/* FPS */}
        <Stats showPanel={1} className="ms" /> {/* MS */}
        <Stats showPanel={2} className="mb" /> {/* MB */}
        <Scene />
      </Canvas>
    </>
  )
}