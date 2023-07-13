import {useTexture} from "@react-three/drei";
import * as THREE from 'three'
import {useMemo} from "react";
import {useControls} from "leva";


function Planet(props) {

  const texture = useTexture({
    map: "/textures/moon/Moon_001_COLOR.jpg",
    displacementMap: '/textures/moon/Moon_001_DISP.png',
    normalMap: '/textures/moon/Moon_001_NORM.jpg',
    aoMap: '/textures/moon/Moon_001_OCC.jpg',
    // roughnessMap:'/textures/moon/Moon_001_SPEC.jpg'
  })

  const repeat_count =16

  texture.displacementScale = 0.2

  texture.map.repeat.x = repeat_count
  texture.map.repeat.y = repeat_count
  texture.map.wrapS = THREE.RepeatWrapping
  texture.map.wrapT = THREE.RepeatWrapping

  texture.displacementMap.repeat.x = repeat_count
  texture.displacementMap.repeat.y = repeat_count
  texture.displacementMap.wrapS = THREE.RepeatWrapping
  texture.displacementMap.wrapT = THREE.RepeatWrapping

  texture.normalMap.repeat.x = repeat_count
  texture.normalMap.repeat.y = repeat_count
  texture.normalMap.wrapS = THREE.RepeatWrapping
  texture.normalMap.wrapT = THREE.RepeatWrapping

  texture.aoMap.repeat.x = repeat_count
  texture.aoMap.repeat.y = repeat_count
  texture.aoMap.wrapS = THREE.RepeatWrapping
  texture.aoMap.wrapT = THREE.RepeatWrapping

  const parameter_options = useMemo(() => {
    return {
      radius: {value: 100, min: 0, max: 100, step: 1},
      widthSegments: {value: 50, min: 0, max: 5000, step: 2},
      heightSegment: {value: 50, min: 0, max: 5000, step: 2},
      phiStart: {value: 2.6, min: 0, max: 10, step: .1},
      phiLength: {value: 6.283185307179586, min: 0, max: 10, step: 2},
      thetaStart: {value: 0, min: 0, max: 10, step: 2},
      thetaLength: {value: 0.414690230273853, min: 0, max: 10, step: 2},
    }
  }, [])
  const parameters = useControls('planet geometry controls', parameter_options)

  const planet_position_options = useMemo(() => {
    return {
      position_x: {value: 0, min: -100, max: 100, step: 1},
      position_y: {value: -100, min: -400, max: 100, step: 1},
      position_z: {value: -14, min: -100, max: 100, step: 1},
      rotation_x: {value: 0, min: 0, max: 360, step: 1},
      rotation_y: {value: 0, min: 0, max: 360, step: 1},
      rotation_z: {value: 1, min: 0, max: 360, step: 1},
    }
  }, [])
  const position_parameters = useControls('planet position controls', planet_position_options)

  console.log(props)

  return (
    <>
      <mesh
        receiveShadow={true}
        position={
          [
            props.position[0] + position_parameters.position_x,
            props.position[1] + position_parameters.position_y,
            props.position[2] + position_parameters.position_z
          ]
        } rotation-x={position_parameters.rotation_x * (Math.PI / 180)}
      >
        <sphereGeometry
          args={[
            parameters.radius,
            parameters.widthSegments,
            parameters.heightSegment,
            parameters.phiStart,
            parameters.phiLength,
            parameters.thetaStart,
            parameters.thetaLength]}/>
        {/*<meshStandardMaterial/>*/}
        <meshStandardMaterial {...texture}/>
      </mesh>
    </>
  )

}

export {Planet}