import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { SpotLight, useHelper } from '@react-three/drei';
import {useFrame, useThree} from "@react-three/fiber";
import {SpotLightHelper, RectAreaLight } from "three";


export function SpaceHighway() {

  const {
    lightX, lightY, lightZ,
    power, distance, angle, penumbra,
    attenuation, anglePower, decay,
    enableShadows, cullingDistance
  } = useControls('Spot Light', {
    lightX: { value: -14, min: -50, max: 50, step: 1 },
    lightY: { value: 10, min: 0, max: 20, step: 1 },
    lightZ: { value: 0, min: -50, max: 50, step: 1 },
    power: { value: 500, min: 0, max: 1000, step: 1 },
    distance: { value: 30, min: 1, max: 100, step: 0.5 },
    angle: { value: 0.5, min: 0, max: Math.PI / 2, step: 0.01 },
    penumbra: { value: 0.3, min: 0, max: 1, step: 0.1 },
    attenuation: { value: 10, min: 1, max: 10, step: 0.1 },
    anglePower: { value: 8, min: 1, max: 8, step: 0.1 },
    decay: { value: 2, min: 0, max: 5, step: 0.1 },
    enableShadows: { value: false },
    cullingDistance: { value: 100, min: 10, max: 500, step: 10 }
  });

  const { roadLength, roadWidth, postCount, postHeight } = useControls('Space Highway', {
    roadLength: { value: 1000, min: 100, max: 2000, step: 10 },
    roadWidth: { value: 100, min: 10, max: 50, step: 1 },
    postCount: { value: 3, min: 1, max: 50, step: 1 },
    postHeight: { value: 6, min: 1, max: 10, step: 0.5 },
  });

  const RoadSegment = ({ position }) => {
    const lightRefs = useRef([]);

    useFrame(state => {
      lightRefs.current.forEach((light, index) => {
        if (light) {
          const worldPosition = new THREE.Vector3();
          light.getWorldPosition(worldPosition);
          const distanceToCamera = worldPosition.distanceTo(state.camera.position);

          // Only enable lights within the culling distance
          light.intensity = distanceToCamera < cullingDistance ? power / postCount : 0;
        }
      });
    });

    return (
      <group position={position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[roadWidth, roadLength]}/>
          <meshStandardMaterial color="gray"/>
        </mesh>

        {Array.from({length: postCount}).map((_, index) => {
          const z = (index / (postCount - 1) - 0.5) * roadLength;
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
  }

  const {
    rectIntensity,
    planeWidth,
    planeHeight,
    planeHeight: planeDistance, // We'll use planeHeight as the distance from the cockpit
    planeEmissiveIntensity
  } = useControls('Light Plane', {
    rectIntensity: { value: 5, min: 0, max: 20, step: 0.1 },
    planeWidth: { value: roadWidth, min: roadWidth, max: roadWidth * 2, step: 1 }, // Set minimum to roadWidth
    planeHeight: { value: 12, min: 1, max: 20, step: 0.1 },
    planeEmissiveIntensity: { value: 1, min: 0, max: 5, step: 0.1 },
  });


  const speed = 200; // Adjust this value to change the speed of movement
  const segmentRefs = [useRef(), useRef(), useRef()];

  // Animates lightRefs and segmentRefs
  useFrame((state, delta) => {
    segmentRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.position.z += speed * delta;
        if (ref.current.position.z > roadLength * 1.5) {
          ref.current.position.z -= roadLength * 3;
        }
      }
    });
  });

  return (
    <group>
      {segmentRefs.map((ref, index) => (
        <group key={index} ref={ref} position={[0, 0, -roadLength * index]}>
          <RoadSegment position={[0, 0, 0]}/>
        </group>
      ))}

      {/* RectAreaLight */}
      <primitive
        object={new RectAreaLight(0xffffff, rectIntensity, planeWidth, planeHeight)}
        position={[0, 15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Add a plane to represent the light source */}
      <mesh position={[0, 15, planeDistance]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={planeEmissiveIntensity}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}