'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Home, ChevronDown, Undo2, Redo2, Plus, Minus } from 'lucide-react';
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

export default function CanvasRenderer({
  nodes,
  selectedNodeId,
  onSelectNode,
  isDragging = false,
}: CanvasRendererProps) {
  //ZOOM
  const [zoom, setZoom] = useState(100);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const zoomRef = useRef<HTMLDivElement>(null);
  const zoomOptions =[25,50,75,100,125,150];

  const handleZoomChange = (newZoom:number) =>{
    setZoom(newZoom),
    setIsZoomOpen(false);
  }

  const handleZoomIn = () => {
    const nextZoom = Math.min(200, zoom + 25);
    setZoom(nextZoom);
  };

  const handleZoomOut = () => {
    const nextZoom = Math.max(25, zoom - 25);
    setZoom(nextZoom);
  };



  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const designStore = useDesignStore();
  const currentPage = designStore.pages.find(p => p.id === designStore.currentPageId) || designStore.pages[0];
  const listPages = designStore.pages;

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPagesOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú de zoom al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (zoomRef.current && !zoomRef.current.contains(event.target as Node)) {
        setIsZoomOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectNode(null);
    }
  };

  const handleCanvasPagesToggle = () => {
    setIsPagesOpen(!isPagesOpen);
  };

  const handlePageSelect = (page: any) => {
    designStore.setCurrentPage(page.id);
    setIsPagesOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f3f4f6] min-w-0 select-none">
      {/* Canvas Toolbar (Header of the workspace) */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0">
        
        {/* Left Side: Page Selector Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-semibold hover:bg-gray-100 transition-colors text-gray-700"
            onClick={handleCanvasPagesToggle}
          >
            <Home className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
            <span>{currentPage?.title || 'Page'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
          </button>
          
          {/* Menú desplegable de páginas */}
          {isPagesOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {listPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => handlePageSelect(page)}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                    currentPage?.id === page.id ? 'bg-gray-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {page.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Zoom and Undo/Redo */}
        <div className="flex items-center gap-2">
         
          <div className="relative" ref={zoomRef}>
            <button 
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors bg-white"
              onClick={() => setIsZoomOpen(!isZoomOpen)}
            >
              <span>{zoom}%</span>
              <ChevronDown className="w-3 h-3 text-gray-400 stroke-[2.2]" />
            </button>
            
            {isZoomOpen && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {zoomOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleZoomChange(option)}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${
                      zoom === option ? 'bg-gray-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {option}%
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Controles de zoom + y - */}
          <div className="flex items-center gap-0.5">
            <button 
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-700"
              disabled={zoom <= 25}
            >
             <Minus className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-700"
              disabled={zoom >= 200}
            >
             <Plus className="w-3.5 h-3.5 text-gray-400 stroke-[2.2]" />
            </button>
          </div>

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
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'center top',
            position:'relative',
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