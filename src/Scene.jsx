import {Scroll, ScrollControls} from '@react-three/drei'
import React from 'react'
import {Objects} from './components/Objects'
import {
  Environment,
  useIntersect,
  Html,
  useProgress,
  useGLTF,
  PresentationControls,
} from '@react-three/drei'

function Scene() {


  return (
    <>
      <ScrollControls pages={6}>
        <Scroll>
          <Objects/>
        </Scroll>
      </ScrollControls>
    </>
  )
}

export {Scene}


function Loader() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  return <Html center>{progress} % loaded</Html>
}