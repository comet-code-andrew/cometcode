import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useControls } from 'leva';
import * as THREE from 'three';
import { SpotLight, useHelper } from '@react-three/drei';
import {useFrame, useThree} from "@react-three/fiber";
import {SpotLightHelper } from "three";


export function SpaceHighway() {

  const {
    lightX, lightY, lightZ,
    intensity, distance, angle, penumbra,
    attenuation, anglePower
  } = useControls('Spot Light', {
    lightX: { value: -14, min: -50, max: 50, step: 1 },
    lightY: { value: 10, min: 0, max: 20, step: 1 },
    lightZ: { value: 0, min: -50, max: 50, step: 1 },
    intensity: { value: 500, min: 0, max: 1000, step: 1 },
    distance: { value: 30, min: 1, max: 40, step: 0.5 },
    angle: { value: .5, min: 0, max: Math.PI / 2, step: 0.01 },
    penumbra: { value: .3, min: 0, max: 1, step: 0.1 },
    attenuation: { value: 10, min: 1, max: 10, step: 0.1 },
    anglePower: { value: 8, min: 1, max: 8, step: 0.1 }
  });

  const { roadLength, roadWidth, postCount, postHeight } = useControls('Space Highway', {
    roadLength: { value: 1000, min: 100, max: 2000, step: 10 },
    roadWidth: { value: 100, min: 10, max: 50, step: 1 },
    postCount: { value: 3, min: 1, max: 50, step: 1 },
    postHeight: { value: 6, min: 1, max: 10, step: 0.5 },
  });




  const RoadSegment = ({ position }) => {


    return (
      <group position={position}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[roadWidth, roadLength]}/>
          <meshStandardMaterial color="gray"/>
        </mesh>

        {Array.from({length: postCount}).map((_, index) => {
          const z = (index / (postCount - 1) - 0.5) * roadLength;
          return (
            <group key={index} position={[roadWidth / 2, 0, z]}>
              <mesh position={[0, postHeight / 2, 0]}>
                <boxGeometry args={[0.2, postHeight, 0.2]}/>
                <meshStandardMaterial color="white"/>
              </mesh>
              <SpotLight
                position={[0, postHeight, 0]}
                angle={angle}
                penumbra={penumbra}
                intensity={intensity / postCount}
                distance={distance}
                attenuation={attenuation}
                anglePower={anglePower}
                color="white"
                castShadow
              />
            </group>
          );
        })}

      </group>
    );
  }

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



  // const spotLight = useRef()
  // useHelper(spotLight, SpotLightHelper)


  return (
    <group>

      {segmentRefs.map((ref, index) => (
        <group key={index} ref={ref} position={[0, 0, -roadLength * index]}>
          <RoadSegment position={[0, 0, 0]}/>
        </group>
      ))}



    </group>
  );
}

