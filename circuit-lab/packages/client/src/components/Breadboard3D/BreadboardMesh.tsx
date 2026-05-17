import { useMemo } from 'react';
import * as THREE from 'three';

const COLUMNS = 30;
const ROWS = 10;
const PITCH = 0.5;
const HOLE_RADIUS = 0.045;
const HOLE_DEPTH = 0.15;
const BOARD_WIDTH = COLUMNS * PITCH + 0.6;
const BOARD_DEPTH = ROWS * PITCH + 1.0;
const BOARD_HEIGHT = 0.35;
const RAIL_WIDTH = 0.35;
const CENTER_GAP = 2;

export function BreadboardMesh() {
  const holes = useMemo(() => {
    const result: any[] = [];
    const halfCols = COLUMNS / 2;
    for (let row = 0; row < ROWS; row++) {
      const z = (row - ROWS / 2 + 0.5) * PITCH;
      for (let col = 0; col < COLUMNS; col++) {
        let x = ((col - COLUMNS / 2) + 0.5) * PITCH;
        const isPower = col < 5 || col >= COLUMNS - 5;
        const isUpper = row < 5;
        const isLower = row >= 5;
        result.push({
          x,
          z: row < 5 ? z - CENTER_GAP * 0.5 * PITCH : z + CENTER_GAP * 0.5 * PITCH,
          row,
          col,
          isPower,
          connected: !isPower && (isUpper || isLower) && col >= 5 && col < COLUMNS - 5,
        });
      }
    }
    return result;
  }, []);

  const bodyColor = '#f5f0e8';
  const bodyRoughness = 0.85;
  const metalColor = '#c0bdb8';
  const metalRoughness = 0.3;

  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[BOARD_WIDTH, BOARD_HEIGHT, BOARD_DEPTH]} />
        <meshStandardMaterial color={bodyColor} roughness={bodyRoughness} metalness={0} />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[BOARD_WIDTH - 0.2, 0.02, BOARD_DEPTH - 0.2]} />
        <meshStandardMaterial color="#e8e3d8" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[BOARD_WIDTH - 0.6, 0.015, 0.08]} />
        <meshStandardMaterial color="#d8d3c8" roughness={0.8} />
      </mesh>

      <mesh position={[-BOARD_WIDTH * 0.5 + RAIL_WIDTH * 0.5 + 0.15, 0.05, 0]}>
        <boxGeometry args={[RAIL_WIDTH, BOARD_HEIGHT - 0.05, BOARD_DEPTH - 0.4]} />
        <meshStandardMaterial color="#ffcccc" roughness={0.7} />
      </mesh>
      <mesh position={[BOARD_WIDTH * 0.5 - RAIL_WIDTH * 0.5 - 0.15, 0.05, 0]}>
        <boxGeometry args={[RAIL_WIDTH, BOARD_HEIGHT - 0.05, BOARD_DEPTH - 0.4]} />
        <meshStandardMaterial color="#cce0ff" roughness={0.7} />
      </mesh>

      <mesh position={[-BOARD_WIDTH * 0.5 + RAIL_WIDTH * 0.5 + 0.15, 0.22, 0]}>
        <boxGeometry args={[RAIL_WIDTH - 0.1, 0.02, BOARD_DEPTH - 0.6]} />
        <meshStandardMaterial color="#ff6666" roughness={0.5} />
      </mesh>
      <mesh position={[BOARD_WIDTH * 0.5 - RAIL_WIDTH * 0.5 - 0.15, 0.22, 0]}>
        <boxGeometry args={[RAIL_WIDTH - 0.1, 0.02, BOARD_DEPTH - 0.6]} />
        <meshStandardMaterial color="#6699ff" roughness={0.5} />
      </mesh>

      {['+', '–', '+', '–'].map((label, i) => {
        const side = i < 2 ? -1 : 1;
        const zOff = i % 2 === 0 ? -1 : 1;
        return (
          <mesh key={`power-label-${i}`} position={[side * (BOARD_WIDTH * 0.5 - 0.3), 0.3, zOff * (BOARD_DEPTH * 0.5 - 0.4)]}>
            <boxGeometry args={[0.12, 0.04, 0.12]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff6666' : '#6699ff'} />
          </mesh>
        );
      })}

      {holes.map((hole, i) => {
        const inPowerRail = hole.col < 5 || hole.col >= COLUMNS - 5;
        const inLeftRail = hole.col < 5;
        const inRightRail = hole.col >= COLUMNS - 5;
        const connected = !inPowerRail && hole.col >= 5 && hole.col < COLUMNS - 5;

        return (
          <group key={`hole-${i}`}>
            <mesh position={[hole.x, 0.24, hole.z]}>
              <cylinderGeometry args={[HOLE_RADIUS + 0.015, HOLE_RADIUS + 0.02, 0.02, 12]} />
              <meshStandardMaterial color="#d0ccc4" roughness={0.6} />
            </mesh>
            <mesh position={[hole.x, 0.22, hole.z]}>
              <cylinderGeometry args={[HOLE_RADIUS, HOLE_RADIUS * 1.1, HOLE_DEPTH, 12]} />
              <meshStandardMaterial
                color={
                  inLeftRail ? '#d0a0a0' :
                  inRightRail ? '#a0b0d0' :
                  metalColor
                }
                metalness={0.4}
                roughness={metalRoughness}
              />
            </mesh>
            {connected && (
              <mesh position={[hole.x, 0.22, hole.z]}>
                <cylinderGeometry args={[HOLE_RADIUS * 0.4, HOLE_RADIUS * 0.4, HOLE_DEPTH * 0.6, 6]} />
                <meshStandardMaterial color="#b0aaa5" metalness={0.6} roughness={0.2} />
              </mesh>
            )}
          </group>
        );
      })}

      {Array.from({ length: 5 }, (_, i) => {
        const z = (i - 2) * PITCH - CENTER_GAP * 0.5 * PITCH - 0.1;
        const label = String.fromCharCode(65 + i);
        return (
          <mesh key={`row-label-top-${i}`} position={[-BOARD_WIDTH * 0.5 + 0.2, 0.32, z]}>
            <boxGeometry args={[0.06, 0.03, 0.06]} />
            <meshBasicMaterial color="#999999" />
          </mesh>
        );
      })}
      {Array.from({ length: 5 }, (_, i) => {
        const z = (i - 2) * PITCH + CENTER_GAP * 0.5 * PITCH + 0.1;
        const label = String.fromCharCode(70 + i);
        return (
          <mesh key={`row-label-bot-${i}`} position={[-BOARD_WIDTH * 0.5 + 0.2, 0.32, z]}>
            <boxGeometry args={[0.06, 0.03, 0.06]} />
            <meshBasicMaterial color="#999999" />
          </mesh>
        );
      })}

      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={`col-label-${i}`} position={[((i * 3 + 1) - COLUMNS / 2) * PITCH, 0.32, -BOARD_DEPTH * 0.5 + 0.15]}>
          <boxGeometry args={[0.1, 0.03, 0.06]} />
          <meshBasicMaterial color="#999999" />
        </mesh>
      ))}

      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[BOARD_WIDTH - 1.0, 0.01, 0.06]} />
        <meshStandardMaterial color="#d0ccc4" roughness={0.7} />
      </mesh>
    </group>
  );
}
