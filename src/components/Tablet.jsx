import React, { useRef } from "react";
import {Html, useGLTF} from "@react-three/drei";

export function Tablet(props) {
  const { nodes, materials } = useGLTF("/sci-fi_tablet.glb");
  return (
    <group {...props} dispose={null}>
      <group scale={0.01}>

        <Html
              transform
              wrapperClass="htmlScreen"
        >
          <iframe src="https://bruno-simon.com/html/"/>
        </Html>

        <group rotation={[Math.PI, 0, 0]} scale={100}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006_TabMat_0.geometry}
            material={materials.TabMat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006_InnerPlate_0.geometry}
            material={materials.InnerPlate}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006_Emmison_0.geometry}
            material={materials.Emmison}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006_Screws_0.geometry}
            material={materials.Screws}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Cube006_Screen_0.geometry}
            material={materials.Screen}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/sci-fi_tablet.glb");
