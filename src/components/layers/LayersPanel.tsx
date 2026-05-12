// src/components/layers/LayersPanel.tsx
import React, { useCallback, useMemo, useState } from 'react';
import type { TNode, NodeType } from '../../types';
import { NODE_TYPES, NODE_CATEGORIES } from '../../lib/constants';
import { useLayersStore } from '../layers/layer-store';
import { LayerItem } from '../layers/layerItem';
import { LayersPanelMenu } from '../layers/LayerPanelMenu';
import { SortableLayerItem } from './SortableLayerItem';
import { cn, generateId } from '../../lib/utils';
import { 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Copy,
  Trash2,
  Group,
  Ungroup,
  MoveUp,
  MoveDown,
  Layers,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import './layers.css';

interface LayersPanelProps {
  nodes: TNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  expandedNodes: Set<string>;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode: (nodeId: string | null) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string, isVisible: boolean) => void;
  onToggleLock: (nodeId: string, isLocked: boolean) => void;
  onToggleExpand: (nodeId: string) => void;
  onMoveNode: (fromIndex: number, toIndex: number) => void;
  isDragging: boolean;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  nodes,
  selectedNodeId,
  hoveredNodeId,
  expandedNodes,
  onSelectNode,
  onHoverNode,
  onDeleteNode,
  onDuplicateNode,
  onToggleVisibility,
  onToggleLock,
  onToggleExpand,
  onMoveNode,
  isDragging,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<NodeType | 'all'>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const layersStore = useLayersStore();

  // Nodos filtrados por búsqueda y tipo
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      const matchesSearch = !searchQuery || 
        node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || node.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [nodes, searchQuery, filterType]);

  // Contar nodos por tipo
  const nodeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach(node => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  }, [nodes]);

  // Handlers del panel
  const handleAddNode = useCallback((type: NodeType) => {
    const selectedNode = layersStore.getSelectedNode();
    const parentId = selectedNode?.id || null;
    layersStore.addNode(type, parentId);
    setShowMenu(false);
  }, [layersStore]);

  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
    onSelectNode(nodeId);
  }, [onSelectNode]);

  const handleSelectAll = useCallback(() => {
    // Implementar selección múltiple si es necesario
    console.log('Select all nodes');
  }, []);

  const handleDeselectAll = useCallback(() => {
    onSelectNode(null);
  }, [onSelectNode]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNodeId) {
      onDeleteNode(selectedNodeId);
    }
  }, [selectedNodeId, onDeleteNode]);

  const handleDuplicateSelected = useCallback(() => {
    if (selectedNodeId) {
      onDuplicateNode(selectedNodeId);
    }
  }, [selectedNodeId, onDuplicateNode]);

  const handleToggleVisibilityAll = useCallback(() => {
    const allVisible = nodes.every(n => n.isVisible);
    nodes.forEach(node => {
      onToggleVisibility(node.id, !allVisible);
    });
  }, [nodes, onToggleVisibility]);

  const handleToggleLockAll = useCallback(() => {
    const allLocked = nodes.every(n => n.isLocked);
    nodes.forEach(node => {
      onToggleLock(node.id, !allLocked);
    });
  }, [nodes, onToggleLock]);

  const handleMoveUp = useCallback(() => {
    if (selectedNodeId) {
      const index = nodes.findIndex(n => n.id === selectedNodeId);
      if (index > 0) {
        onMoveNode(index, index - 1);
      }
    }
  }, [selectedNodeId, nodes, onMoveNode]);

  const handleMoveDown = useCallback(() => {
    if (selectedNodeId) {
      const index = nodes.findIndex(n => n.id === selectedNodeId);
      if (index < nodes.length - 1) {
        onMoveNode(index, index + 1);
      }
    }
  }, [selectedNodeId, nodes, onMoveNode]);

  // Renderizar nodos recursivamente
  const renderNodes = useCallback((nodesToRender: TNode[], depth: number = 0) => {
    return nodesToRender.map((node) => (
      <React.Fragment key={node.id}>
        <SortableLayerItem
          node={node}
          depth={depth}
          isSelected={selectedNodeId === node.id}
          isHovered={hoveredNodeId === node.id}
          isDragging={isDragging && selectedNodeId === node.id}
          onSelect={onSelectNode}
          onHover={onHoverNode}
          onDelete={onDeleteNode}
          onDuplicate={onDuplicateNode}
          onToggleVisibility={onToggleVisibility}
          onToggleLock={onToggleLock}
          onToggleExpand={onToggleExpand}
          isExpanded={expandedNodes.has(node.id)}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
        />
        {expandedNodes.has(node.id) && node.children.length > 0 && (
          <div className="layers-panel__children">
            {renderNodes(node.children, depth + 1)}
          </div>
        )}
      </React.Fragment>
    ));
  }, [
    selectedNodeId,
    hoveredNodeId,
    isDragging,
    expandedNodes,
    onSelectNode,
    onHoverNode,
    onDeleteNode,
    onDuplicateNode,
    onToggleVisibility,
    onToggleLock,
    onToggleExpand,
    handleContextMenu,
  ]);

  return (
    <div className="layers-panel">
      {/* Header */}
      <div className="layers-panel__header">
        <div className="layers-panel__header-left">
          <Layers size={14} className="layers-panel__header-icon" />
          <h3 className="layers-panel__title">Layers</h3>
          <span className="layers-panel__count">{nodes.length}</span>
        </div>
        
        <div className="layers-panel__actions">
          <button
            className="layers-panel__action-btn"
            onClick={() => handleAddNode('container')}
            title="Add Container"
          >
            <Plus size={14} />
          </button>
          <button
            className="layers-panel__action-btn"
            onClick={() => setShowMenu(!showMenu)}
            title="More Options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="layers-panel__toolbar">
        <div className="layers-panel__search">
          <Search size={12} className="layers-panel__search-icon" />
          <input
            type="text"
            className="layers-panel__search-input"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          className="layers-panel__filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as NodeType | 'all')}
        >
          <option value="all">All Types</option>
          {Object.values(NODE_TYPES).map(config => (
            <option key={config.type} value={config.type}>
              {config.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Actions Bar */}
      <div className="layers-panel__quick-actions">
        <button
          className="layers-panel__quick-btn"
          onClick={handleSelectAll}
          title="Select All"
        >
          <Layers size={12} />
          <span>All</span>
        </button>
        <button
          className="layers-panel__quick-btn"
          onClick={handleDeselectAll}
          title="Deselect"
        >
          <Layers size={12} />
          <span>None</span>
        </button>
        <div className="layers-panel__quick-divider" />
        <button
          className="layers-panel__quick-btn"
          onClick={handleToggleVisibilityAll}
          title="Toggle Visibility All"
        >
          <Eye size={12} />
        </button>
        <button
          className="layers-panel__quick-btn"
          onClick={handleToggleLockAll}
          title="Toggle Lock All"
        >
          <Lock size={12} />
        </button>
        <div className="layers-panel__quick-divider" />
        <button
          className="layers-panel__quick-btn"
          onClick={handleMoveUp}
          disabled={!selectedNodeId}
          title="Move Up"
        >
          <MoveUp size={12} />
        </button>
        <button
          className="layers-panel__quick-btn"
          onClick={handleMoveDown}
          disabled={!selectedNodeId}
          title="Move Down"
        >
          <MoveDown size={12} />
        </button>
        <div className="layers-panel__quick-divider" />
        <button
          className="layers-panel__quick-btn layers-panel__quick-btn--danger"
          onClick={handleDeleteSelected}
          disabled={!selectedNodeId}
          title="Delete Selected"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Statistics Bar */}
      <div className="layers-panel__stats">
        {Object.entries(nodeCounts).map(([type, count]) => {
          const config = NODE_TYPES[type as NodeType];
          if (!config) return null;
          return (
            <span key={type} className="layers-panel__stat">
              <span className={`layers-panel__stat-dot layers-panel__stat-dot--${type}`} />
              {config.label}: {count}
            </span>
          );
        })}
      </div>

      {/* Layers List */}
      <div className="layers-panel__list">
        {filteredNodes.length === 0 ? (
          <div className="layers-panel__empty">
            <Layers size={32} className="layers-panel__empty-icon" />
            <p className="layers-panel__empty-text">
              {searchQuery ? 'No layers match your search' : 'No layers yet'}
            </p>
            <p className="layers-panel__empty-hint">
              {searchQuery ? 'Try adjusting your search or filters' : 'Add elements to start building your document'}
            </p>
          </div>
        ) : (
          renderNodes(filteredNodes)
        )}
      </div>

      {/* Footer */}
      <div className="layers-panel__footer">
        <div className="layers-panel__footer-item">
          <span className="layers-panel__footer-label">Total</span>
          <span className="layers-panel__footer-value">{nodes.length}</span>
        </div>
        <div className="layers-panel__footer-item">
          <span className="layers-panel__footer-label">Selected</span>
          <span className="layers-panel__footer-value">
            {selectedNodeId ? 1 : 0}
          </span>
        </div>
        <div className="layers-panel__footer-item">
          <span className="layers-panel__footer-label">Visible</span>
          <span className="layers-panel__footer-value">
            {nodes.filter(n => n.isVisible).length}
          </span>
        </div>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <LayersPanelMenu
          position={menuPosition}
          onClose={() => setShowMenu(false)}
          onAddNode={handleAddNode}
          selectedNodeId={selectedNodeId}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
        />
      )}
    </div>
  );
};