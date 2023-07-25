import {Scroll, ScrollControls} from '@react-three/drei'
import React, {Suspense} from 'react'
import {Objects} from './components/Objects'
import {
  Environment,
  useIntersect,
  Html,
  useProgress,
  useGLTF,
  PresentationControls,
} from '@react-three/drei'
import Box from '@mui/material/Box';
import CircularProgressWithLabel from '@mui/material/LinearProgress';
import {Container} from "@mui/material";




function Scene() {



  function Loader() {
    const {active, progress, errors, item, loaded, total} = useProgress()
    return (<>
      <Html center>
          <CircularProgressWithLabel value={progress} color={"primary"}/>
          <p style={{color : "#19C1DC"}}>{item}</p>
      </Html>
    </>
    )
  }

  return (
    <>
      <Suspense fallback={<Loader/>}>
        <ScrollControls pages={6}>
          <Scroll>
            <Objects/>
          </Scroll>
        </ScrollControls>
      </Suspense>

    </>
  )
}

export {Scene}


function Loader() {
  const {active, progress, errors, item, loaded, total} = useProgress()
  return <Html center>{progress} % loaded</Html>
}