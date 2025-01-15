import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import { useFrame } from '@react-three/fiber';
import {folder, useControls} from 'leva';
import * as THREE from 'three';
import {SpotLight, Text} from '@react-three/drei';
import {Bloom, EffectComposer, SelectiveBloom} from "@react-three/postprocessing";

import { BlendFunction } from 'postprocessing'
import { Billboard } from '@react-three/drei';


// Add this near the top of your file with other imports

// Create a reusable texture for all halos
// const haloTexture = (() => {
//   const canvas = document.createElement('canvas');
//   canvas.width = 32;
//   canvas.height = 32;
//   const context = canvas.getContext('2d');
//   const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
//   gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
//   gradient.addColorStop(0.5, 'rgba(255, 0, 0, 0.5)');
//   gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
//   context.fillStyle = gradient;
//   context.fillRect(0, 0, 32, 32);
//   const texture = new THREE.CanvasTexture(canvas);
//   return texture;
// })();

const BLOOM_LAYER = 1;
const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);

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
    emissiveIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
    rectIntensity: { value: 30, min: 0, max: 50, step: 0.1 },
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
          color="#E7CF6A"
          emissive="#E7CF6A"
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* RectAreaLight */}
      <rectAreaLight
        width={archWidth - (angleWidth * 2)}
        height={topBeamDepth}
        intensity={rectIntensity}
        color="#E7CF6A"
        position={[0, totalHeight - (topBeamThickness / 2), 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
});

const WallMarker = React.memo(({ position, rotation, isLeft }) => { // Added isLeft prop
  const {
    markerColor,
    chevronSize,
    chevronThickness,
    emissiveIntensity,
  } = useControls('Space Highway.Wall Marker', {
    markerColor: '#ffff00',
    chevronSize: { value: 0.3, min: 0.1, max: 2, step: 0.05 },
    chevronThickness: { value: 0.05, min: 0.01, max: 0.5, step: 0.01 }, // Increased max thickness
    emissiveIntensity: { value: 0.5, min: 0, max: 2, step: 0.1 },
  }, { collapsed: true });

  // Flip the rotation for right side
  const rotationModifier = isLeft ? 1 : -1;

  return (
    <group position={position} rotation={rotation}>
      {/* Upper leg of chevron */}
      <mesh position={[0, chevronSize/2, 0]} rotation={[0, 0, (Math.PI/4) * rotationModifier]}>
        <boxGeometry args={[chevronThickness, chevronSize, chevronThickness]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      {/* Lower leg of chevron */}
      <mesh position={[0, -chevronSize/2, 0]} rotation={[0, 0, (-Math.PI/4) * rotationModifier]}>
        <boxGeometry args={[chevronThickness, chevronSize, chevronThickness]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
});
const LaneMarkers = React.memo(({ roadWidth }) => {
  const {
    lineLength,
    lineSpacing,
    horizontalOffset,
    verticalSpacing,
    lineWidth,
    neonColor,
    emissiveIntensity,
  } = useControls('Space Highway.Lane Markers', {
    pattern: folder({
      lineLength: { value: 20, min: 1, max: 50, step: 1, label: 'Line Length' },
      lineSpacing: { value: 50, min: 1, max: 50, step: 0.5, label: 'Vertical Spacing' },
      horizontalOffset: { value: 8, min: 0, max: 20, step: 0.5, label: 'Horizontal Offset' },
      verticalSpacing: { value: 50, min: 5, max: 100, step: 1, label: 'Pattern Spacing' },
    }),
    appearance: folder({
      lineWidth: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Line Width' },
      neonColor: { value: '#00ffff', label: 'Neon Color' },
      emissiveIntensity: { value: 5, min: 0, max: 20, step: 0.1, label: 'Glow Intensity' },
    })
  }, { collapsed: true });

  const lines = useMemo(() => {
    const pattern = [];
    pattern.push({ position: [-horizontalOffset, 0.1, 0] });
    pattern.push({ position: [horizontalOffset, 0.1, lineSpacing] });
    return pattern;
  }, [horizontalOffset, lineSpacing]);

  return (
    <group>
      {lines.map((line, index) => (
        <group key={index} position={line.position}>
          <mesh>
            <boxGeometry args={[lineWidth, 0.1, lineLength]} />
            <meshStandardMaterial
              color={neonColor}
              emissive={neonColor}
              emissiveIntensity={emissiveIntensity}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
});
const WallLight = React.memo(({ position }) => {
  const {
    lightColor,
    lightSize,
    emissiveIntensity,
    stickHeight,
    stickWidth,
  } = useControls('Space Highway.Wall Lights', {
    lightColor: '#ff0000',
    lightSize: { value: 0.2, min: 0.05, max: 0.5, step: 0.01 },
    emissiveIntensity: { value: 3, min: 0, max: 10, step: 0.1 },
    stickHeight: { value: 1, min: 0.1, max: 3, step: 0.1 },
    stickWidth: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
  }, { collapsed: true });

  return (
    <group position={position}>
      {/* The stick */}
      <mesh position={[0, stickHeight/2, 0]}>
        <boxGeometry args={[stickWidth, stickHeight, stickWidth]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* The light bulb */}
      <mesh position={[0, stickHeight + lightSize/2, 0]}>
        <sphereGeometry args={[lightSize, 16, 16]} />
        <meshStandardMaterial
          color={lightColor}
          emissive={lightColor}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
});

const RoadSegment = React.memo(({ width }) => {
  const {
    roadColor,
    wallHeight,
    wallThickness,
    markerSpacing,
    lightSpacing,  // New control for light spacing

  } = useControls('Space Highway.Road Segment', {
    roadColor: '#4a4a4a',
    wallHeight: { value: 10, min: 5, max: 20, step: 0.5 },
    wallThickness: { value: 0.1, min: 0.05, max: 0.5, step: 0.01 },
    markerSpacing: { value: 40, min: 5, max: 200, step: 5 }, // Increased max spacing
    lightSpacing: { value: 10, min: 1, max: 50, step: 1 },  // Added this
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
    const zOffset = -50;
    const markerCount = Math.floor(100 / markerSpacing);

    for (let i = 0; i < markerCount; i++) {
      markers.push(
        <WallMarker
          key={`wall-marker-${isLeft ? 'left' : 'right'}-${i}`}
          position={[xPosition, wallHeight/2, zOffset + i * markerSpacing]}
          rotation={[0, isLeft ? Math.PI/2 : -Math.PI/2, 0]}
          isLeft={isLeft}  // Pass isLeft prop
        />
      );
    }

    return markers;
  }, [width, wallHeight, wallThickness, markerSpacing]);

  const createWallLights = useCallback((isLeft) => {
    const lights = [];
    const xPosition = isLeft ? -width/2 : width/2;
    const yPosition = wallHeight;
    const zOffset = -50;
    const lightCount = Math.floor(100 / lightSpacing);

    for (let i = 0; i < lightCount; i++) {
      lights.push(
        <WallLight
          key={`wall-light-${isLeft ? 'left' : 'right'}-${i}`}
          position={[xPosition, yPosition, zOffset + i * lightSpacing]}
        />
      );
    }

    return lights;
  }, [width, wallHeight, lightSpacing]);

  return (
    <group>
      {mainRoad}
      {createWall(true)}
      {createWall(false)}
      {createWallMarkers(true)}
      {createWallMarkers(false)}
      {createWallLights(true)}
      {createWallLights(false)}
    </group>
  );
});

const usePostLightControls = () => useControls('Space Highway.Post Lights', {
  power: {value: 5000, min: 0, max: 10000, step: 100},
  distance: {value: 300, min: 1, max: 1000, step: 5},     // Increased for longer reach
  angle: { value: 0.6, min: 0, max: Math.PI / 2, step: 0.01 }, // Adjusted for better road coverage
  penumbra: { value: 0.7, min: 0, max: 1, step: 0.1 },      // Softer edges
  attenuation: { value: 1.5, min: 1, max: 10, step: 0.1 },  // Adjusted for better falloff
  anglePower: { value: 3, min: 1, max: 8, step: 0.1 },      // Adjusted for softer spot
  decay: { value: 1, min: 0, max: 5, step: 0.1 },           // Less decay for farther reach
  enableShadows: { value: true },
  cullingDistance: { value: 800, min: 10, max: 2000, step: 10 }, // Increased for visibility
  postHeight: { value: 100, min: 10, max: 200, step: 1 },
  postWidth: { value: 4, min: 0.2, max: 10, step: 0.1 },
  speedRatio: { value: 0.25, min: 0.1, max: 1, step: 0.05 },
  diskSize: { value: 1, min: 0.1, max: 5, step: 0.1 },
  diskOpacity: { value: 0.8, min: 0, max: 1, step: 0.1 },
});

const PostLights = React.memo(({ roadWidth, controls }) => {
  const lightRef = useRef();

  useFrame(state => {
    if (lightRef.current) {
      const worldPosition = new THREE.Vector3();
      lightRef.current.getWorldPosition(worldPosition);
      const distanceToCamera = worldPosition.distanceTo(state.camera.position);

      lightRef.current.intensity = distanceToCamera < controls.cullingDistance ? controls.power : 0;
    }
  });

  const lightTarget = new THREE.Object3D();
  lightTarget.position.set(-roadWidth/2, 0, 0);

  return (
    <group>
      <group position={[roadWidth / 2, 0, 0]}>
        {/* Post */}
        <mesh position={[0, controls.postHeight / 2, 0]}>
          <boxGeometry args={[controls.postWidth, controls.postHeight, controls.postWidth]}/>
          <meshStandardMaterial color="white"/>
        </mesh>

        {/* Light Target */}
        <primitive object={lightTarget} position={[-roadWidth/2, 0, 0]} />

        {/* Light Disk */}
        <mesh
          position={[-controls.postWidth/2 - 2, controls.postHeight, 0]}
          rotation={[0, -Math.PI/2, 0]} // Rotate to face the road
        >
          <circleGeometry args={[controls.diskSize, 32]}/>
          <meshBasicMaterial
            color="white"
            transparent
            opacity={controls.diskOpacity}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>

        {/* SpotLight */}
        <SpotLight
          ref={lightRef}
          position={[-controls.postWidth/2 - 2, controls.postHeight, 0]}
          target={lightTarget}
          angle={controls.angle}
          penumbra={controls.penumbra}
          power={controls.power}
          distance={controls.distance}
          attenuation={controls.attenuation}
          anglePower={controls.anglePower}
          color="red"
          castShadow={controls.enableShadows}
          decay={controls.decay}
        />
      </group>
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
    lineFrequency,
    roadWidth,
  } = useControls('Space Highway', {
    speed: { value: 0, min: 0, max: 1000, step: 5 },
    segmentLength: { value: 100, min: 50, max: 200, step: 10 },
    addSegmentDistance: { value: 1000, min: 50, max: 1000, step: 50 },
    removeSegmentDistance: { value: 100, min: 50, max: 200, step: 10 },
    roadFrequency: { value: 1, min: 1, max: 10, step: 1 },
    archFrequency: { value: 8, min: 1, max: 20, step: 1 },
    lineFrequency: { value: 3, min: 1, max: 20, step: 1 }, // renamed
    roadWidth: { value: 100, min: 10, max: 500, step: 1 },
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

  const postLightsGroupRef = useRef()
  const postLightControls = usePostLightControls();
  const [postLightSegments, setPostLightSegments] = useState([{ id: 1, position: [0, 0, -100] }]);
  const addPostLightSegment = useCallback(() => {
    const newSegmentId = postLightSegments.length + 1;
    setPostLightSegments(prev => {
      const lastSegment = prev[prev.length - 1];
      return [
        ...prev,
        {
          id: newSegmentId,
          position: [0, 0, lastSegment.position[2] - (segmentLength * 4)] // Increased spacing
        }
      ];
    });
  }, [segmentLength]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    const postLightsGroup = postLightsGroupRef.current;

    if (!group || !postLightsGroupRef) return;

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

    postLightsGroup.position.z += (speed * postLightControls.speedRatio) * delta;
    const lastPostLightSegment = postLightSegments[postLightSegments.length - 1];
    const lastPostLightWorldZ = lastPostLightSegment.position[2] + postLightsGroup.position.z;
    if (lastPostLightWorldZ > -addSegmentDistance) {
      addPostLightSegment();
    }
    setPostLightSegments(prev => {
      const firstSegment = prev[0];
      const firstSegmentWorldZ = firstSegment.position[2] + postLightsGroup.position.z;

      if (firstSegmentWorldZ > removeSegmentDistance) {
        return prev.slice(1);
      }
      return prev;
    });
  });

  const fogParams = useControls('Space Highway.Fog', {
    fogColor: { value: '#000000' },
    fogNear: { value: 50, min: 1, max: 200, step: 1 },
    fogFar: { value: 1000, min: 100, max: 2000, step: 10 },
  }, { collapsed: true });

  return (
    <>
      <fog
        attach="fog"
        color={fogParams.fogColor}
        near={fogParams.fogNear}
        far={fogParams.fogFar}
      />
      <group ref={groupRef}>
        {segments.map(segment => (
          <group key={segment.id} position={segment.position}>
            {segment.id % roadFrequency === 0 && <RoadSegment width={roadWidth}/>}
            {segment.id % archFrequency === 0 && <BrutalistArch roadWidth={roadWidth}/>}
            {segment.id % lineFrequency === 0 && <LaneMarkers roadWidth={roadWidth}/>}


          </group>
        ))}
      </group>

      <group ref={postLightsGroupRef}>
        {postLightSegments.map(segment => (
          <group key={`postlight-${segment.id}`} position={segment.position}>
            <PostLights roadWidth={roadWidth * 4} controls={postLightControls}/>
          </group>
        ))}
      </group>

      {/*<EffectComposer>*/}
      {/*  <Bloom*/}
      {/*    mipmapBlur={bloomParams.bloomMipmapBlur}*/}
      {/*    intensity={bloomParams.bloomIntensity}*/}
      {/*    luminanceThreshold={bloomParams.bloomThreshold}*/}
      {/*    luminanceSmoothing={0.9}*/}
      {/*    radius={bloomParams.bloomRadius}*/}
      {/*  />*/}
      {/*</EffectComposer>*/}
    </>
  );
}