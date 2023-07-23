import {Center, Text3D, OrbitControls} from "@react-three/drei";
import {useEffect, useState} from "react";
import {useLoader} from "@react-three/fiber";
import * as THREE from 'three'


export function SiteName() {

  // This chunk-o code will change the font size so that the 3d texts doesn't look absolutely terrible on mobile.
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight
  });
  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight
    })
  }
  useEffect(() => {
    window.addEventListener('resize', setDimension);

    return(() => {
      window.removeEventListener('resize', setDimension);
    })
  }, [screenSize])
  // end chunk-o code

  const [map] = useLoader(THREE.TextureLoader, ["/textures/matcap4.png"])


  return (<>
      <Center position-y={2}>
        <Text3D size={window.innerWidth/1000 > 1 ? 1 : window.innerWidth/1000} font="./fonts/MotterTektura.json">
          Comet Code
          <meshMatcapMaterial matcap={map}/>
        </Text3D>
      </Center>
    </>
  )
}