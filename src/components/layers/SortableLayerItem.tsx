// src/components/layers/SortableLayerItem.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TNode } from '../../types';
import { LayerItem } from '../layers/layerItem';
import './layers.css';

interface SortableLayerItemProps {
  node: TNode;
  depth: number;
  isSelected: boolean;
  isHovered: boolean;
  isDragging: boolean;
  onSelect: (nodeId: string | null) => void;
  onHover: (nodeId: string | null) => void;
  onDelete: (nodeId: string) => void;
  onDuplicate: (nodeId: string) => void;
  onToggleVisibility: (nodeId: string, isVisible: boolean) => void;
  onToggleLock: (nodeId: string, isLocked: boolean) => void;
  onToggleExpand: (nodeId: string) => void;
  isExpanded: boolean;
  onContextMenu: (e: React.MouseEvent) => void;
}

export const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  node,
  depth,
  isSelected,
  isHovered,
  isDragging,
  onSelect,
  onHover,
  onDelete,
  onDuplicate,
  onToggleVisibility,
  onToggleLock,
  onToggleExpand,
  isExpanded,
  onContextMenu,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: node.id,
    disabled: node.isLocked,
    data: {
      type: 'layer',
      node,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sortable-layer-item"
    >
      <LayerItem
        node={node}
        depth={depth}
        isSelected={isSelected}
        isHovered={isHovered}
        isDragging={isDragging || isSortableDragging}
        // onSelect={onSelect}
        // onHover={onHover}
        // onDelete={onDelete}
        // onDuplicate={onDuplicate}
        // onToggleVisibility={onToggleVisibility}
        // onToggleLock={onToggleLock}
        // onToggleExpand={onToggleExpand}
        // isExpanded={isExpanded}
        // onContextMenu={onContextMenu}
      />
    </div>
  );
};