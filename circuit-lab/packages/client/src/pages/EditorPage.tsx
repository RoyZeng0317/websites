import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { useCircuitStore } from '../stores/circuitStore.js';
import { useAuthStore } from '../stores/authStore.js';
import { connectSocket, joinProject } from '../services/socket.js';
import { ComponentPanel } from '../components/Panel/ComponentPanel.js';
import { Breadboard3D } from '../components/Breadboard3D/Breadboard3D.js';
import { CodeEditor } from '../components/Editor/CodeEditor.js';
import { Toolbar } from '../components/Toolbar/Toolbar.js';

export function EditorPage() {
  const { projectId } = useParams();
  const store = useCircuitStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      const socket = connectSocket();
      joinProject(projectId);
    }
  }, [projectId]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const sel = store.selectedComponentId;
    if ((e.key === 'Delete' || e.key === 'Backspace') && sel) {
      store.removeComponent(sel);
      store.selectComponent(null);
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      store.selectComponent(null);
      store.setSelectedTool('select');
      store.setPlacingComponentType(null);
    }
  }, [store]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div style={styles.container}>
      <Toolbar />
      <div style={styles.workspace}>
        <ComponentPanel />
        <div style={styles.mainArea}>
          <div ref={canvasRef} style={styles.canvas}>
            <Canvas
              dpr={[1, 2]}
              shadows
              camera={{ position: [12, 9, 12], fov: 40, near: 0.1, far: 100 }}
              gl={{ antialias: true, toneMapping: 3, toneMappingExposure: 1.1 }}
              style={{ background: '#0a0a1a' }}
            >
              <ambientLight intensity={0.2} color="#4466aa" />
              <directionalLight
                position={[8, 15, 6]}
                intensity={1.8}
                color="#fff5e6"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <directionalLight
                position={[-5, 8, -8]}
                intensity={0.6}
                color="#6688cc"
              />
              <directionalLight
                position={[3, 2, -10]}
                intensity={0.3}
                color="#ff8866"
              />
              <spotLight
                position={[0, 12, 0]}
                angle={0.6}
                penumbra={0.8}
                intensity={0.4}
                color="#4466ff"
                distance={30}
              />

              <Breadboard3D />

              <ContactShadows
                position={[0, -0.3, 0]}
                opacity={0.5}
                scale={20}
                blur={2.5}
                far={4}
                resolution={1024}
              />

              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={3}
                maxDistance={30}
                minPolarAngle={0.1}
                maxPolarAngle={Math.PI / 2.1}
                target={[0, 0.8, 0]}
                dampingFactor={0.08}
                enableDamping
              />

              <Environment
                preset="studio"
                resolution={256}
                background={false}
              />

              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.6}
                  luminanceSmoothing={0.8}
                  intensity={0.4}
                  mipmapBlur
                />
                <ToneMapping adaptive />
              </EffectComposer>
            </Canvas>
          </div>

          <div style={styles.bottomPanel}>
            <div style={styles.editorTabBar}>
              <button style={{ ...styles.tab, ...styles.tabActive }}>Code Editor</button>
              <button style={styles.tab}>Serial Monitor</button>
              <button style={styles.tab}>Waveforms</button>
              <button style={styles.tab}>Properties</button>
            </div>
            <CodeEditor />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#0a0a1a',
    color: '#e0e0e0',
    fontFamily: 'system-ui, sans-serif',
    overflow: 'hidden',
  },
  workspace: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    position: 'relative',
    minHeight: 0,
  },
  bottomPanel: {
    height: 300,
    borderTop: '1px solid #1a1a3e',
    display: 'flex',
    flexDirection: 'column',
    background: '#0f0f25',
  },
  editorTabBar: {
    display: 'flex',
    background: '#0a0a1a',
    borderBottom: '1px solid #1a1a3e',
  },
  tab: {
    padding: '8px 20px',
    background: 'transparent',
    color: '#6666aa',
    border: 'none',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
  },
  tabActive: {
    color: '#00d2ff',
    borderBottom: '2px solid #00d2ff',
    background: '#0f0f25',
  },
};
