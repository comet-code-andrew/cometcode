import * as THREE from 'three'
import {Points, shaderMaterial, TransformControls} from "@react-three/drei";
import {extend, useFrame} from "@react-three/fiber";
import {useControls} from "leva";
import {useMemo, useRef} from "react";


function Galaxy() {

  /**
   * Geometry
   */
  const parameter_options = useMemo(() => {
    return {
      count: {value: 20000, min: 10000, max: 800000, step: 10000},
      size: {value: 26.0, min: 0, max: 500, step: 2},
      radius: {value: 5, min: 0, max: 10, step: 2},
      branches: {value: 3, min: 0, max: 10, step: 2},
      spin: {value: 1, min: 0, max: 10, step: 2},
      randomness: {value: 0.5, min: 0, max: 10, step: 2},
      randomnessPower: {value: 3, min: 0, max: 10, step: 2},
      insideColor: {value: '#ff6030'},
      outsideColor: {value: '#1b3984'},
      position_x: {value: 0, min: -1000, max: 100, step: 1},
      position_y: {value: 0, min: -1000, max: 100, step: 1},
      position_z: {value: 0, min: -1000, max: 100, step: 1},
      rotation_x: {value: 0, min: -1000, max: 100, step: 1}

    }
  }, [])
  const parameters = useControls('parameter controls', parameter_options)

  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(parameters.count * 3) // Create an array to store 1000 * 3 values
  const colors = new Float32Array(parameters.count * 3)
  const scales = new Float32Array(parameters.count)

  const insideColor = new THREE.Color(parameters.insideColor)
  const outsideColor = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    // Position
    const radius = Math.random() * parameters.radius
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

    const randomX = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius)
    const randomY = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius)
    const randomZ = (Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius)

    positions[i3] = Math.cos(branchAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ

    positions[i3] += parameters.position_x
    positions[i3 + 1] += parameters.position_y
    positions[i3 + 2] += parameters.position_z

    // Color
    const mixedColor = insideColor.clone()
    mixedColor.lerp(outsideColor, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b

    // Scale
    scales[i] = Math.random() * 10.0
  }

  const galaxyMaterial = useRef()
  useFrame((state, delta) => {
    galaxyMaterial.current.uTime += delta/2
  })


  return (<>

      <mesh position-y={-1}>
        <Points positions={positions} >
          <galaxyMaterial rotation={[0,5,0]} ref={galaxyMaterial} uSize={parameters.size} color={colors} key={GalaxyMaterial.key} uRotation={parameters.rotation_x}/>
        </Points>
      </mesh>
  </>)

}

export {Galaxy}


const GalaxyMaterial = shaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    uSize: 0.01, // TODO: multiply by getPixelRation()
    uTime: 0,
    color: new THREE.Color("blue"),
    uRotation: 0.0



  }, // vertex shader
  /*glsl*/`
    uniform float uSize;
    uniform float uTime;
    uniform float uRotation;
    
    attribute float aScale;
    
    varying vec3 vColor;
    
    void main() {
    
    
      // Tilt
      // vec4 newPosition = vec4(
      // cos(1.0) * sin(1.0), // x
      // cos(1.0), // y
      // sin(1.0) * sin(1.0), // z
      // 1.0
      // );
    
    
      // vec4 modelPosition = modelMatrix * newPosition;
       
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      
      // Spin
      float angle = atan(modelPosition.x, modelPosition.z);
      float distanceToCenter = length(modelPosition.xz);
      float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
      angle += angleOffset;
      modelPosition.x = cos(angle) * distanceToCenter;
      modelPosition.z = sin(angle) * distanceToCenter;

      // Move
      // modelPosition.z -= 4.0;

      
      
      vec4 viewPosition = viewMatrix * modelPosition;
      

      
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      
      gl_PointSize = uSize;
      gl_PointSize *= (1.0 / -viewPosition.z);
      
      // Set varying to the attribute
      vColor = color;
      
    }
  `, // fragment shader
  /*glsl*/`
    
    varying vec3 vColor;
    
    void main() {
    
      // Disc
      float strength = distance(gl_PointCoord, vec2(0.5));
      
      // Invert disk color
      strength = 1.0 - strength;
      
      // Diffuse to make fuzzy
      strength = pow(strength, 10.0);
      
      // Color
      vec3 color = mix(vec3(0.0), vColor, strength);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `)
extend({GalaxyMaterial})
