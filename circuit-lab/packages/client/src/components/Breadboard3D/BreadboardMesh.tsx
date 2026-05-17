import { useMemo } from 'react';
import * as THREE from 'three';

export function BreadboardMesh() {
  const holes = useMemo(() => {
    const result: { x: number; z: number; row: number; col: number; isPower: boolean }[] = [];
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 30; col++) {
        const isPower = col < 5 || col >= 25;
        result.push({
          x: (col - 15) * 0.5,
          z: (row - 5) * 0.5 + 0.1,
          row,
          col,
          isPower,
        });
      }
    }
    return result;
  }, []);

  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[16, 0.4, 6]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} metalness={0} />
      </mesh>

      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[15.6, 0.05, 5.6]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.95} />
      </mesh>

      <mesh position={[-6.8, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.02, 5.6]} />
        <meshStandardMaterial color="#ff4444" roughness={0.5} />
      </mesh>
      <mesh position={[6.8, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.02, 5.6]} />
        <meshStandardMaterial color="#4488ff" roughness={0.5} />
      </mesh>

      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[15.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#d0d0d0" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.22, -2.4]}>
        <boxGeometry args={[14.5, 0.03, 0.08]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.22, 2.4]}>
        <boxGeometry args={[14.5, 0.03, 0.08]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>

      <mesh position={[0, 0.22, -2.75]}>
        <boxGeometry args={[15.5, 0.02, 0.06]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>
      <mesh position={[0, 0.22, 2.75]}>
        <boxGeometry args={[15.5, 0.02, 0.06]} />
        <meshStandardMaterial color="#bbbbbb" />
      </mesh>

      {['+', '–', '+', '–'].map((label, i) => {
        const xPos = i < 2 ? -7.4 : 7.4;
        const zPos = i % 2 === 0 ? 2.3 : -2.3;
        return (
          <mesh key={`label-${i}`} position={[xPos, 0.4, zPos]}>
            <boxGeometry args={[0.15, 0.05, 0.1]} />
            <meshBasicMaterial color={i < 2 ? '#ff6666' : '#6699ff'} />
          </mesh>
        );
      })}

      {holes.map((hole, i) => {
        const isRedRail = hole.col < 5;
        const isBlueRail = hole.col >= 25;
        return (
          <mesh key={`hole-${i}`} position={[hole.x, 0.25, hole.z]}>
            <cylinderGeometry args={[0.045, 0.04, 0.12, 10]} />
            <meshStandardMaterial
              color={
                hole.col === 0 || hole.col === 29
                  ? '#ffaa00'
                  : isRedRail || isBlueRail
                    ? '#c0c0c0'
                    : '#d0d0c8'
              }
              metalness={isRedRail || isBlueRail ? 0.4 : 0.3}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {Array.from({ length: 30 }, (_, i) => {
        if (i % 5 !== 0) return null;
        const xPos = (i - 15) * 0.5;
        const colLabel = String(i + 1);
        return (
          <group key={`col-label-${i}`}>
            {[-2.8, 2.8].map((zPos) => (
              <mesh
                key={`${i}-${zPos}`}
                position={[xPos, 0.4, zPos]}
              >
                <boxGeometry args={[0.12, 0.04, 0.08]} />
                <meshBasicMaterial color="#888888" />
              </mesh>
            ))}
          </group>
        );
      })}

      {Array.from({ length: 10 }, (_, i) => {
        const zPos = (i - 5) * 0.5 + 0.1;
        const rowLabel = String.fromCharCode(65 + i);
        return (
          <group key={`row-label-${i}`}>
            {[-7.9, 7.9].map((xPos) => (
              <mesh
                key={`${i}-${xPos}`}
                position={[xPos, 0.4, zPos]}
              >
                <boxGeometry args={[0.08, 0.04, 0.08]} />
                <meshBasicMaterial color="#888888" />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}
