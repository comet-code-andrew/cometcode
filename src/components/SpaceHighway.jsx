import React, {useState, useRef, useCallback, useMemo} from 'react';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import * as THREE from 'three';
import {SpotLight, Text} from '@react-three/drei';

// BrutalistArch component
const BrutalistArch = React.memo(({ roadWidth }) => {
  const {
    pillarHeight,
    pillarDepth,
    pillarThickness,
    topBeamThickness,
    topBeamDepth,
    angleHeight,
    angleWidth,
    emissiveIntensity,
    rectIntensity,
  } = useControls('Space Highway.Brutalist Arch', {
    pillarHeight: { value: 12, min: 5, max: 30, step: 1 },
    pillarDepth: { value: 1, min: 0.5, max: 5, step: 0.1 },
    pillarThickness: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    topBeamThickness: { value: 1, min: 0.5, max: 3, step: 0.1 },
    topBeamDepth: { value: 5, min: 1, max: 20, step: 0.5 },
    angleHeight: { value: 2, min: 1, max: 15, step: 0.1 },
    angleWidth: { value: 5, min: 1, max: 20, step: 0.1 },
    emissiveIntensity: { value: 2, min: 0, max: 5, step: 0.1 },
    rectIntensity: { value: 5, min: 0, max: 20, step: 0.1 },
  }, { collapsed: true });

  // Use roadWidth directly instead of archWidth
  const archWidth = roadWidth;
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
        color="#ff8c00"
        position={[0, totalHeight - (topBeamThickness / 2), 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
});

const WallMarker = React.memo(({ position, rotation, width, height, depth, color }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  );
});

// RoadSegment component
const RoadSegment = React.memo(({ width }) => {
  const {
    roadColor,
    wallHeight,
    wallThickness,
    markerColor,
    markerSpacing,
    markerWidth,
    markerHeight,
  } = useControls('Space Highway.Road Segment', {
    roadColor: '#4a4a4a',
    wallHeight: { value: 1, min: 0, max: 5, step: 0.1 },
    wallThickness: { value: 0.1, min: 0.05, max: 0.5, step: 0.01 },
    markerColor: '#ffff00',
    markerSpacing: { value: 5, min: 1, max: 20, step: 0.5 },
    markerWidth: { value: 0.1, min: 0.05, max: 0.5, step: 0.01 },
    markerHeight: { value: 0.5, min: 0.1, max: 1, step: 0.05 },
  }, { collapsed: true });

  const mainRoad = useMemo(() => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, 100]} />
      <meshStandardMaterial color={roadColor} />
    </mesh>
  ), [width, roadColor]);

  const createWall = useCallback((isLeft) => {
    const xPosition = isLeft ? -width/2 : width/2;
    return (
      <mesh position={[xPosition, wallHeight / 2, 0]}>
        <boxGeometry args={[wallThickness, wallHeight, 100]} />
        <meshStandardMaterial color={roadColor} />
      </mesh>
    );
  }, [width, wallHeight, wallThickness, roadColor]);

  const createWallMarkers = useCallback((isLeft) => {
    const markers = [];
    const xPosition = isLeft ? -width/2 - wallThickness/2 : width/2 + wallThickness/2;
    const zOffset = -50; // Start from the beginning of the segment
    const markerCount = Math.floor(100 / markerSpacing);

    for (let i = 0; i < markerCount; i++) {
      markers.push(
        <WallMarker
          key={`wall-marker-${isLeft ? 'left' : 'right'}-${i}`}
          position={[xPosition, wallHeight/2, zOffset + i * markerSpacing]}
          rotation={[0, isLeft ? Math.PI/2 : -Math.PI/2, 0]}
          width={markerHeight}
          height={markerHeight}
          depth={markerWidth}
          color={markerColor}
        />
      );
    }

    return markers;
  }, [width, wallHeight, wallThickness, markerSpacing, markerWidth, markerHeight, markerColor]);

  return (
    <group>
      {mainRoad}
      {createWall(true)}
      {createWall(false)}
      {createWallMarkers(true)}
      {createWallMarkers(false)}
    </group>
  );
});

const RoadMarker = React.memo(({ position }) => {
  const {
    markerLength,
    markerWidth,
    markerColor,
    emissiveIntensity,
  } = useControls('Space Highway.Road Marker', {
    markerLength: { value: 10, min: 5, max: 30, step: 1 },
    markerWidth: { value: 0.5, min: 0.1, max: 2, step: 0.1 },
    markerColor: '#00ffff',
    emissiveIntensity: { value: 2, min: 0, max: 10, step: 0.1 },
  });

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[markerWidth, 0.1, markerLength]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
});




const PostLights = React.memo(({ roadWidth }) => {
  const {
    power, distance, angle, penumbra,
    attenuation, anglePower, decay,
    enableShadows, cullingDistance,
    postHeight, postCount
  } = useControls('Post Lights', {
    power: { value: 500, min: 0, max: 1000, step: 1 },
    distance: { value: 30, min: 1, max: 100, step: 0.5 },
    angle: { value: 0.5, min: 0, max: Math.PI / 2, step: 0.01 },
    penumbra: { value: 0.3, min: 0, max: 1, step: 0.1 },
    attenuation: { value: 10, min: 1, max: 10, step: 0.1 },
    anglePower: { value: 8, min: 1, max: 8, step: 0.1 },
    decay: { value: 2, min: 0, max: 5, step: 0.1 },
    enableShadows: { value: false },
    cullingDistance: { value: 100, min: 10, max: 500, step: 10 },
    postHeight: { value: 6, min: 1, max: 10, step: 0.5 },
    postCount: { value: 3, min: 1, max: 10, step: 1 },
  });

  const lightRefs = useRef([]);

  useFrame(state => {
    lightRefs.current.forEach((light, index) => {
      if (light) {
        const worldPosition = new THREE.Vector3();
        light.getWorldPosition(worldPosition);
        const distanceToCamera = worldPosition.distanceTo(state.camera.position);

        light.intensity = distanceToCamera < cullingDistance ? power / postCount : 0;
      }
    });
  });

  return (
    <group>
      {Array.from({length: postCount}).map((_, index) => {
        const z = (index / (postCount - 1) - 0.5) * 100;
        const lightTarget = new THREE.Object3D();
        lightTarget.position.set(-roadWidth/2, 0, 0);

        return (
          <group key={index} position={[roadWidth / 2, 0, z]}>
            <mesh position={[0, postHeight / 2, 0]}>
              <boxGeometry args={[0.2, postHeight, 0.2]}/>
              <meshStandardMaterial color="white"/>
            </mesh>
            <primitive object={lightTarget} />
            <SpotLight
              ref={el => lightRefs.current[index] = el}
              position={[0, postHeight, 0]}
              target={lightTarget}
              angle={angle}
              penumbra={penumbra}
              power={power / postCount}
              distance={distance}
              attenuation={attenuation}
              anglePower={anglePower}
              color="white"
              castShadow={enableShadows}
              decay={decay}
            />
          </group>
        );
      })}
    </group>
  );
});

// Main SpaceHighway component
// In SpaceHighway component:
export function SpaceHighway() {

  const {
    speed,
    segmentLength,
    addSegmentDistance,
    removeSegmentDistance,
    roadFrequency,
    archFrequency,
    markerFrequency,
    roadWidth,
  } = useControls('Space Highway', {
    speed: { value: 20, min: 0, max: 1000, step: 5 },
    segmentLength: { value: 100, min: 50, max: 200, step: 10 },
    addSegmentDistance: { value: 1000, min: 50, max: 1000, step: 50 },
    removeSegmentDistance: { value: 100, min: 50, max: 200, step: 10 },
    roadFrequency: { value: 1, min: 1, max: 10, step: 1 },
    archFrequency: { value: 2, min: 1, max: 10, step: 1 },
    markerFrequency: { value: 5, min: 1, max: 20, step: 1 },
    roadWidth: { value: 200, min: 10, max: 500, step: 1 },
  }, { collapsed: true });  // This collapses the main folder

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
          {segment.id % roadFrequency === 0 && <RoadSegment width={roadWidth} />}
          {segment.id % archFrequency === 0 && <BrutalistArch roadWidth={roadWidth} />}
          <RoadMarker
            position={[
              segment.id % 2 === 0
                ? (roadWidth/2 - 0.25)    // Right side for even IDs
                : -(roadWidth/2 - 0.25),  // Left side for odd IDs
              0.1,
              0
            ]}
          />
        </group>
      ))}
    </group>
  );
}