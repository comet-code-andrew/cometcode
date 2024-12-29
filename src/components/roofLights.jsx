import React, { useMemo, useRef } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { RectAreaLight } from "three";
import { EffectComposer, Bloom } from '@react-three/postprocessing';

export function SpaceHighway() {
  const { roadLength, roadWidth } = useControls('Space Highway', {
    roadLength: { value: 1000, min: 100, max: 2000, step: 10 },
    roadWidth: { value: 100, min: 10, max: 200, step: 1 },
  });

  const {
    bloomIntensity,
    bloomThreshold,
    bloomRadius
  } = useControls('Bloom Effect', {
    bloomIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
    bloomThreshold: { value: 0.8, min: 0, max: 1, step: 0.1 },
    bloomRadius: { value: 0.5, min: 0, max: 1, step: 0.1 }
  });

  const {
    rectIntensity,
    planeWidth,
    planeHeight,
    planeHeight_Y,
    planeEmissiveIntensity,
    lightCount,
    lightSpacing,
    speed
  } = useControls('Light Setup', {
    rectIntensity: { value: 5, min: 0, max: 20, step: 0.1 },
    planeWidth: { value: 50, min: 10, max: 200, step: 1 },
    planeHeight: { value: 12, min: 1, max: 20, step: 0.1 },
    planeHeight_Y: { value: 15, min: 1, max: 20, step: 0.1 },
    planeEmissiveIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
    lightCount: { value: 5, min: 1, max: 20, step: 1 },
    lightSpacing: { value: 50, min: 20, max: 500, step: 10 },
    speed: { value: 10, min: 0, max: 200, step: 5 }
  });

  const groupRef = useRef();

  // Create an array of light positions
  const lightPositions = useMemo(() => {
    return Array(lightCount).fill().map((_, i) => i * lightSpacing);
  }, [lightCount, lightSpacing]);

  // Animation for both road and lights
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z += speed * delta;
      if (groupRef.current.position.z > lightSpacing) {
        groupRef.current.position.z -= lightSpacing;
      }
    }
  });

  const RoadSegment = ({ position }) => (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[roadWidth, roadLength]}/>
      <meshStandardMaterial color="gray"/>
    </mesh>
  );

  return (
    <>
      <group ref={groupRef}>
        {/* Road segments */}
        <RoadSegment position={[0, 0, 0]} />
        <RoadSegment position={[0, 0, -roadLength]} />
        <RoadSegment position={[0, 0, -roadLength * 2]} />

        {/* Lights */}
        {lightPositions.map((z, index) => (
          <group key={index} position={[0, 0, -z]}>
            {/* RectAreaLight */}
            <primitive
              object={new RectAreaLight(0xffffff, rectIntensity, planeWidth, planeHeight)}
              position={[0, planeHeight_Y, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            />

            {/* Plane representing light source */}
            <mesh
              position={[0, planeHeight_Y, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[planeWidth, planeHeight]} />
              <meshStandardMaterial
                color="white"
                emissive="white"
                emissiveIntensity={planeEmissiveIntensity}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Add EffectComposer for post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity}
          threshold={bloomThreshold}
          radius={bloomRadius}
        />
      </EffectComposer>
    </>
  );
}