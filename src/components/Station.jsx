import React, {useRef} from "react";
import {useGLTF} from "@react-three/drei";
import {useMemo} from "react";
import {useControls} from "leva";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {useLoader} from "@react-three/fiber";
// import {softShadows} from "drei";

// softShadows()

function Station(props) {

  const gltf = useLoader(GLTFLoader, "space_station.glb");
  gltf.scene.children.forEach((mesh, i) => {
    mesh.castShadow = true;
  })
  gltf.castShadow = true;
  gltf.scene.castShadow = true;
  console.log(gltf)
  // const geo = useMemo(() => gltf.__$[2].geometry, [])
  // const mat = useMemo(() => gltf.__$[2].material, [])

  const station_position_options = useMemo(() => {
    return {
      position_x: {value: 0, min: -100, max: 100, step: 1},
      position_y: {value: 0, min: -400, max: 100, step: 1},
      position_z: {value: 0, min: -100, max: 100, step: 1},
      rotation_x: {value: 0, min: 0, max: 360, step: 1},
      rotation_y: {value: 0, min: 0, max: 360, step: 1},
      rotation_z: {value: 0, min: 0, max: 360, step: 1},
    }
  }, [])
  const position_parameters = useControls('station position controls', station_position_options)


  return (
    <>
      {/*<mesh castShadow>*/}
      {/*  <bufferGeometry attach="geometry" {...geo} />*/}
      {/*  <meshStandardMaterial attach="material" {...mat} />*/}
      {/*</mesh>*/}
      {/*<mesh cashShadow>*/}
      {/*<Model*/}
      {/*  castShadow={true}*/}
      {/*  position={*/}
      {/*    [*/}
      {/*      props.position[0] + position_parameters.position_x,*/}
      {/*      props.position[1] + position_parameters.position_y,*/}
      {/*      props.position[2] + position_parameters.position_z*/}
      {/*    ]*/}
      {/*  }*/}
      {/*/>*/}
      {/*</mesh>*/}
    </>
  )
}

export {Station}


export function Model(props) {
  const {nodes, materials} = useGLTF("/space_station.glb");
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={nodes.Object_2.geometry}
          material={materials.blinn1SG}
        />
        <mesh
          castShadow={true}
          receiveShadow={true}
          geometry={nodes.Object_3.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_4.geometry}
          material={materials.blinn2SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_5.geometry}
          material={materials.initialShadingGroup}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials.lambert2SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_7.geometry}
          material={materials.lambert3SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_8.geometry}
          material={materials.lambert4SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_9.geometry}
          material={materials.lambert5SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_10.geometry}
          material={materials.lambert6SG}
        />
        <mesh
          castShadow={true}
          receiveShadow
          geometry={nodes.Object_11.geometry}
          material={materials.lambert6SG}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/space_station.glb");