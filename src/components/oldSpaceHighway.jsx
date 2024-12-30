import React, { useRef } from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Text } from '@react-three/drei'; // We'll use drei's Text component for numbering

import { useFrame } from "@react-three/fiber";

export function SpaceHighway() {
  // Basic road controls
  const {roadLength, roadWidth, speed, segmentCount} = useControls('Space Highway', {
    roadLength: {value: 100, min: 50, max: 500, step: 10}, // Shorter individual segments
    roadWidth: {value: 100, min: 10, max: 200, step: 1},
    speed: {value: 200, min: 0, max: 200, step: 5},
    segmentCount: {value: 10, min: 5, max: 2000, step: 1} // Control for number of segments
  });

  // Basic road segment component
  const RoadSegment = ({ position, number }) => (
    <group position={position}>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, roadLength]}/>
        <meshStandardMaterial color="gray"/>
      </mesh>

      {/* Segment number */}
      <Text
        position={[0, 10, 0]}  // Raised higher above the road
        fontSize={20}         // Larger font size
        color="red"           // Changed to a more visible color
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}    // Add an outline for better visibility
        outlineColor="white"  // Outline color
      >
        {number.toString()}
      </Text>

      {/* Lines */}
      <mesh position={[0, 0.1, roadLength/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white"/>
      </mesh>
      <mesh position={[0, 0.1, -roadLength/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white"/>
      </mesh>
    </group>
  );

  const {
    pillarHeight,
    pillarDepth,
    pillarThickness,
    topBeamThickness,
    topBeamDepth,
    archWidth,
    angleHeight,
    angleWidth,
    emissiveIntensity,
    archFrequency  // New control for arch spacing
  } = useControls('Arch Structure', {
    pillarHeight: { value: 12, min: 5, max: 30, step: 1 },
    pillarDepth: { value: 1, min: 0.5, max: 5, step: 0.1 },
    pillarThickness: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    topBeamThickness: { value: 1, min: 0.5, max: 3, step: 0.1 },
    topBeamDepth: { value: 5, min: 1, max: 20, step: 0.5 },  // Increased max
    archWidth: { value: roadWidth * 0.8, min: roadWidth * 0.5, max: roadWidth * 1.2, step: 1 },
    angleHeight: { value: 2, min: 1, max: 15, step: 0.1 },   // Increased max
    angleWidth: { value: 5, min: 1, max: 20, step: 0.1 },    // Increased max
    emissiveIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    archFrequency: {
      value: 2,
      min: 1,
      max: 5,
      step: 1,
      description: 'Place arch every Nth segment'
    }
  });


  const groupRef = useRef();
  const counterRef = useRef(0); // Keep track of the first segment number
  const segmentsRef = useRef(Array.from({ length: segmentCount }).map((_, i) => i));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z += speed * delta;

      if (groupRef.current.position.z > roadLength) {
        groupRef.current.position.z -= roadLength;

        // Increment all segment numbers
        counterRef.current += 1;
        segmentsRef.current = segmentsRef.current.map((_, index) =>
          counterRef.current + index
        );
      }
    }
  });

  return (
    <group ref={groupRef}>
      {segmentsRef.current.map((segmentNumber, index) => (
        <group key={index} position={[0, 0, -roadLength * index]}>
          <RoadSegment position={[0, 0, 0]} number={segmentNumber} />
        </group>
      ))}
    </group>
  );
}