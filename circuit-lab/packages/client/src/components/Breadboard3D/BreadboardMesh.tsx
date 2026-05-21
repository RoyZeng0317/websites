import { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox, Text } from '@react-three/drei';

const COLUMNS = 30;
const ROWS = 10;
const PITCH = 0.5;
const HOLE_RADIUS = 0.07;
const BOARD_WIDTH = COLUMNS * PITCH + 0.6;
const BOARD_DEPTH = ROWS * PITCH + 1.0;
const BOARD_HEIGHT = 0.35;
const RAIL_WIDTH = 0.35;
const CENTER_GAP = 2;
const BOARD_TOP = BOARD_HEIGHT / 2;

export function BreadboardMesh() {
  const holes = useMemo(() => {
    const result: any[] = [];
    for (let row = 0; row < ROWS; row++) {
      const z = (row - ROWS / 2 + 0.5) * PITCH;
      for (let col = 0; col < COLUMNS; col++) {
        const x = ((col - COLUMNS / 2) + 0.5) * PITCH;
        result.push({
          x,
          z: row < 5 ? z - CENTER_GAP * 0.5 * PITCH : z + CENTER_GAP * 0.5 * PITCH,
          row,
          col,
        });
      }
    }
    return result;
  }, []);

  return (
    <group>
      <RoundedBox args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH]} radius={0.08} smoothness={4} receiveShadow castShadow>
        <meshStandardMaterial color="#e6dbc5" roughness={0.85} metalness={0} />
      </RoundedBox>

      <mesh position={[0, BOARD_TOP - 0.01, 0]}>
        <boxGeometry args={[BOARD_WIDTH - 1.5, 0.006, 0.04]} />
        <meshStandardMaterial color="#b8ad98" roughness={0.8} />
      </mesh>

      <RoundedBox args={[RAIL_WIDTH, BOARD_HEIGHT - 0.06, BOARD_DEPTH - 0.4]} radius={0.03} smoothness={3} position={[-BOARD_WIDTH * 0.5 + RAIL_WIDTH * 0.5 + 0.15, -0.03, 0]}>
        <meshStandardMaterial color="#e6dbc5" roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[RAIL_WIDTH, BOARD_HEIGHT - 0.06, BOARD_DEPTH - 0.4]} radius={0.03} smoothness={3} position={[BOARD_WIDTH * 0.5 - RAIL_WIDTH * 0.5 - 0.15, -0.03, 0]}>
        <meshStandardMaterial color="#e6dbc5" roughness={0.8} />
      </RoundedBox>

      <mesh position={[-BOARD_WIDTH * 0.5 + RAIL_WIDTH * 0.5 + 0.15, BOARD_TOP - 0.01, 0]}>
        <boxGeometry args={[RAIL_WIDTH - 0.08, 0.006, BOARD_DEPTH - 0.6]} />
        <meshStandardMaterial color="#f0c0c0" roughness={0.6} />
      </mesh>
      <mesh position={[BOARD_WIDTH * 0.5 - RAIL_WIDTH * 0.5 - 0.15, BOARD_TOP - 0.01, 0]}>
        <boxGeometry args={[RAIL_WIDTH - 0.08, 0.006, BOARD_DEPTH - 0.6]} />
        <meshStandardMaterial color="#b0c8e8" roughness={0.6} />
      </mesh>

      {['+', '–', '+', '–'].map((label, i) => (
        <group key={`power-label-${i}`}>
          <mesh position={[i < 2 ? -BOARD_WIDTH * 0.5 + 0.3 : BOARD_WIDTH * 0.5 - 0.3, BOARD_TOP + 0.001, i % 2 === 0 ? -BOARD_DEPTH * 0.5 + 0.4 : BOARD_DEPTH * 0.5 - 0.4]}>
            <planeGeometry args={[0.1, 0.1]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#cc6060' : '#6088cc'} transparent opacity={0.8} />
          </mesh>
        </group>
      ))}

      {holes.map((hole, i) => {
        const inLeftRail = hole.col < 5;
        const inRightRail = hole.col >= COLUMNS - 5;
        const connected = !(inLeftRail || inRightRail);

        return (
          <group key={`hole-${i}`}>
            <mesh position={[hole.x, BOARD_TOP + 0.001, hole.z]} renderOrder={1}>
              <circleGeometry args={[HOLE_RADIUS, 16]} />
              <meshBasicMaterial color="#1a1a1a" depthWrite={false} />
            </mesh>
            {connected && (
              <mesh position={[hole.x, BOARD_TOP + 0.0015, hole.z]} renderOrder={2}>
                <circleGeometry args={[HOLE_RADIUS * 0.3, 8]} />
                <meshBasicMaterial color="#c8c0b0" depthWrite={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {Array.from({ length: 5 }, (_, i) => {
        const z = (i - 2) * PITCH - CENTER_GAP * 0.5 * PITCH - 0.1;
        return (
          <Text key={`row-top-${i}`} position={[-BOARD_WIDTH * 0.5 + 0.2, BOARD_TOP + 0.002, z]} fontSize={0.06} color="#888" anchorX="center" anchorY="middle" renderOrder={3}>
            {String.fromCharCode(65 + i)}
          </Text>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const z = (i - 2) * PITCH + CENTER_GAP * 0.5 * PITCH + 0.1;
        return (
          <Text key={`row-bot-${i}`} position={[-BOARD_WIDTH * 0.5 + 0.2, BOARD_TOP + 0.002, z]} fontSize={0.06} color="#888" anchorX="center" anchorY="middle" renderOrder={3}>
            {String.fromCharCode(70 + i)}
          </Text>
        );
      })}

      {Array.from({ length: 10 }, (_, i) => (
        <Text key={`col-${i}`} position={[((i * 3 + 1) - COLUMNS / 2) * PITCH, BOARD_TOP + 0.002, -BOARD_DEPTH * 0.5 + 0.15]} fontSize={0.06} color="#888" anchorX="center" anchorY="middle" renderOrder={3}>
          {(i * 3 + 1).toString()}
        </Text>
      ))}
    </group>
  );
}
