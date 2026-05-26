import React from 'react'
import { cn } from '../../lib/utils'
import type { TNode } from '../../types'

import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useDesignStore } from '../../stores/useDesignStore'

interface CanvasNodeProps {
  node: TNode
  selectedNodeId: string | null
  onSelectNode: (nodeId: string | null) => void
}

export default function CanvasNode({
  node,
  selectedNodeId,
  onSelectNode,
}: CanvasNodeProps) {
  const isSelected = selectedNodeId === node.id;
  const updateNodePosition = useDesignStore((state) => state.updateNodePosition);


   // Configurar drag and drop solo para nodos seleccionados
  const { isDragging, position, handlers, cursor } = useDragAndDrop({
    nodeId: node.id,
    initialX: node.x || 0,
    initialY: node.y || 0,
    onDragMove: (x, y) => {
      // Actualizar posición en tiempo real mientras se arrastra
      updateNodePosition(node.id, x, y);
    },
    onDragEnd: (x, y) => {
      // Guardar posición final
      updateNodePosition(node.id, x, y);
    },
    disabled: !isSelected || node.name.toLowerCase() === 'body',
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  // Convert style properties into react-compatible camelCase inline styles
  const getInlineStyles = () => {
    const inlineStyles: React.CSSProperties = {};
    if (!node.styles) return inlineStyles;

    Object.entries(node.styles).forEach(([key, val]) => {
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      (inlineStyles as any)[camelKey] = val;
    });

    return inlineStyles;
  };

  // Construir el estilo base con posicionamiento absoluto
  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      ...getInlineStyles(),
    };

       // Usar la posición actual del drag si está activo
    if (isDragging && isSelected) {
      styles.left = `${position.x}px`;
      styles.top = `${position.y}px`;
    } else {
      if (node.x !== undefined) styles.left = `${node.x}px`;
      if (node.y !== undefined) styles.top = `${node.y}px`;
    }

    if (node.zIndex !== undefined) styles.zIndex = node.zIndex;
    
    // Agregar cursor para drag
    if (isSelected && node.name.toLowerCase() !== 'body') {
      styles.cursor = cursor;
    }

    return styles;
  };


  const style = getPositionStyles();

  // Render container node
  if (node.type === 'container') {
    const isBody = node.name.toLowerCase() === 'body';
    
    // Para el body, no usamos posición absoluta
    if (isBody) {
      return (
        <div
          style={{ ...style, position: 'relative' }}
          onClick={handleClick}
          {...handlers}
          className={cn(
            'relative transition-all duration-150 w-full min-h-full bg-white',
            isSelected && 'outline-2 outline-blue-600 -outline-offset-2'
          )}
        >
          {node.children && node.children.length > 0 ? (
            node.children.map((child) => (
              <CanvasNode
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
              />
            ))
          ) : (
            <div className="absolute  text-center py-6 text-[11px] text-gray-400 font-semibold border border-dashed border-gray-200 bg-gray-50/50 rounded-sm">
              Empty {node.name}
            </div>
          )}
        </div>
      );
    }

    // Container normal con posición absoluta
    return (
      <div
        style={style}
        onClick={handleClick}
        {...handlers}
        className={cn(
          'transition-all duration-150',
          'border border-dashed border-gray-200 rounded-md hover:border-blue-300',
          isSelected && 'outline-2 outline-blue-600 outline-offset-1',
          isDragging && 'opacity-80 shadow-lg scale-[1.02] rotate-1 cursor-grabbing'
        )}
      >
        {/* Visual selector border line for selected node */}
        {isSelected && (
          <div className="absolute  bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
            {node.name}
          </div>
        )}

        {node.children && node.children.length > 0 ? (
          <div className="relative" style={{ minWidth: '100px', minHeight: '100px' }}>
            {node.children.map((child) => (
              <CanvasNode
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-[11px] text-gray-400 font-semibold border border-dashed border-gray-200 bg-gray-50/50 rounded-sm min-w-[100px]">
            Empty {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render text/paragraph node
  if (node.type === 'paragraph') {
    return (
      <div style={style} className="relative group/text">
        <p
          onClick={handleClick}
          className={cn(
            'text-gray-700 text-sm leading-relaxed p-1 hover:bg-blue-50/30 rounded transition-colors m-0',
            isSelected && 'outline-2 outline-blue-600 rounded-sm',
            isDragging && 'opacity-80 shadow-lg cursor-grabbing'
          )}
        >
          {node.content || 'Start typing text here...'}
        </p>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render heading node
  if (node.type === 'heading') {
    return (
      <div style={style} className="relative group/text">
        <h2
          onClick={handleClick}
          className={cn(
            'text-gray-900 text-lg font-bold p-1 hover:bg-blue-50/30 rounded transition-colors m-0',
            isSelected && 'outline-2 outline-blue-600 rounded-sm',
            isDragging && 'opacity-80 shadow-lg cursor-grabbing'
          )}
        >
          {node.content || 'Heading'}
        </h2>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render image node
  if (node.type === 'image') {
    return (
      <div
        style={style}
        onClick={handleClick}
        className={cn(
          'relative p-1 rounded hover:bg-blue-50/30 transition-all overflow-hidden',
          isSelected && 'outline-2 outline-blue-600 rounded-sm',
          isDragging && 'opacity-80 shadow-lg cursor-grabbing'
        )}
      >
        <img
          src={node.content || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60'}
          alt={node.name}
          className="max-w-full h-auto rounded-md shadow-xs object-cover block"
          style={node.styles}
        />
        {isSelected && (
          <div className="absolute -top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render variable node
  if (node.type === 'variable') {
    return (
      <div style={style} className="relative inline-block">
        <span
          onClick={handleClick}
          className={cn(
            'inline-block text-black text-xs font-mono',
            isSelected && 'outline-2 outline-blue-600',
            isDragging && 'opacity-80 shadow-lg cursor-grabbing'
          )}
        >
          {`{${node.content || node.name}}`}
        </span>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
            Variable
          </div>
        )}
      </div>
    );
  }

  // Fallback for other nodes
  return (
    <div
      onClick={handleClick}
      style={style}
      {...handlers}
      className={cn(
        'p-3 border border-gray-200 rounded text-xs font-semibold hover:border-blue-400 cursor-pointer',
        isSelected && 'border-blue-600 ring-2 ring-blue-100',
        isDragging && 'opacity-80 shadow-lg cursor-grabbing'
      )}
    >
      {node.name} ({node.type})
    </div>
  );
}