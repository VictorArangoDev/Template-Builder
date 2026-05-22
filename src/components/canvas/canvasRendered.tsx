'use client';

import React, { useState } from 'react';
import { Home, ChevronDown, Undo2, Redo2 } from 'lucide-react';
import { useDesignStore } from '../../stores/useDesignStore';
import CanvasNode from './canvasNode';
import type { TNode } from '../../types';
import { cn } from '../../lib/utils';
import './canvas.css';

interface CanvasRendererProps {
  nodes: TNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  isDragging?: boolean;
}

type DeviceType = 'desktop' | 'tablet' | 'phone';

const deviceWidths: Record<DeviceType, string> = {
  desktop: '100%',
  tablet: '768px',
  phone: '375px',
};

export default function CanvasRenderer({
  nodes,
  selectedNodeId,
  onSelectNode,
  isDragging = false,
}: CanvasRendererProps) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [zoom, setZoom] = useState(81);
  
  const designStore = useDesignStore();
  const currentPage = designStore.pages.find(p => p.id === designStore.currentPageId) || designStore.pages[0];

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking canvas background
    if (e.target === e.currentTarget) {
      onSelectNode(null);
    }
  };

  const handleCanvasPagesToggle = () =>{
    //TODO: Funcion para la seleccion de pagins.
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f3f4f6] min-w-0 select-none">
      {/* Canvas Toolbar (Header of the workspace) */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0">
        
        {/* Left Side: Page Selector Dropdown */}
        <div className="relative">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors text-gray-700"
          onClick={
            handleCanvasPagesToggle
          }
          
          >
            <Home className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
            <span>{currentPage?.title || 'Page'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
            
          </button>
        </div>

       
        {/* Right Side: Zoom and Undo/Redo */}
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors bg-white">
            <span>{zoom}%</span>
            <ChevronDown className="w-3 h-3 text-gray-400 stroke-[2.2]" />
          </button>

          <div className="h-4 w-[1px] bg-gray-200 mx-1" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-700">
              <Undo2 className="w-4 h-4 stroke-[2.2]" />
            </button>
            <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-700">
              <Redo2 className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas workspace area */}
      <div 
        className="flex-1 overflow-auto p-8 flex justify-center items-start bg-[#f3f4f6]"
        onClick={handleCanvasClick}
      >
        <div
          className={cn(
            "bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300 min-h-[calc(100vh-180px)] overflow-hidden",
            isDragging && "border-blue-300 ring-2 ring-blue-100"
          )}
          style={{
            width: '816px',
            height:'1056px',
            maxWidth: '100%',
          }}
        >
          {/* Render nodes recursively */}
          {nodes.length > 0 ? (
            nodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <p className="text-sm font-semibold">No nodes in project</p>
              <p className="text-xs text-gray-400 mt-1">Select layers panel to add elements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}