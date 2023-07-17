import {useGLTF} from "@react-three/drei";
import {useControls} from "leva";
import {useMemo, useRef} from "react";
import {useFrame} from "@react-three/fiber";


function SpaceStation(props) {

  const station = useRef()

  const options = useMemo(() => {
    return {
      position_x: {value: -17, min: -100, max: 100, step: 1},
      position_y: {value: 20, min: -400, max: 100, step: 1},
      position_z: {value: -28, min: -100, max: 100, step: 1},
      rotation_x: {value: 200, min: 0, max: 360, step: 1},
      rotation_y: {value: 0, min: 0, max: 360, step: 1},
      rotation_z: {value: 0, min: 0, max: 360, step: 1},
    }
  }, [])
  const position_parameters = useControls('station position controls', options)

  useFrame((state, delta) => {
    station.current.rotation.z += delta / 4
    station.current.position.x += delta / 4

  })

  return (
    <>
      <mesh
        ref={station}
        position={[
          props.position[0] + position_parameters.position_x,
          props.position[1] + position_parameters.position_y,
          props.position[2] + position_parameters.position_z
        ]}
        rotation={[position_parameters.rotation_x, position_parameters.rotation_y, position_parameters.rotation_z]}
      >
        <Model/>
      </mesh>
    </>
  )
}

export {SpaceStation}


export function Model(props) {
  const {nodes, materials} = useGLTF("/low_poly_space_station.glb");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow={true}
        receiveShadow={true}
        geometry={nodes.Object_4.geometry}
        material={materials.Space_Station_Mat2K}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

useGLTF.preload("/low_poly_space_station.glb");

