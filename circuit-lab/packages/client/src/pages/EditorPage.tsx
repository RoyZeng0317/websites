import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useCircuitStore } from '../stores/circuitStore.js';
import { connectSocket, joinProject } from '../services/socket.js';
import { ComponentPanel } from '../components/Panel/ComponentPanel.js';
import { Breadboard3D } from '../components/Breadboard3D/Breadboard3D.js';
import { CodeEditor } from '../components/Editor/CodeEditor.js';
import { Toolbar } from '../components/Toolbar/Toolbar.js';

export function EditorPage() {
  const { projectId } = useParams();
  const store = useCircuitStore();
  const viewMode = store.viewMode;
  const canvasRef = useRef<HTMLDivElement>(null);
  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [bottomHeight, setBottomHeight] = useState(250);
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const startY = e.clientY;
    const startH = bottomHeight;

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current || !mainAreaRef.current) return;
      const rect = mainAreaRef.current.getBoundingClientRect();
      const newH = Math.max(100, Math.min(rect.height - 100, startH - (ev.clientY - startY)));
      setBottomHeight(newH);
    };

    const onUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [bottomHeight]);

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
        <div ref={mainAreaRef} style={styles.mainArea}>
          <div ref={canvasRef} style={styles.canvas}>
            <Canvas
              dpr={[1, 2]}
              shadows
              gl={{ antialias: true, toneMapping: THREE.NoToneMapping, toneMappingExposure: 1.0 }}
              style={{ background: '#0a0a1a' }}
            >
              {viewMode === '2d' ? (
                <orthographicCamera
                  makeDefault
                  args={[-10, 10, 10, -10, 0.1, 100]}
                  position={[0, 15, 0]}
                  zoom={55}
                />
              ) : (
                <perspectiveCamera
                  makeDefault
                  position={[12, 9, 12]}
                  fov={40}
                  near={0.1}
                  far={100}
                />
              )}

              <ambientLight intensity={0.06} color="#404060" />
              <directionalLight
                position={[6, 10, 5]}
                intensity={0.6}
                color="#ffe8d0"
                castShadow
                shadow-bias={-0.001}
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
              />
              <directionalLight
                position={[-4, 6, -6]}
                intensity={0.15}
                color="#6080a0"
              />

              <Breadboard3D />

              {viewMode === '3d' && (
                <ContactShadows
                  position={[0, -0.3, 0]}
                  opacity={0.2}
                  scale={15}
                  blur={3}
                  far={4}
                  resolution={512}
                />
              )}

              <OrbitControls
                enablePan
                enableZoom
                enableRotate={viewMode === '3d'}
                minDistance={1}
                maxDistance={50}
                minPolarAngle={viewMode === '2d' ? 0 : 0.1}
                maxPolarAngle={viewMode === '2d' ? 0 : Math.PI / 2.1}
                target={[0, 0.8, 0]}
                dampingFactor={0.08}
                enableDamping
              />
            </Canvas>
          </div>

          <div style={{ ...styles.bottomPanel, height: bottomHeight }}>
            <div style={styles.editorTabBar}>
              <span style={styles.dragGrip} onMouseDown={handleMouseDown}>[=]</span>
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
    overflow: 'hidden',
  },
  dragGrip: {
    padding: '0 10px',
    color: '#5555aa',
    cursor: 'row-resize',
    userSelect: 'none',
    fontSize: 16,
    lineHeight: '30px',
  },
  bottomPanel: {
    display: 'flex',
    flexDirection: 'column',
    background: '#0f0f25',
    overflow: 'hidden',
    flexShrink: 0,
  },
  editorTabBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#0a0a1a',
    borderBottom: '1px solid #1a1a3e',
    cursor: 'row-resize',
    userSelect: 'none',
    flexShrink: 0,
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
