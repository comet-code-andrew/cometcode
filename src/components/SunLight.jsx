import React, {useRef} from "react";
import { DirectionalLightHelper} from "three";
import {useHelper} from "@react-three/drei";
import {useControls} from "leva";


function SunLight() {

  const dirLight = useRef();
  useHelper(dirLight, DirectionalLightHelper,2,  "red");

  const directionalCtl = useControls('Directional Light', {
    visible: true,
    position: {
      x: 0.0,
      y: 10.0,
      z: 0.0,
    },
    castShadow: true,
    top: 50, // default
    left: -50, // default
    right: 50, // default
    bottom: -50
  })


  return (
    <>
      <directionalLight
        visible={directionalCtl.visible}
        position={[
          directionalCtl.position.x,
          directionalCtl.position.y,
          directionalCtl.position.z,
        ]}
        castShadow={directionalCtl.castShadow}
        ref={dirLight}
        shadow-camera-left={directionalCtl.left}
        shadow-camera-right={directionalCtl.right}
        shadow-camera-top={directionalCtl.top}
        shadow-camera-bottom={directionalCtl.bottom}
      />
    </>

  )
}

export {SunLight}