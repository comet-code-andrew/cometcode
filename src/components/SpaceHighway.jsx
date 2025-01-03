import React, {useState, useRef, useCallback} from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

// BrutalistArch component
const BrutalistArch = React.memo(() => {
  const {
    archWidth,
    pillarHeight,
    pillarDepth,
    pillarThickness,
    topBeamThickness,
    topBeamDepth,
    angleHeight,
    angleWidth,
    emissiveIntensity,
    rectIntensity,
  } = useControls('Arch Structure', {
    archWidth: { value: 80, min: 50, max: 120, step: 1 },
    pillarHeight: { value: 12, min: 5, max: 30, step: 1 },
    pillarDepth: { value: 1, min: 0.5, max: 5, step: 0.1 },
    pillarThickness: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    topBeamThickness: { value: 1, min: 0.5, max: 3, step: 0.1 },
    topBeamDepth: { value: 5, min: 1, max: 20, step: 0.5 },
    angleHeight: { value: 2, min: 1, max: 15, step: 0.1 },
    angleWidth: { value: 5, min: 1, max: 20, step: 0.1 },
    emissiveIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    rectIntensity: { value: 5, min: 0, max: 20, step: 0.1 },
  });

  const totalHeight = pillarHeight + angleHeight;

  return (
    <group>
      {/* Left structure */}
      <group position={[-archWidth / 2, 0, 0]}>
        <mesh position={[0, pillarHeight / 2, 0]}>
          <boxGeometry args={[pillarThickness, pillarHeight, pillarDepth]}/>
          <meshStandardMaterial color="white"/>
        </mesh>
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

      {/* RectAreaLight */}
      <rectAreaLight
        width={archWidth - (angleWidth * 2)}
        height={topBeamDepth}
        intensity={rectIntensity}
        color="white"
        position={[0, totalHeight - (topBeamThickness / 2), 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
});

// RoadSegment component
const RoadSegment = React.memo(({ id }) => {
  return (
    <group>
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
        {/*{id}*/}
      </Text>
    </group>
  );
});

// Main SpaceHighway component
export function SpaceHighway() {
  const {
    speed,
    segmentLength,
    addSegmentDistance,
    removeSegmentDistance,
    roadFrequency,
    archFrequency,
    signFrequency
  } = useControls('Space Highway', {
    speed: { value: 20, min: 0, max: 200, step: 5 },
    segmentLength: { value: 100, min: 50, max: 200, step: 10 },
    addSegmentDistance: { value: 1000, min: 50, max: 1000, step: 50 },
    removeSegmentDistance: { value: 100, min: 50, max: 200, step: 10 },
    roadFrequency: { value: 1, min: 1, max: 10, step: 1 },
    archFrequency: { value: 2, min: 1, max: 10, step: 1 },
    signFrequency: { value: 5, min: 1, max: 20, step: 1 },
  });

  const groupRef = useRef();
  const lastSegmentIdRef = useRef(1);

  const [segments, setSegments] = useState([{ id: 1, position: [0, 0, 0] }]);

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

      if (firstSegmentWorldZ > removeSegmentDistance) {
        return prevSegments.slice(1);
      }

      return prevSegments;
    });
  });

  return (
    <group ref={groupRef}>
      {segments.map(segment => (
        <group key={segment.id} position={segment.position}>
          {segment.id % roadFrequency === 0 && <RoadSegment id={segment.id} />}
          {segment.id % archFrequency === 0 && <BrutalistArch />}
          {/* Future additions */}
          {/* {segment.id % signFrequency === 0 && <Sign />} */}
        </group>
      ))}
    </group>
  );
}