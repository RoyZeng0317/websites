import { useRef, useState } from 'react';
import * as THREE from 'three';
import type { PlacedComponent } from '@circuit-lab/shared';
import { COMPONENT_LIBRARY } from '@circuit-lab/simulator-core';
import { useCircuitStore } from '../../stores/circuitStore.js';

const componentColors: Record<string, string> = {
  resistor: '#cc6633',
  capacitor: '#4488cc',
  inductor: '#44aa66',
  diode: '#555555',
  led: '#ff2222',
  npn_transistor: '#7744aa',
  pnp_transistor: '#aa4477',
  mosfet_n: '#4488aa',
  mosfet_p: '#aa8844',
  battery: '#44cc44',
  arduino_uno: '#00979d',
  arduino_mega2560: '#008184',
  esp32: '#1fa854',
  esp32_s3: '#e85d26',
  raspberry_pi_pico: '#a8463a',
  raspberry_pi_pico_2w: '#8b3a2e',
  raspberry_pi_4: '#bc1142',
  raspberry_pi_5: '#005c99',
  push_button: '#cc4444',
  switch_spst: '#888888',
  seven_segment: '#222222',
  '555_timer': '#444444',
  op_amp: '#444466',
  and_gate: '#446688',
  or_gate: '#448866',
  nand_gate: '#884466',
  buzzer: '#666644',
  dc_motor: '#446666',
};

export function ComponentMesh({ component }: { component: PlacedComponent }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectedComponentId, selectComponent, removeComponent, simulationState } = useCircuitStore();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedComponentId === component.id;
  const def = COMPONENT_LIBRARY[component.type];
  const color = componentColors[component.type] ?? '#888888';

  const state = simulationState?.componentStates?.[component.id];
  const ledBrightness = component.type === 'led' ? (state?.brightness as number ?? 0) : 0;

  if (!def) return null;

  const size = def.size;

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectComponent(component.id);
  };

  const handleDoubleClick = () => {
    removeComponent(component.id);
  };

  const renderShape = () => {
    switch (component.type) {
      case 'resistor':
        return <ResistorShape size={size} color={color} />;
      case 'capacitor':
        return <CapacitorShape size={size} color={color} />;
      case 'inductor':
        return <InductorShape size={size} color={color} />;
      case 'led':
        return <LEDShape size={size} color={color} brightness={ledBrightness} />;
      case 'diode':
      case 'zener_diode':
        return <DiodeShape size={size} color={color} />;
      case 'npn_transistor':
      case 'pnp_transistor':
      case 'mosfet_n':
      case 'mosfet_p':
        return <TransistorShape size={size} color={color} />;
      case 'battery':
        return <BatteryShape size={size} color={color} />;
      case 'push_button':
        return <ButtonShape size={size} color={color} />;
      case 'arduino_uno':
        return <ArduinoShape size={size} />;
      case 'arduino_mega2560':
        return <MegaShape size={size} />;
      case 'raspberry_pi_pico':
        return <PicoShape size={size} />;
      case 'raspberry_pi_pico_2w':
        return <Pico2WShape size={size} />;
      case 'raspberry_pi_4':
        return <RPi4Shape size={size} />;
      case 'raspberry_pi_5':
        return <RPi5Shape size={size} />;
      case 'esp32':
        return <ESP32Shape size={size} />;
      case 'esp32_s3':
        return <ESP32S3Shape size={size} />;
      case 'seven_segment':
        return <SevenSegmentShape size={size} />;
      case 'and_gate':
      case 'or_gate':
      case 'nand_gate':
        return <LogicGateShape size={size} color={color} type={component.type} />;
      default:
        return (
          <mesh>
            <boxGeometry args={[size.width, size.height, size.depth]} />
            <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
          </mesh>
        );
    }
  };

  return (
    <group position={[component.position.x, component.position.y, component.position.z]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
        scale={isSelected ? 1.05 : isHovered ? 1.02 : 1}
      >
        {renderShape()}
        {(isSelected || isHovered) && (
          <mesh>
            <boxGeometry args={[size.width * 1.1, size.height * 1.1, size.depth * 1.1]} />
            <meshBasicMaterial
              color={isSelected ? '#00d2ff' : '#888888'}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
        )}
      </mesh>
      {def.ports.map((port) => (
        <mesh
          key={port.id}
          position={[port.position.x, port.position.y, port.position.z]}
        >
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ResistorShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[-size.width * 0.25, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
      <mesh position={[size.width * 0.25, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size.width * 0.5, size.height * 0.6, size.depth * 0.4]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function CapacitorShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[-size.width * 0.25, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, size.height, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
      <mesh position={[size.width * 0.25, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, size.height, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, size.height, 16]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
}

function InductorShape({ size, color }: { size: any; color: string }) {
  const segments = 6;
  const coils = [];
  for (let i = 0; i < segments; i++) {
    const t = (i / (segments - 1)) * size.width - size.width / 2;
    coils.push(
      <mesh key={i} position={[t, 0, 0]}>
        <torusGeometry args={[0.12, 0.04, 8, 12]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
      </mesh>
    );
  }
  return <group>{coils}</group>;
}

function LEDShape({ size, color, brightness }: { size: any; color: string; brightness: number }) {
  const ledColor = new THREE.Color(color);
  const emitColor = ledColor.clone().lerp(new THREE.Color('#ffffff'), brightness * 0.5);
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={brightness > 0.01 ? emitColor : '#000000'}
          emissiveIntensity={brightness * 2}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
    </group>
  );
}

function DiodeShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[-0.2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
        <meshStandardMaterial color="#cccccc" metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 0.15, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function TransistorShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.25, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} />
      </mesh>
      <mesh position={[-0.1, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} />
      </mesh>
      <mesh position={[0.1, -0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} />
      </mesh>
    </group>
  );
}

function BatteryShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.25, 0.05, 0]}>
        <boxGeometry args={[0.05, 0.25, 0.05]} />
        <meshStandardMaterial color="#cccccc" metalness={0.7} />
      </mesh>
    </group>
  );
}

function ButtonShape({ size, color }: { size: any; color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.1, 0.35]} />
        <meshStandardMaterial color="#888888" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.2, 0.05, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  );
}

function ArduinoShape({ size }: { size: any }) {
  const w = size.width;
  const h = size.height;
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[w, 0.06, h]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.48, 0.05, -0.3]}>
        <boxGeometry args={[0.04, 0.02, 0.85]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      <mesh position={[0.48, 0.05, -0.3]}>
        <boxGeometry args={[0.04, 0.02, 0.85]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`dl-${i}`} position={[-0.55, 0.04, -0.45 + i * 0.13]}>
          <cylinderGeometry args={[0.018, 0.022, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={`dr-${i}`} position={[0.55, 0.04, -0.55 + i * 0.13]}>
          <cylinderGeometry args={[0.018, 0.022, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`al-${i}`} position={[-0.55, 0.04, 0.2 + i * 0.13]}>
          <cylinderGeometry args={[0.018, 0.022, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <mesh key={`ar-${i}`} position={[0.55, 0.04, 0.25 + i * 0.13]}>
          <cylinderGeometry args={[0.018, 0.022, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.35, 0.03, 0.35]}>
        <boxGeometry args={[0.4, 0.06, 0.4]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 0.04, 0.35]}>
        <boxGeometry args={[0.12, 0.02, 0.12]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      <mesh position={[-0.5, 0.06, 0.55]}>
        <boxGeometry args={[0.2, 0.04, 0.12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} />
      </mesh>
      <mesh position={[0.1, 0.03, -0.55]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.07, -0.55]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 8]} />
        <meshStandardMaterial color="#44cc44" emissive="#44cc44" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.25, 0.03, 0.6]}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
    </group>
  );
}

function MegaShape({ size }: { size: any }) {
  const w = size.width;
  const h = size.height;
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[w, 0.06, h]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <mesh key={`dl-${i}`} position={[-0.85, 0.04, -1.0 + i * 0.12]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <mesh key={`dr-${i}`} position={[0.85, 0.04, -1.0 + i * 0.12]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <mesh key={`au-${i}`} position={[-0.3 + i * 0.1, 0.04, -1.05]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <mesh key={`ab-${i}`} position={[-0.3 + i * 0.1, 0.04, 1.05]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0.45, 0.03, -0.1]}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 0.03, 0.5]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.55, 0.06, 0.7]}>
        <boxGeometry args={[0.2, 0.04, 0.12]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.6} />
      </mesh>
      <mesh position={[0.75, 0.03, -0.85]}>
        <cylinderGeometry args={[0.06, 0.06, 0.04, 12]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[-0.65, 0.04, -0.1]}>
        <boxGeometry args={[0.15, 0.02, 0.15]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PicoShape({ size }: { size: any }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[size.width, 0.06, size.height]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.4, 0.03, -0.35]}>
        <boxGeometry args={[0.04, 0.02, 0.6]} />
        <meshStandardMaterial color="#c0a040" metalness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.03, -0.35]}>
        <boxGeometry args={[0.04, 0.02, 0.6]} />
        <meshStandardMaterial color="#c0a040" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0.3]}>
        <boxGeometry args={[0.25, 0.04, 0.25]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.05, -0.45]}>
        <boxGeometry args={[0.12, 0.02, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
    </group>
  );
}

function Pico2WShape({ size }: { size: any }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[size.width, 0.06, size.height]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.4, 0.03, -0.4]}>
        <boxGeometry args={[0.04, 0.02, 0.7]} />
        <meshStandardMaterial color="#c0a040" metalness={0.6} />
      </mesh>
      <mesh position={[0.4, 0.03, -0.4]}>
        <boxGeometry args={[0.04, 0.02, 0.7]} />
        <meshStandardMaterial color="#c0a040" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.03, 0.35]}>
        <boxGeometry args={[0.3, 0.04, 0.3]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.2, 0.04, 0.15]}>
        <boxGeometry args={[0.1, 0.02, 0.1]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.05, -0.5]}>
        <boxGeometry args={[0.12, 0.02, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
    </group>
  );
}

function RPi4Shape({ size }: { size: any }) {
  const w = size.width;
  const h = size.height;
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[w, 0.06, h]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.35, 0.03, 0.45]}>
        <boxGeometry args={[0.35, 0.04, 0.35]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.7, 0.05, 0.1]}>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      <mesh position={[-0.7, 0.05, 0.35]}>
        <boxGeometry args={[0.3, 0.04, 0.08]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      <mesh position={[-0.7, 0.05, 0.6]}>
        <boxGeometry args={[0.3, 0.04, 0.15]} />
        <meshStandardMaterial color="#888888" roughness={0.6} />
      </mesh>
      <mesh position={[-0.2, 0.05, -0.6]}>
        <boxGeometry args={[0.4, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" roughness={0.5} />
      </mesh>
      <mesh position={[0.6, 0.05, -0.6]}>
        <boxGeometry args={[0.3, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" roughness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`usb-${i}`} position={[-0.6 + i * 0.25, 0.05, -0.65]}>
          <boxGeometry args={[0.18, 0.04, 0.08]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0.65, 0.04, 0.6]}>
        <boxGeometry args={[0.08, 0.02, 0.3]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.4} />
      </mesh>
      <mesh position={[-0.8, 0.03, -0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[-0.8, 0.03, 0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[0.8, 0.03, -0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[0.8, 0.03, 0.35]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39].map((i) => (
        <mesh key={`gpio-${i}`} position={[-0.58 + ((i % 20) * 0.065), 0.04, 0.65 - (i >= 20 ? 0.08 : 0)]}>
          <cylinderGeometry args={[0.012, 0.015, 0.1, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function RPi5Shape({ size }: { size: any }) {
  const w = size.width;
  const h = size.height;
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[w, 0.06, h]} />
        <meshStandardMaterial color="#1a6b3c" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[0.5, 0.03, 0.5]}>
        <boxGeometry args={[0.4, 0.04, 0.4]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
      <mesh position={[-0.8, 0.05, 0.1]}>
        <boxGeometry args={[0.35, 0.04, 0.08]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      <mesh position={[-0.8, 0.05, 0.4]}>
        <boxGeometry args={[0.35, 0.04, 0.08]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
      <mesh position={[-0.5, 0.05, -0.7]}>
        <boxGeometry args={[0.4, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" roughness={0.5} />
      </mesh>
      <mesh position={[0.5, 0.05, -0.7]}>
        <boxGeometry args={[0.3, 0.04, 0.1]} />
        <meshStandardMaterial color="#666666" roughness={0.5} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`usb-${i}`} position={[-0.55 + i * 0.25, 0.05, -0.75]}>
          <boxGeometry args={[0.18, 0.04, 0.08]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
        </mesh>
      ))}
      <mesh position={[0.7, 0.03, 0.5]}>
        <boxGeometry args={[0.08, 0.02, 0.25]} />
        <meshStandardMaterial color="#888888" roughness={0.5} />
      </mesh>
      <mesh position={[-0.9, 0.03, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0.03, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[0.9, 0.03, -0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      <mesh position={[0.9, 0.03, 0.4]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.4} />
      </mesh>
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={`gpio-${i}`} position={[-0.58 + ((i % 20) * 0.065), 0.04, 0.7 - (i >= 20 ? 0.08 : 0)]}>
          <cylinderGeometry args={[0.012, 0.015, 0.1, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ESP32Shape({ size }: { size: any }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[size.width, 0.06, size.height]} />
        <meshStandardMaterial color="#0d3b7a" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.45, 0.04, 0.45]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`pl-${i}`} position={[-0.5, 0.04, -0.35 + i * 0.14]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={`pr-${i}`} position={[0.5, 0.04, -0.35 + i * 0.14]}>
          <cylinderGeometry args={[0.016, 0.02, 0.12, 6]} />
          <meshStandardMaterial color="#999999" metalness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.05, 0.4]}>
        <boxGeometry args={[0.15, 0.02, 0.08]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
    </group>
  );
}

function ESP32S3Shape({ size }: { size: any }) {
  return (
    <group>
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[size.width, 0.06, size.height]} />
        <meshStandardMaterial color="#0d3b7a" roughness={0.6} metalness={0.05} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.05]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
        const side = i < 8 ? -1 : 1;
        const idx = i < 8 ? i : i - 8;
        return (
          <mesh key={`p-${i}`} position={[side * 0.6, 0.04, -0.4 + idx * 0.1]}>
            <cylinderGeometry args={[0.014, 0.018, 0.12, 6]} />
            <meshStandardMaterial color="#999999" metalness={0.4} />
          </mesh>
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
        const side = i < 8 ? -1 : 1;
        const idx = i < 8 ? i : i - 8;
        return (
          <mesh key={`pu-${i}`} position={[side * (0.1 + idx * 0.08), 0.04, 0.5]}>
            <cylinderGeometry args={[0.014, 0.018, 0.12, 6]} />
            <meshStandardMaterial color="#999999" metalness={0.4} />
          </mesh>
        );
      })}
      <mesh position={[-0.5, 0.05, 0.45]}>
        <boxGeometry args={[0.12, 0.02, 0.06]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.5} />
      </mesh>
    </group>
  );
}

function SevenSegmentShape({ size }: { size: any }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshStandardMaterial color="#222222" roughness={0.8} />
      </mesh>
      {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((seg, i) => {
        const pos = [
          [0, 0.35, 0.05],
          [0.25, 0.15, 0.05],
          [0.25, -0.15, 0.05],
          [0, -0.35, 0.05],
          [-0.25, -0.15, 0.05],
          [-0.25, 0.15, 0.05],
          [0, 0, 0.05],
        ];
        const sizes = [
          [0.25, 0.05, 0.01],
          [0.05, 0.15, 0.01],
          [0.05, 0.15, 0.01],
          [0.25, 0.05, 0.01],
          [0.05, 0.15, 0.01],
          [0.05, 0.15, 0.01],
          [0.25, 0.05, 0.01],
        ];
        return (
          <mesh key={seg} position={pos[i] as [number, number, number]}>
            <boxGeometry args={sizes[i] as [number, number, number]} />
            <meshStandardMaterial color={i < 6 ? '#ff4444' : '#44ff44'} emissive="#ff2222" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

function LogicGateShape({ size, color, type }: { size: any; color: string; type: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.35, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[-0.25, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[-0.25, -0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.05, 6]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    </group>
  );
}
