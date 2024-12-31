import React, {useState, useRef, useCallback} from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// Individual Road Segment Component (simplified, no internal animation)
const RoadSegment = React.memo(({ id, position }) => {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="gray" />
      </mesh>
      <mesh position={[0, 0.1, 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.1, -50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <Text
        position={[0, 10, 0]}
        fontSize={20}
        color="red"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="white"
      >
        {id}
      </Text>
    </group>
  );
});

// Main Component
export function SpaceHighway() {
  const { speed, segmentLength, addSegmentDistance, removeSegmentDistance } = useControls('Space Highway', {
    speed: { value: 20, min: 0, max: 200, step: 5 },
    segmentLength: { value: 100, min: 50, max: 200, step: 10 },
    addSegmentDistance: { value: 1000, min: 50, max: 1000, step: 50 },
    removeSegmentDistance: { value: 100, min: 50, max: 200, step: 10 },
  });

  const groupRef = useRef();
  const lastSegmentIdRef = useRef(1);

  const [segments, setSegments] = useState([{ id: 1, position: [0, 0, 0] },]);

  const addSegment = useCallback(() => {
    const newSegmentId = lastSegmentIdRef.current + 1;
    lastSegmentIdRef.current = newSegmentId;

    setSegments(prevSegments => {
      const lastSegment = prevSegments[prevSegments.length - 1];
      return [
        ...prevSegments,
        {
          id: newSegmentId,
          position: [0, 0, lastSegment.position[2] - segmentLength]
        }
      ];
    });
  }, [segmentLength]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    group.position.z += speed * delta;

    // Check for segment addition
    const lastSegment = segments[segments.length - 1];
    const lastSegmentWorldZ = lastSegment.position[2] + group.position.z;
    if (lastSegmentWorldZ > -addSegmentDistance) {
      addSegment();
    }

    // Check for segment removal
    setSegments(prevSegments => {
      const firstSegment = prevSegments[0];
      const firstSegmentWorldZ = firstSegment.position[2] + group.position.z;

      // If the first segment has moved past the remove distance, remove it
      if (firstSegmentWorldZ > removeSegmentDistance) {
        return prevSegments.slice(1);  // Remove the first segment
      }

      return prevSegments;
    });
  });

  return (
    <group ref={groupRef}>
      {segments.map(segment => (
        <RoadSegment
          key={segment.id}
          position={segment.position}
          id={segment.id}
        />
      ))}
    </group>
  );
}