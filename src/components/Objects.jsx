import {
  Environment,
  useIntersect,
  Html,
  useGLTF,
  PresentationControls,
} from '@react-three/drei'
import {useLoader, useThree} from '@react-three/fiber'
import React, {useMemo, useRef, Suspense} from 'react'


import {useControls} from "leva";
import {Galaxy} from "./galaxy";
import {SiteName} from "./SiteName";
import {SpaceStation} from "./SpaceStation";
import {Mars} from "./Mars";
import {SunLight} from "./SunLight";
import {Portal} from "./Portal";


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
      <ambientLight color="white" intensity={.5}/>
      <Environment background={"only"} files={"./omega.hdr"}/>
      <SunLight/>
      <Galaxy/>
      <SiteName/>


      <PresentationControls>
        <Html
          transform
          wrapperClass="htmlScreen"
          distanceFactor={parameters.distance}
          portal={{current: gl.domElement.parentNode}}
          position={[parameters.x, parameters.y, parameters.z]}
          occlude={"blending"}
          receiveShadow={true}
          prepend={true}
          zIndexRange={[100, 0]}
        >
          <iframe src="http://cometcoder.com.s3-website-us-west-1.amazonaws.com/"/>
        </Html>
        <primitive scale={2} object={tablet.scene} position={[0, -height * 1, 1]}>
        </primitive>
      </PresentationControls>
      <SpaceStation position={[0.0, -height * 5.25, 0]}/>
      <Mars position={[0.0, -height * 5.25, 0]}/>
      <Portal position={[0.0, -height * 5.25, 0]}/>

    </>
  )
}


export {Objects}
