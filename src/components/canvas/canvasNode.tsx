import React from 'react'
import { cn } from '../../lib/utils'
import type { TNode } from '../../types'

import { useDragAndDrop } from '../../hooks/useDragAndDrop'
import { useLayersStore } from '../layers/layer-store'

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
  const updateNode = useLayersStore((state) => state.updateNode);

  const isBody = node.name.toLowerCase() === 'body';

  // Configurar drag and drop
  const { isDragging, handlers, cursor, elementRef } = useDragAndDrop({
    nodeId: node.id,
    initialX: node.x || 0,
    initialY: node.y || 0,
    onDragEnd: (x, y) => {
      // Persistir posición final en el store que realmente renderiza el canvas
      updateNode(node.id, { x, y });
    },
    disabled: !isSelected || isBody,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  const getInlineStyles = () => {
    const inlineStyles: React.CSSProperties = {};
    if (!node.styles) return inlineStyles;

    Object.entries(node.styles).forEach(([key, val]) => {
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      (inlineStyles as any)[camelKey] = val;
    });

    return inlineStyles;
  };

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: isBody ? 'relative' : 'absolute',
      top: 0,
      left: 0,
      ...getInlineStyles(),
    };

    // Inicializar la transformación de coordenadas
    if (!isBody) {
      styles.transform = `translate(${node.x || 0}px, ${node.y || 0}px)`;
    }

    if (node.zIndex !== undefined) styles.zIndex = node.zIndex;
    
    if (isSelected && !isBody) {
      styles.cursor = cursor;
    }

    return styles;
  };

  const style = getPositionStyles();

  // 1. RENDER CONTAINER NODE
  if (node.type === 'container') {
    if (isBody) {
      return (
        <div
          style={style}
          onClick={handleClick}
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
            <div className="absolute text-center py-6 text-[11px] text-gray-400 font-semibold border border-dashed border-gray-200 bg-gray-50/50 rounded-sm">
              Empty {node.name}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={style}
        onClick={handleClick}
        {...handlers}
        className={cn(
          'transition-shadow duration-150',
          'border border-dashed border-gray-200 rounded-md hover:border-blue-300',
          isSelected && 'outline-2 outline-blue-600 outline-offset-1',
          isDragging && 'opacity-80 shadow-lg scale-[1.01] cursor-grabbing compliance-layer'
        )}
      >
        {isSelected && (
          <div className="absolute -top-5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-20 pointer-events-none select-none whitespace-nowrap">
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

  // 2. RENDER PARAGRAPH NODE
  if (node.type === 'paragraph') {
    return (
      <div 
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={style} 
        onClick={handleClick}
        {...handlers}
        className="relative group/text"
      >
        <p
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

  // 3. RENDER HEADING NODE
  if (node.type === 'heading') {
    return (
      <div 
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={style} 
        onClick={handleClick}
        {...handlers}
        className="relative group/text"
      >
        <h2
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

  // 4. RENDER IMAGE NODE
  if (node.type === 'image') {
    return (
      <div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={style}
        onClick={handleClick}
        {...handlers}
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

  // 5. RENDER VARIABLE NODE
  if (node.type === 'variable') {
    return (
      <div 
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={style}
        onClick={handleClick}
        {...handlers}
        className="relative inline-block"
      >
        <span
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

  // FALLBACK FOR OTHER NODES
  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      onClick={handleClick}
      style={style}
      {...handlers}
      className={cn(
        'p-3 border border-gray-200 rounded text-xs font-semibold hover:border-blue-400',
        isSelected && 'border-blue-600 ring-2 ring-blue-100',
        isDragging && 'opacity-80 shadow-lg cursor-grabbing'
      )}
    >
      {node.name} ({node.type})
    </div>
  );
}