// src/components/canvas/canvasRendered.tsx
'use client';

import React, { useCallback, useRef } from 'react';
import  { useLayersStore } from '../layers/layer-store';
import { CanvasNode } from './canvasNode';
import type { TNode } from '../../types';
import './canvas.css';

interface CanvasRendererProps {
  nodes: TNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  isDragging?: boolean;
}

export default function CanvasRenderer({
  nodes,
  selectedNodeId,
  onSelectNode,
  isDragging = false,
}: CanvasRendererProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Manejar click en el fondo del canvas para deseleccionar
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      // Solo deseleccionar si se hace click directamente en el canvas
      if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvasArea) {
        onSelectNode(null);
      }
    },
    [onSelectNode]
  );

  // Manejar drop de nuevos elementos desde el AddElementPanel
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('application/node-type');
      
      if (nodeType) {
        const layersStore = useLayersStore.getState();
        layersStore.addNode(nodeType as any, null);
      }
    },
    []
  );

  // Permitir drop en el canvas
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      ref={canvasRef}
      className="canvas-renderer"
      data-canvas-area="true"
      onClick={handleCanvasClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Área de contenido del documento */}
      <div className="canvas-renderer__document">
        {/* Indicador de documento vacío */}
        {(!nodes || nodes.length === 0) && (
          <div className="canvas-renderer__empty">
            <div className="canvas-renderer__empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="canvas-renderer__empty-title">Empty Document</h3>
            <p className="canvas-renderer__empty-text">
              Drag elements from the left panel or click "Add Elements" to start building your document.
            </p>
          </div>
        )}

        {/* Renderizado de nodos */}
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            depth={0}
            isSelected={node.id === selectedNodeId}
            onSelect={onSelectNode}
            isDragging={isDragging}
          />
        ))}
      </div>

      {/* Indicador de arrastre sobre el canvas */}
      <div className="canvas-renderer__drop-indicator" data-canvas-area="true">
        <span data-canvas-area="true">Drop here to add element</span>
      </div>
    </div>
  );
}