import React, {useRef, useState} from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Text } from '@react-three/drei'; // We'll use drei's Text component for numbering

import { useFrame } from "@react-three/fiber";

export function SpaceHighway() {
  // Basic road controls
  const {roadLength, roadWidth, speed, segmentCount} = useControls('Space Highway', {
    roadLength: {value: 100, min: 50, max: 500, step: 10}, // Shorter individual segments
    roadWidth: {value: 100, min: 10, max: 200, step: 1},
    speed: {value: 20, min: 0, max: 200, step: 5},
    segmentCount: {value: 3, min: 5, max: 2000, step: 1} // Control for number of segments
  });

  // Basic road segment component
  const RoadSegment = ({position, number}) => (
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
      <mesh position={[0, 0.1, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white"/>
      </mesh>
      <mesh position={[0, 0.1, -roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roadWidth, 1]}/>
        <meshStandardMaterial color="white"/>
      </mesh>
    </group>
  );

  const MAX_ROAD_NUMBER = 9999;
  const [segments, setSegments] = React.useState(() =>
    Array.from({length: segmentCount}, (_, i) => ({
      id: i,
      number: i,
      position: -roadLength * i
    }))
  );

  useFrame((state, delta) => {
    setSegments(currentSegments => {
      // Move all segments
      let updatedSegments = currentSegments.map(segment => ({
        ...segment,
        position: segment.position + speed * delta
      }));

      // Remove segments that have moved too far
      updatedSegments = updatedSegments.filter(segment => segment.position <= roadLength * 1.5);

      // Check if we need to add a new segment
      const lastSegment = updatedSegments[updatedSegments.length - 1];
      if (lastSegment && lastSegment.number < MAX_ROAD_NUMBER) {
        const nextPosition = lastSegment.position - roadLength;
        if (nextPosition > -roadLength * segmentCount) {
          updatedSegments.push({
            id: lastSegment.id + 1,
            number: lastSegment.number + 1,
            position: nextPosition
          });
          console.log(`Generated segment ${lastSegment.number + 1}`);
        }
      }

      return updatedSegments;
    });
  });

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
    archFrequency

  } = useControls('Arch Structure', {
    pillarHeight: {value: 12, min: 5, max: 30, step: 1},
    pillarDepth: {value: 1, min: 0.5, max: 5, step: 0.1},
    pillarThickness: {value: 0.5, min: 0.1, max: 2, step: 0.1},
    topBeamThickness: {value: 1, min: 0.5, max: 3, step: 0.1},
    topBeamDepth: {value: 5, min: 1, max: 20, step: 0.5},
    archWidth: {value: 80, min: 50, max: 120, step: 1},
    angleHeight: {value: 2, min: 1, max: 15, step: 0.1},
    angleWidth: {value: 5, min: 1, max: 20, step: 0.1},
    emissiveIntensity: {value: 2, min: 0, max: 5, step: 0.1},
    archFrequency: {
      value: 2,
      min: 1,
      max: 10,
      step: 1,
      description: 'Place arch every Nth segment'
    }
  });

  // Brutalist Arch component
  const BrutalistArch = ({position}) => {
    const totalHeight = pillarHeight + angleHeight;

    return (
      <group position={position}>
        {/* Left structure */}
        <group position={[-archWidth / 2, 0, 0]}>
          {/* Vertical part */}
          <mesh position={[0, pillarHeight / 2, 0]}>
            <boxGeometry args={[pillarThickness, pillarHeight, pillarDepth]}/>
            <meshStandardMaterial color="white"/>
          </mesh>

          {/* Angled part */}
          <mesh
            position={[angleWidth / 2, pillarHeight + angleHeight / 2, 0]}
            rotation={[0, 0, Math.atan2(angleHeight, angleWidth)]}
          >
            <boxGeometry
              args={[
                Math.sqrt(angleWidth * angleWidth + angleHeight * angleHeight),
                pillarThickness,
                pillarDepth
              ]}
            />
            <meshStandardMaterial color="white"/>
          </mesh>
        </group>

        {/* Right structure (mirrored) */}
        <group position={[archWidth / 2, 0, 0]}>
          <mesh position={[0, pillarHeight / 2, 0]}>
            <boxGeometry args={[pillarThickness, pillarHeight, pillarDepth]}/>
            <meshStandardMaterial color="white"/>
          </mesh>

          <mesh
            position={[-angleWidth / 2, pillarHeight + angleHeight / 2, 0]}
            rotation={[0, 0, -Math.atan2(angleHeight, angleWidth)]}
          >
            <boxGeometry
              args={[
                Math.sqrt(angleWidth * angleWidth + angleHeight * angleHeight),
                pillarThickness,
                pillarDepth
              ]}
            />
            <meshStandardMaterial color="white"/>
          </mesh>
        </group>

        {/* Top beam */}
        <mesh position={[0, totalHeight, 0]}>
          <boxGeometry args={[archWidth - (angleWidth * 2), topBeamThickness, topBeamDepth]}/>
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      </group>
    );
  };

  return (
    <group>
      {segments.map((segment) => (
        <group key={segment.id} position={[0, 0, segment.position]}>
          <RoadSegment position={[0, 0, 0]} number={segment.number}/>
          {/* Only render arch if segment number is divisible by archFrequency */}
          {segment.number % archFrequency === 0 && (
            <BrutalistArch position={[0, 0, 0]}/>
          )}
        </group>
      ))}
    </group>
  );
}