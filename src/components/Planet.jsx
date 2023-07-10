import {TransformControls, Wireframe, MeshReflectorMaterial, Plane, useGLTF, useTexture} from "@react-three/drei";
import {MeshStandardMaterial} from "three/src/materials/Materials";
import * as THREE from 'three'
import {extend, useLoader} from "@react-three/fiber";
import {useMemo} from "react";
import {useControls} from "leva";


function Planet(props) {
  const loader = new THREE.TextureLoader();

  const colorMap = useLoader(THREE.TextureLoader, '/textures/moon/Moon_001_COLOR.jpg')
  const displacementMap = loader.load('/textures/moon/Moon_001_DISP.jpg')
  const normalMap = loader.load('/textures/moon/Moon_001_NORM.jpg')
  const occMap = loader.load('/textures/moon/Moon_001_OCC.jpg')
  const specMap = loader.load('/textures/moon/Moon_001_SPEC.jpg')


  const texture = useTexture({
    map: "/textures/moon/Moon_001_COLOR.jpg",
    displacementMap: '/textures/moon/Moon_001_DISP.png',
    normalMap: '/textures/moon/Moon_001_NORM.jpg',
    aoMap: '/textures/moon/Moon_001_OCC.jpg',
    // roughnessMap:'/textures/moon/Moon_001_SPEC.jpg'
  })

  texture.displacementScale = 0.2

  texture.map.repeat.x = 5
  texture.map.repeat.y = 5
  texture.map.wrapS = THREE.RepeatWrapping
  texture.map.wrapT = THREE.RepeatWrapping

  // colorMap.repeat.x = 5
  // colorMap.repeat.y = 5
  // colorMap.wrapS = THREE.RepeatWrapping
  // colorMap.wrapT = THREE.RepeatWrapping


  // const material = new THREE.MeshBasicMaterial({map: colorMap})

  // const material = new THREE.MeshStandardMaterial({map: colorMap, displacementMap:displacementMap, normalMap: normalMap, aoMap: occMap})


  const parameter_options = useMemo(() => {
    return {
      radius: {value: 2, min: 0, max: 100, step: 1},
      widthSegments: {value: 32, min: 0, max: 50, step: 2},
      heightSegment: {value: 16, min: 0, max: 50, step: 2},
      phiStart: {value: 2.6, min: 0, max: 10, step: .1},
      phiLength: {value: 6.28, min: 0, max: 10, step: 2},
      thetaStart: {value: 0, min: 0, max: 10, step: 2},
      thetaLength: {value: .3, min: 0, max: 10, step: 2},
    }
  }, [])
  const parameters = useControls('planet controls', parameter_options)


  return (
    <>
      <ambientLight position={props.position}/>

      <TransformControls>
        <spotLight position={props.position}/>
      </TransformControls>

      <mesh position={props.position} rotation-x={280 * (Math.PI / 180)}>
        <sphereGeometry
          args={[
            parameters.radius,
            parameters.widthSegments,
            parameters.heightSegment,
            parameters.phiStart,
            parameters.phiLength,
            parameters.thetaStart,
            parameters.thetaLength]}/>
        <meshStandardMaterial wireframe={true}/>
      </mesh>
    </>
  )

}

export {Planet}