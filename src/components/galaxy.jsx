import * as THREE from 'three'
import {PointMaterial, Points, shaderMaterial} from "@react-three/drei";
import {extend} from "@react-three/fiber";
import {useControls} from "leva";


function Galaxy() {

  /**
   * Geometry
   */
  const parameters = {}
  parameters.count = 100 // We want to create 1000 points
  parameters.size = 10.0

  const controls = useControls({
    size: 10.0,
    heightC: 2,
    widthC: 1,
    somethingC: 1
  })

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3) // Create an array to store 1000 * 3 values
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3 // Fill the x, y, and z for all 1000 points.

    positions[i3] = (Math.random() - 0.5) * 3
    positions[i3 + 1] = (Math.random() - 0.5) * 3
    positions[i3 + 2] = (Math.random() - 0.5) * 3
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const randoms = new Float32Array(parameters.count)
  for (let i = 0; i < parameters.count; i++) {
    randoms[i] = 20.0
  }
  geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))


  /**
   * shaderMaterial from DREI
   */
  const GalaxyMaterial = shaderMaterial({
      time: 0,
      color: new THREE.Color("Black"),
      uSize: controls.size
    }, // vertex shader
    /*glsl*/`
    varying vec2 vUv;
    uniform float uSize;
    void main() {
      vUv = uv;
      gl_PointSize = uSize;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `, // fragment shader
    /*glsl*/`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      gl_FragColor.rgba = vec4(0.5 + 0.3 * sin(vUv.yxx + time) + color, 1.0);
    }
  `)
  extend({GalaxyMaterial})


  return (<>
    <Points positions={positions} size={20.0}>
      <galaxyMaterial key={GalaxyMaterial.key}/>
    </Points>
  </>)

}

export {Galaxy}
