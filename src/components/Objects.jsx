import {useIntersect, Html} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import React, {useMemo, useRef} from 'react'
import * as THREE from 'three'

import {useControls} from "leva";
import {Galaxy} from "./galaxy";
import {SiteName} from "./SiteName";
import {Tablet} from "./Tablet";

function Objects() {
  const {height, width} = useThree((state) => state.viewport)


  return (
    <>
      <pointLight color="blue" position={[8, -25, 5]} intensity={20}/>
      <pointLight color="red" position={[0, -height * 2.25, 5]} intensity={10}/>
      <ambientLight color="white"/>

      <Item color="blue" position={[width / 2, -height * 1, 0]}>
        <dodecahedronGeometry/>
      </Item>
      <Item color="gray" position={[-width / 5, -height * 1.8, -2]}>
        <coneGeometry args={[1, 1, 6]}/>
      </Item>
      <Item color="purple" position={[width / 4, -height * 2, 0]}>
        <coneGeometry args={[1.5, 2, 3]}/>
      </Item>
      <Item color="orange" position={[-width / 12, -height * 2.25, 0.5]}>
        <coneGeometry args={[0.75, 2.5, 12]}/>
      </Item>

      <Galaxy position={[1, 100, 100]}/>
      <SiteName position={[2, 100, 3]}/>

      <Tablet position={[0, -height * 1, 3]} rotation-x={1.6}>

      </Tablet>


      {/*<Html*/}
      {/*      */}
      {/*      wrapperClass="htmlScreen"*/}
      {/*>*/}
      {/*  <iframe src="https://bruno-simon.com/html/"/>*/}
      {/*</Html>*/}




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