import {useGLTF} from "@react-three/drei";
import {useControls} from "leva";
import {useMemo} from "react";
import {useFrame} from "@react-three/fiber";


function SpaceStation(props) {

  const space_station = useGLTF('./low_poly_space_station.glb')
  space_station.scene.rotation.x = 40 * (Math.PI / 180)

  const station_position_options = useMemo(() => {
    return {
      position_x: {value: 0, min: -100, max: 100, step: 1},
      position_y: {value: 0, min: -400, max: 100, step: 1},
      position_z: {value: -17, min: -100, max: 100, step: 1},
      rotation_x: {value: 0, min: 0, max: 360, step: 1},
      rotation_y: {value: 0, min: 0, max: 360, step: 1},
      rotation_z: {value: 0, min: 0, max: 360, step: 1},
    }
  }, [])
  const position_parameters = useControls('station position controls', station_position_options)

  useFrame((state, delta) => {
    space_station.scene.rotation.y += delta/4
  })

  return (
    <>

        <Model
          scale={1}
          object={space_station.scene}
          castShadow
          position={[
            props.position[0] + position_parameters.position_x,
            props.position[1] + position_parameters.position_y,
            props.position[2] + position_parameters.position_z
          ]}
          rotation={[position_parameters.rotation_x, position_parameters.rotation_y, position_parameters.rotation_z]}
        />
        <meshStandardMaterial castShadow={true}/>

    </>
  )
}

export {SpaceStation}


export function Model(props) {
  const { nodes, materials } = useGLTF("/low_poly_space_station.glb");
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

