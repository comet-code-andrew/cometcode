import {Text, ContactShadows, PresentationControls, Float, Environment, OrbitControls} from "@react-three/drei";
import Laptop from "./Laptop";

export default function Experience() {

  return <>

    <Environment preset="city"/>
    <color args={['#241a1a']} attach="background"/>

    <PresentationControls
      global
      rotation={ [ 0.13, 0.1, 0 ] }
      polar={ [ - 0.4, 0.2 ] }
      azimuth={ [ - 1, 0.75 ] }

    >
      <Float>
        <rectAreaLight
          width={ 2.5 }
          height={ 1.65 }
          intensity={ 65 }
          color={ '#ff6900' }
          rotation={ [ - 0.1, Math.PI, 0 ] }
          position={ [ 0, 0.55, - 1.15 ] }
        />
        <Laptop position-y={-1.2}/>
      </Float>
    </PresentationControls>

    <ContactShadows
      position-y={-1.4}
      opacity={0.4}
      scale={5}
      blue={2.4}
    />
  </>
}