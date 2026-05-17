import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';
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
  const user = useAuthStore((s) => s.user);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectId) {
      const socket = connectSocket();
      joinProject(projectId);
    }
  }, [projectId]);

  return (
    <div style={styles.container}>
      <Toolbar />

      <div style={styles.workspace}>
        <ComponentPanel />

        <div style={styles.mainArea}>
          <div ref={canvasRef} style={styles.canvas}>
            <Canvas
              camera={{ position: [10, 8, 10], fov: 45 }}
              style={{ background: '#0d0d20' }}
              shadows
            >
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 15, 10]} intensity={1.0} castShadow />
              <directionalLight position={[-5, 10, -5]} intensity={0.3} />
              <Grid
                position={[0, -0.5, 0]}
                args={[30, 30]}
                cellSize={0.5}
                cellThickness={0.5}
                cellColor="#2a2a4a"
                sectionSize={2}
                sectionThickness={1}
                sectionColor="#3a3a6a"
                fadeDistance={50}
              />
              <Breadboard3D />
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={3}
                maxDistance={30}
                target={[0, 1, 0]}
              />
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
