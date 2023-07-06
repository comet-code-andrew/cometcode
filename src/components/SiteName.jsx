import {Center, Text3D, OrbitControls} from "@react-three/drei";
import {useEffect, useState} from "react";

export function SiteName() {
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

  console.log(window.innerWidth)

  return (<>
      <Center position-y={2}>
        <Text3D size={window.innerWidth/1000 > 1 ? 1 : window.innerWidth/1000} font="./fonts/Orbitron_Regular.json">
          Comet Code
          <meshNormalMaterial/>
        </Text3D>
      </Center>
    </>
  )
}