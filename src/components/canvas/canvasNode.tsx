// src/components/canvas/canvasNode.tsx
'use client';

import React, { useCallback, useMemo } from 'react';
import type { TNode } from '../../types';
import { useLayersStore } from '../layers/layer-store';
import { NODE_TYPES } from '../../lib/constants';
import { cn } from '../../lib/utils';
import './canvas.css';

interface CanvasNodeProps {
  node: TNode;
  depth: number;
  isSelected: boolean;
  onSelect: (nodeId: string | null) => void;
  isDragging?: boolean;
}

export const CanvasNode: React.FC<CanvasNodeProps> = ({
  node,
  depth,
  isSelected,
  onSelect,
  isDragging = false,
}) => {
  const layersStore = useLayersStore();

  // Manejar click en el nodo
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(node.id);
    },
    [node.id, onSelect]
  );

  // Manejar doble click para editar inline
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(node.id);
      // Activar modo de edición inline si es necesario
      // editorStore.setInlineEditing(true);
    },
    [node.id, onSelect]
  );

  // Manejar drop de elementos sobre este nodo (si puede tener hijos)
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const nodeType = e.dataTransfer.getData('application/node-type');
      
      if (nodeType && NODE_TYPES[node.type as keyof typeof NODE_TYPES]?.canHaveChildren) {
        layersStore.addNode(nodeType as any, node.id);
      }
    },
    [node.id, node.type, layersStore]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (NODE_TYPES[node.type as keyof typeof NODE_TYPES]?.canHaveChildren) {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'copy';
      }
    },
    [node.type]
  );

  // Construir estilos inline desde el objeto de estilos
  const inlineStyles = useMemo(() => {
    const styles: React.CSSProperties = {};
    
    if (node.styles) {
      Object.entries(node.styles).forEach(([key, value]) => {
        // Convertir camelCase a kebab-case para propiedades CSS
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        (styles as any)[cssKey] = value;
      });
    }
    
    return styles;
  }, [node.styles]);

  // Clases del nodo
  const nodeClasses = cn(
    'canvas-node',
    `canvas-node--${node.type}`,
    isSelected && 'canvas-node--selected',
    !node.isVisible && 'canvas-node--hidden',
    node.isLocked && 'canvas-node--locked',
    isDragging && 'canvas-node--dragging'
  );

  // Si el nodo no está visible, renderizar un placeholder
  if (!node.isVisible && !isSelected) {
    return (
      <div
        className={cn(nodeClasses, 'canvas-node--hidden-placeholder')}
        onClick={handleClick}
        title={`Hidden: ${node.name}`}
      >
        <span className="canvas-node__hidden-label">
          {node.name} (hidden)
        </span>
      </div>
    );
  }

  // Renderizar según el tipo de nodo
  const renderNodeContent = () => {
    switch (node.type) {
      case 'heading':
        return renderHeading();
      case 'paragraph':
        return renderParagraph();
      case 'image':
        return renderImage();
      case 'table':
        return renderTable();
      case 'variable':
        return renderVariable();
      case 'container':
        return renderContainer();
      case 'row':
        return renderRow();
      case 'column':
        return renderColumn();
      default:
        return renderDefault();
    }
  };

  // Heading
  const renderHeading = () => {
    const level = parseInt(node.styles?.tag?.replace('h', '') || '2');
    const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}` as keyof React.JSX.IntrinsicElements;
    
    return (
      <HeadingTag
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {node.content || 'Heading'}
      </HeadingTag>
    );
  };

  // Paragraph
  const renderParagraph = () => {
    return (
      <p
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {node.content || 'Start typing your paragraph here...'}
      </p>
    );
  };

  // Image
  const renderImage = () => {
    const src = node.content || 'https://via.placeholder.com/400x300?text=Image';
    
    return (
      <figure
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
      >
        <img
          src={src}
          alt={node.attributes?.alt || node.name || 'Image'}
          className="canvas-node__image"
          style={{
            width: node.styles?.width || '100%',
            maxWidth: node.styles?.maxWidth || '600px',
            height: node.styles?.height || 'auto',
            borderRadius: node.styles?.borderRadius || '8px',
            // objectFit: node.styles?.objectFit || 'cover',
          }}
        />
        {isSelected && (
          <figcaption className="canvas-node__image-caption">
            Click to change image URL
          </figcaption>
        )}
      </figure>
    );
  };

  // Table
  const renderTable = () => {
    return (
      <div
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <table className="canvas-node__table">
          <tbody>
            {node.children.length > 0 ? (
              node.children.map((child) => (
                <CanvasNode
                  key={child.id}
                  node={child}
                  depth={depth + 1}
                  isSelected={child.id === layersStore.selectedNodeId}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <tr>
                <td className="canvas-node__table-empty">
                  {isSelected ? 'Drop rows here or add from the panel' : 'Empty table'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  // Variable
  const renderVariable = () => {
    const variableKey = node.variableKey || 'variable';
    
    return (
      <span
        className={cn(nodeClasses, 'canvas-node--variable')}
        style={inlineStyles}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {`{{${variableKey}}}`}
        {isSelected && !node.variableKey && (
          <span className="canvas-node__variable-hint">
            Select a field in the Properties panel
          </span>
        )}
      </span>
    );
  };

  // Container
  const renderContainer = () => {
    return (
      <div
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {node.children.length > 0 ? (
          node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={child.id === layersStore.selectedNodeId}
              onSelect={onSelect}
            />
          ))
        ) : (
          <div className="canvas-node__container-empty">
            {isSelected ? 'Drop elements here' : 'Empty container'}
          </div>
        )}
      </div>
    );
  };

  // Row
  const renderRow = () => {
    return (
      <tr
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {node.children.length > 0 ? (
          node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={child.id === layersStore.selectedNodeId}
              onSelect={onSelect}
            />
          ))
        ) : (
          <td className="canvas-node__row-empty">
            {isSelected ? 'Drop columns here' : 'Empty row'}
          </td>
        )}
      </tr>
    );
  };

  // Column
  const renderColumn = () => {
    return (
      <td
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {node.children.length > 0 ? (
          node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={child.id === layersStore.selectedNodeId}
              onSelect={onSelect}
            />
          ))
        ) : (
          <div className="canvas-node__column-empty">
            {isSelected ? 'Drop content here' : 'Empty column'}
          </div>
        )}
      </td>
    );
  };

  // Default
  const renderDefault = () => {
    return (
      <div
        className={nodeClasses}
        style={inlineStyles}
        onClick={handleClick}
      >
        <span className="canvas-node__unknown-type">{node.type}</span>
        {node.content && <span>{node.content}</span>}
      </div>
    );
  };

  // Wrapper para nodos con indicador de selección
  return (
    <div className="canvas-node__wrapper" data-node-id={node.id} data-node-type={node.type}>
      {/* Indicador de selección y breadcrumb */}
      {isSelected && (
        <div className="canvas-node__selection-indicator">
          <span className="canvas-node__breadcrumb">
            {node.type}
          </span>
          <div className="canvas-node__actions-bar">
            <button
              className="canvas-node__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                layersStore.updateNode(node.id, { isVisible: !node.isVisible });
              }}
              title={node.isVisible ? 'Hide' : 'Show'}
            >
              {node.isVisible ? '👁' : '👁‍🗨'}
            </button>
            <button
              className="canvas-node__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                layersStore.updateNode(node.id, { isLocked: !node.isLocked });
              }}
              title={node.isLocked ? 'Unlock' : 'Lock'}
            >
              {node.isLocked ? '🔒' : '🔓'}
            </button>
            <button
              className="canvas-node__action-btn"
              onClick={(e) => {
                e.stopPropagation();
                layersStore.duplicateNode(node.id);
              }}
              title="Duplicate"
            >
              📋
            </button>
            <button
              className="canvas-node__action-btn canvas-node__action-btn--danger"
              onClick={(e) => {
                e.stopPropagation();
                layersStore.removeNode(node.id);
              }}
              title="Delete"
            >
              🗑
            </button>
          </div>
        </div>
      )}

      {/* Contenido del nodo */}
      {renderNodeContent()}
    </div>
  );
};