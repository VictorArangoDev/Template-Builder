// src/components/layers/LayerItem.tsx
import React, { useCallback, useMemo } from 'react';
import type { TNode } from '../../types';
import { NODE_TYPES } from '../../lib/constants';
import { useLayersStore } from '../layers/layer-store';
import { cn } from '../../lib/utils';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  ChevronRight,
  Copy,
  Trash2,
  GripVertical 
} from 'lucide-react';
import './layers.css';

interface LayerItemProps {
  node: TNode;
  depth: number;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  heading: <span className="layer-icon-text">H</span>,
  paragraph: <span className="layer-icon-text">¶</span>,
  image: <span className="layer-icon-text">🖼</span>,
  table: <span className="layer-icon-text">⊞</span>,
  variable: <span className="layer-icon-text">{'{}'}</span>,
  container: <span className="layer-icon-text">⊡</span>,
  row: <span className="layer-icon-text">≡</span>,
  column: <span className="layer-icon-text">⊠</span>,
};

export const LayerItem: React.FC<LayerItemProps> = ({
  node,
  depth,
  isSelected,
  isHovered,
  isDragging,
}) => {
  const {
    selectNode,
    hoverNode,
    updateNode,
    removeNode,
    duplicateNode,
    toggleExpanded,
    isExpanded,
  } = useLayersStore();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode(node.id);
    },
    [node.id, selectNode]
  );

  const handleMouseEnter = useCallback(() => {
    hoverNode(node.id);
  }, [node.id, hoverNode]);

  const handleMouseLeave = useCallback(() => {
    hoverNode(null);
  }, [hoverNode]);

  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateNode(node.id, { isVisible: !node.isVisible });
    },
    [node.id, node.isVisible, updateNode]
  );

  const handleToggleLock = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      updateNode(node.id, { isLocked: !node.isLocked });
    },
    [node.id, node.isLocked, updateNode]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      removeNode(node.id);
    },
    [node.id, removeNode]
  );

  const handleDuplicate = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      duplicateNode(node.id);
    },
    [node.id, duplicateNode]
  );

  const handleToggleExpand = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleExpanded(node.id);
    },
    [node.id, toggleExpanded]
  );

  const hasChildren = node.children.length > 0;
  const expanded = isExpanded(node.id);
  const config = NODE_TYPES[node.type];
  const displayName = node.name || config?.label || node.type;

  const itemClassName = cn(
    'layer-item',
    isSelected && 'layer-item--selected',
    isHovered && 'layer-item--hovered',
    isDragging && 'layer-item--dragging',
    !node.isVisible && 'layer-item--hidden',
  );

  return (
    <div className="layer-item-wrapper">
      <div
        className={itemClassName}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
      >
        {/* Drag Handle */}
        <div className="layer-item__drag-handle" data-drag-handle>
          <GripVertical size={12} />
        </div>

        {/* Expand/Collapse */}
        <button
          className={cn(
            'layer-item__expand-button',
            !hasChildren && 'layer-item__expand-button--hidden'
          )}
          onClick={handleToggleExpand}
        >
          <ChevronRight
            size={12}
            className={cn(
              'layer-item__chevron',
              expanded && 'layer-item__chevron--expanded'
            )}
          />
        </button>

        {/* Icon */}
        <span className="layer-item__icon">
          {ICON_MAP[node.type] || '?'}
        </span>

        {/* Name */}
        <span className="layer-item__name" title={displayName}>
          {displayName}
        </span>

        {/* Actions (visible on hover) */}
        <div className="layer-item__actions">
          {node.isVisible ? (
            <button
              className="layer-item__action-btn"
              onClick={handleToggleVisibility}
              title="Hide"
            >
              <Eye size={12} />
            </button>
          ) : (
            <button
              className="layer-item__action-btn layer-item__action-btn--dimmed"
              onClick={handleToggleVisibility}
              title="Show"
            >
              <EyeOff size={12} />
            </button>
          )}

          {node.isLocked ? (
            <button
              className="layer-item__action-btn layer-item__action-btn--locked"
              onClick={handleToggleLock}
              title="Unlock"
            >
              <Lock size={12} />
            </button>
          ) : (
            <button
              className="layer-item__action-btn layer-item__action-btn--dimmed"
              onClick={handleToggleLock}
              title="Lock"
            >
              <Unlock size={12} />
            </button>
          )}

          <button
            className="layer-item__action-btn"
            onClick={handleDuplicate}
            title="Duplicate"
          >
            <Copy size={12} />
          </button>

          <button
            className="layer-item__action-btn layer-item__action-btn--danger"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Children (if expanded) */}
      {hasChildren && expanded && (
        <div className="layer-item__children">
          {node.children.map((child) => (
            <LayerItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={false}
              isHovered={false}
              isDragging={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};