import {Canvas} from '@react-three/fiber'
import {Scene} from "./Scene";
import {Leva} from "leva"
import {Suspense} from "react";
import {Loader} from "@react-three/drei"


export default function Experience() {



  return (<>

      <Canvas
        shadows
      >
          <Leva
            fill // default = false,  true makes the pane fill the parent dom node it's rendered in
            flat // default = false,  true removes border radius and shadow
            oneLineLabels // default = false, alternative layout for labels, with labels and fields on separate rows
            hideTitleBar // default = false, hides the GUI header
            collapsed // default = false, when true the GUI is collpased
            hidden
          />
          <Scene/>
      </Canvas>
    </>
  )
}

