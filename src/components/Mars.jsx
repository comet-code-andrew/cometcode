import {useTexture, Plane, Wireframe} from "@react-three/drei";
import * as THREE from 'three'
import {useMemo} from "react";
import {useControls} from "leva";


function Mars(props) {

  const texture = useTexture({
    map: "/textures/mars/colormap-1024.png",
    displacementMap: '/textures/mars/heightmap-1024.png',
    normalMap: '/textures/mars/normalmap-1024.PNG',
    roughnessMap: '/textures/mars/roughnessmap-1024.png',
    smoothnessMap: '/textures/mars/smoothnessmap-1024.png'
  })

  const parameter_options = useMemo(() => {
    return {
      width: {value: 100, min: 0, max: 100, step: 1},
      height: {value: 100, min: 0, max: 5000, step: 2},
      widthSegments: {value: 100, min: 0, max: 5000, step: 2},
      heightSegments: {value: 100, min: 0, max: 5000, step: 2},
      displacement: {value: 21, min: 0, max: 50, step: 1}
    }
  }, [])
  const parameters = useControls('mars', parameter_options)

  const mars_position_options = useMemo(() => {
    return {
      position_x: {value: 0, min: -100, max: 100, step: 1},
      position_y: {value: -4, min: -400, max: 100, step: 1},
      position_z: {value: -4, min: -100, max: 100, step: 1},
      rotation_x: {value: 246, min: 0, max: 360, step: 1},
      rotation_y: {value: 0, min: 0, max: 360, step: 1},
      rotation_z: {value: 0, min: 0, max: 360, step: 1},
    }
  }, [])
  const position_parameters = useControls('mars', mars_position_options)

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
        }
        rotation-x={position_parameters.rotation_x * (Math.PI / 180)}
      >
        <planeGeometry
          args={[
            parameters.width,
            parameters.height,
            parameters.widthSegments,
            parameters.heightSegments]}
          wireframe={true}
        />
        <meshStandardMaterial {...texture} displacementScale={parameters.displacement}/>
      </mesh>
    </>
  )

}

export {Mars}