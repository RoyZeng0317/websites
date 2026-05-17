import { useCircuitStore } from '../../stores/circuitStore.js';
import { COMPONENT_LIBRARY } from '@circuit-lab/simulator-core';
import type { ComponentType, ComponentCategory } from '@circuit-lab/shared';

const categoryOrder: ComponentCategory[] = ['passive', 'active', 'power', 'logic', 'microcontroller', 'display', 'electromechanical', 'measurement'];
const categoryLabels: Record<ComponentCategory, string> = {
  passive: 'Passive',
  active: 'Active',
  power: 'Power',
  logic: 'Logic',
  microcontroller: 'Microcontrollers',
  display: 'Displays',
  electromechanical: 'Electromechanical',
  measurement: 'Measurement',
};

const categoryIcons: Record<ComponentCategory, string> = {
  passive: '⚡',
  active: '🔌',
  power: '🔋',
  logic: '⊼',
  microcontroller: '🤖',
  display: '📟',
  electromechanical: '⚙',
  measurement: '📊',
};

export function ComponentPanel() {
  const { selectedTool, setSelectedTool, setPlacingComponentType, placingComponentType } = useCircuitStore();

  const allComponents = Object.values(COMPONENT_LIBRARY);
  const categories = categoryOrder.map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    icon: categoryIcons[cat],
    components: allComponents.filter((c) => c.category === cat),
  }));

  const handleComponentClick = (type: ComponentType) => {
    setSelectedTool('component');
    setPlacingComponentType(type);
  };

  return (
    <div style={styles.panel}>
      <div style={styles.header}>Components</div>
      <div style={styles.searchBox}>
        <input style={styles.searchInput} placeholder="Search components..." />
      </div>
      <div style={styles.list}>
        {categories.map(({ category, label, icon, components }) =>
          components.length > 0 ? (
            <div key={category}>
              <div style={styles.categoryLabel}>
                <span>{icon}</span>
                <span>{label}</span>
              </div>
              {components.map((comp) => (
                <div
                  key={comp.type}
                  style={{
                    ...styles.componentItem,
                    ...(placingComponentType === comp.type ? styles.componentItemActive : {}),
                  }}
                  onClick={() => handleComponentClick(comp.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('componentType', comp.type);
                    setPlacingComponentType(comp.type);
                  }}
                >
                  <div style={styles.componentName}>{comp.name}</div>
                  <div style={styles.componentDesc}>{comp.description}</div>
                </div>
              ))}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    width: 260,
    background: '#0f0f25',
    borderRight: '1px solid #1a1a3e',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 600,
    color: '#00d2ff',
    borderBottom: '1px solid #1a1a3e',
  },
  searchBox: {
    padding: '8px 12px',
  },
  searchInput: {
    width: '100%',
    padding: '6px 10px',
    background: '#1a1a3e',
    border: '1px solid #2a2a5e',
    borderRadius: 6,
    color: '#e0e0e0',
    fontSize: 12,
    outline: 'none',
    boxSizing: 'border-box',
  },
  list: {
    flex: 1,
    overflow: 'auto',
    padding: '4px 0',
  },
  categoryLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: '#6666aa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  componentItem: {
    padding: '8px 16px 8px 24px',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
  },
  componentItemActive: {
    background: '#1a1a3e',
    borderLeft: '3px solid #00d2ff',
  },
  componentItemHover: {
    background: '#151530',
  },
  componentName: {
    fontSize: 13,
    fontWeight: 500,
    color: '#e0e0e0',
  },
  componentDesc: {
    fontSize: 11,
    color: '#6666aa',
    marginTop: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};
