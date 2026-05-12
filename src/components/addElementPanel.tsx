// src/components/addElementPanel/AddElementPanel.tsx
import React, { useState, useCallback, useMemo } from 'react';
import  type { NodeType } from '../types/index';
import { NODE_TYPES, NODE_CATEGORIES } from '../lib/constants';
import { useLayersStore } from '../components/layers/layer-store';
import { useEditorStore } from '../stores/useEditorStore';
import {
  Type,
  Heading1,
  Heading2,
  Image,
  Table,
  Braces,
  Layout,
  Plus,
  Search,
  Columns,
  Rows,
} from 'lucide-react';
import './addElementPanel.css';

// Mapeo de iconos por tipo de nodo
const NODE_ICONS: Record<string, React.ReactNode> = {
  heading: <Heading1 size={18} />,
  paragraph: <Type size={18} />,
  image: <Image size={18} />,
  table: <Table size={18} />,
  variable: <Braces size={18} />,
  container: <Layout size={18} />,
  row: <Rows size={18} />,
  column: <Columns size={18} />,
};

// Agrupación de elementos por categoría
const ELEMENT_GROUPS = [
  {
    id: 'text',
    label: 'Text',
    elements: [
      { type: 'heading' as NodeType, label: 'Heading', icon: <Heading1 size={24} /> },
      { type: 'paragraph' as NodeType, label: 'Paragraph', icon: <Type size={24} /> },
    ],
  },
  {
    id: 'media',
    label: 'Media',
    elements: [
      { type: 'image' as NodeType, label: 'Image', icon: <Image size={24} /> },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    elements: [
      { type: 'container' as NodeType, label: 'Container', icon: <Layout size={24} /> },
      { type: 'table' as NodeType, label: 'Table', icon: <Table size={24} /> },
      { type: 'row' as NodeType, label: 'Row', icon: <Rows size={24} /> },
      { type: 'column' as NodeType, label: 'Column', icon: <Columns size={24} /> },
    ],
  },
  {
    id: 'dynamic',
    label: 'Dynamic',
    elements: [
      { type: 'variable' as NodeType, label: 'Variable', icon: <Braces size={24} /> },
    ],
  },
];

export const AddElementPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>('text');

  // Acceso al store - patrón Ycode (sin props)
  const layersStore = useLayersStore();
  const editorStore = useEditorStore();

  // Filtrar elementos por búsqueda
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return ELEMENT_GROUPS;

    return ELEMENT_GROUPS.map(group => ({
      ...group,
      elements: group.elements.filter(el =>
        el.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        el.type.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(group => group.elements.length > 0);
  }, [searchQuery]);

  // Manejar click en un elemento para agregarlo
  const handleAddElement = useCallback((type: NodeType) => {
    const selectedNode = layersStore.getSelectedNode();
    
    // Si hay un nodo seleccionado y puede tener hijos, agregar como hijo
    if (selectedNode && NODE_TYPES[selectedNode.type]?.canHaveChildren) {
      layersStore.addNode(type, selectedNode.id);
    } else {
      // Si no, agregar al nivel raíz
      layersStore.addNode(type, null);
    }
  }, [layersStore]);

  // Manejar drag start (para arrastrar elementos al canvas)
  const handleDragStart = useCallback((e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('application/node-type', type);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  return (
    <div className="add-element-panel">
      {/* Header */}
      <div className="add-element-panel__header">
        <div className="add-element-panel__header-left">
          <Plus size={14} className="add-element-panel__header-icon" />
          <h3 className="add-element-panel__title">Add Elements</h3>
        </div>
      </div>

      {/* Search */}
      <div className="add-element-panel__search">
        <Search size={12} className="add-element-panel__search-icon" />
        <input
          type="text"
          className="add-element-panel__search-input"
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div className="add-element-panel__tabs">
        {ELEMENT_GROUPS.map(group => (
          <button
            key={group.id}
            className={`add-element-panel__tab ${
              activeGroup === group.id ? 'add-element-panel__tab--active' : ''
            }`}
            onClick={() => setActiveGroup(group.id === activeGroup ? null : group.id)}
          >
            <span className="add-element-panel__tab-label">{group.label}</span>
          </button>
        ))}
      </div>

      {/* Elements Grid */}
      <div className="add-element-panel__content">
        {filteredGroups
          .filter(group => !activeGroup || group.id === activeGroup)
          .map(group => (
            <div key={group.id} className="add-element-panel__group">
              <div className="add-element-panel__group-header">
                <span className="add-element-panel__group-title">{group.label}</span>
                <span className="add-element-panel__group-count">
                  {group.elements.length}
                </span>
              </div>
              
              <div className="add-element-panel__elements">
                {group.elements.map(element => (
                  <div
                    key={element.type}
                    className="add-element-panel__element"
                    onClick={() => handleAddElement(element.type)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.type)}
                    title={`Add ${element.label}`}
                  >
                    <div className="add-element-panel__element-icon">
                      {element.icon}
                    </div>
                    <span className="add-element-panel__element-label">
                      {element.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {filteredGroups.length === 0 && (
          <div className="add-element-panel__empty">
            <Search size={24} className="add-element-panel__empty-icon" />
            <p className="add-element-panel__empty-text">No elements found</p>
            <p className="add-element-panel__empty-hint">
              Try a different search term
            </p>
          </div>
        )}
      </div>

      {/* Footer con información */}
      <div className="add-element-panel__footer">
        <div className="add-element-panel__footer-item">
          <span className="add-element-panel__footer-label">
            Total elements: {ELEMENT_GROUPS.reduce((acc, g) => acc + g.elements.length, 0)}
          </span>
        </div>
        <div className="add-element-panel__footer-hint">
          Click or drag to add
        </div>
      </div>
    </div>
  );
};