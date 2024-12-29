import React, { useRef } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";

export function SpaceHighway() {
  // Basic road controls
  const { roadLength, roadWidth, speed, segmentCount } = useControls('Space Highway', {
    roadLength: { value: 100, min: 50, max: 500, step: 10 }, // Shorter individual segments
    roadWidth: { value: 100, min: 10, max: 200, step: 1 },
    speed: { value: 200, min: 0, max: 200, step: 5 },
    segmentCount: { value: 10, min: 5, max: 20, step: 1 } // Control for number of segments
  });

  const groupRef = useRef();

  // Basic animation for road segments
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z += speed * delta;
      if (groupRef.current.position.z > roadLength) {
        groupRef.current.position.z -= roadLength;
      }
    }
  });

  // Basic road segment component
  const RoadSegment = ({ position }) => (
    <group position={position}>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, roadLength]}/>
        <meshStandardMaterial color="gray" />
      </mesh>

      {/* Start line */}
      <mesh position={[0, 0.1, roadLength/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white" />
      </mesh>

      {/* End line */}
      <mesh position={[0, 0.1, -roadLength/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef}>
      {Array.from({ length: segmentCount }).map((_, index) => (
        <RoadSegment
          key={index}
          position={[0, 0, -roadLength * index]}
        />
      ))}
    </group>
  );
}