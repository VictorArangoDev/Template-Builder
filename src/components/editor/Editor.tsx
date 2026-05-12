// src/components/EditorApp.tsx

import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent} from '@dnd-kit/core';
import { useEffect, useState, useCallback } from 'react';
import { useDesignStore } from '../../stores/useDesignStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useComponentsStore } from '../../stores/useComponentStore';
import { useLayersStore } from '../layers/layer-store';
import CanvasRenderer from '../canvas/canvasRendered';
import { LayersPanel } from '../layers/LayersPanel';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { AddElementPanel } from '../addElementPanel';
import HeaderBar  from '../HeaderBar';
import InlineTextEditor from '../inlineTextEditor';
import type { TNode } from '../../types';
import { findNodeById } from '../../lib/utils';
import { Import } from 'lucide-react';

interface EditorAppProps {
  projectId: string;
}

export default function EditorApp({ projectId }: EditorAppProps) {
  const [loading, setLoading] = useState(true);
  const [activeDragNode, setActiveDragNode] = useState<TNode | null>(null);

  // Stores de Zustand - siguiendo el patrón de Ycode
  const layersStore = useLayersStore();
  const designStore = useDesignStore();
  const editorStore = useEditorStore();
  const componentsStore = useComponentsStore();

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Cargar datos del proyecto
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) throw new Error('Failed to load project');
        
        const project = await response.json();
        
        if (project) {
          designStore.setPages(project.pages || []);
          componentsStore.setComponents(project.components || []);
          
          layersStore.setProject({
            id: project.id,
            name: project.name,
            nodes: project.nodes || [],
            collectionId: project.collectionId || null,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          });
          
          editorStore.setEditorState({
            projectId: project.id,
            activePage: project.activePage || null,
            viewport: 'desktop',
            zoom: 100,
            showGrid: true,
            showGuides: true,
          });
        }
      } catch (error) {
        console.error('Error loading project:', error);
        layersStore.setProject({
          id: projectId,
          name: 'Untitled Document',
          nodes: [],
          collectionId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  // Auto-guardado
  useEffect(() => {
    if (loading) return;

    const saveInterval = setInterval(async () => {
      try {
        const currentProject = {
          id: layersStore.project?.id,
          nodes: layersStore.nodes,
          pages: designStore.pages,
          components: componentsStore.components,
          collectionId: layersStore.project?.collectionId,
        };

        await fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentProject),
        });
      } catch (error) {
        console.error('Error auto-saving project:', error);
      }
    }, 5000);

    return () => clearInterval(saveInterval);
  }, [projectId, loading, layersStore.nodes, designStore.pages, componentsStore.components]);

  // Guardar antes de cerrar
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentProject = {
        id: layersStore.project?.id,
        nodes: layersStore.nodes,
        pages: designStore.pages,
        components: componentsStore.components,
      };
      
      navigator.sendBeacon(
        `/api/projects/${projectId}`,
        JSON.stringify(currentProject)
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [projectId, layersStore.nodes]);

  // Handlers de Drag & Drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const nodeId = active.id as string;
    const node = findNodeById(layersStore.nodes, nodeId);
    
    if (node) {
      setActiveDragNode(node);
      layersStore.setIsDragging(true);
    }
  }, [layersStore.nodes]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const fromIndex = layersStore.nodes.findIndex(n => n.id === active.id);
      const toIndex = layersStore.nodes.findIndex(n => n.id === over.id);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        layersStore.moveNode(fromIndex, toIndex);
      }
    }
    
    setActiveDragNode(null);
    layersStore.setIsDragging(false);
  }, [layersStore.nodes]);

  const handleDragCancel = useCallback(() => {
    setActiveDragNode(null);
    layersStore.setIsDragging(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#2e2e4e] border-t-[#6c6cf0] rounded-full animate-spin" />
          <p className="text-sm text-[#8a8aaa]">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a]">
       <HeaderBar />
        
      <div className="flex flex-1 overflow-hidden">
        {/* 
          AddElementPanel - Se comunica directamente con el store
          No necesita props, igual que en Ycode 
        */}
       
        <AddElementPanel />

        {/* Área central: Canvas con Drag & Drop */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex-1 relative overflow-auto bg-[#1a1a2e]">
            <CanvasRenderer
              nodes={layersStore.nodes}
              selectedNodeId={layersStore.selectedNodeId}
              onSelectNode={(nodeId) => layersStore.selectNode(nodeId)}
              isDragging={layersStore.isDragging}
            />
          </div>

          {/* Overlay del elemento arrastrado */}
          <DragOverlay>
            {activeDragNode ? (
              <div className="px-4 py-2 bg-[#3a3a6a] border border-[#5a5a9a] rounded-lg shadow-lg cursor-grabbing">
                <span className="text-sm font-medium text-white">
                  {activeDragNode.name}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Panel de Capas - Se comunica con el store */}
        <LayersPanel
          nodes={layersStore.nodes}
          selectedNodeId={layersStore.selectedNodeId}
          hoveredNodeId={layersStore.hoveredNodeId}
          expandedNodes={layersStore.expandedNodes}
          onSelectNode={(nodeId) => layersStore.selectNode(nodeId)}
          onHoverNode={(nodeId) => layersStore.hoverNode(nodeId)}
          onDeleteNode={(nodeId) => layersStore.removeNode(nodeId)}
          onDuplicateNode={(nodeId) => layersStore.duplicateNode(nodeId)}
          onToggleVisibility={(nodeId, isVisible) => layersStore.updateNode(nodeId, { isVisible })}
          onToggleLock={(nodeId, isLocked) => layersStore.updateNode(nodeId, { isLocked })}
          onToggleExpand={(nodeId) => layersStore.toggleExpanded(nodeId)}
          onMoveNode={(fromIndex, toIndex) => layersStore.moveNode(fromIndex, toIndex)}
          isDragging={layersStore.isDragging}
        />

        {/* Panel de Propiedades - Se comunica con el store */}
        <PropertiesPanel
          selectedNode={layersStore.getSelectedNode()}
          onUpdateNode={(nodeId, updates) => layersStore.updateNode(nodeId, updates)}
          project={layersStore.project}
        />
      </div>

      {/* Editor de texto inline */}
      {/* <InlineTextEditor
        selectedNode={layersStore.getSelectedNode()}
        onUpdateNode={(nodeId, updates) => layersStore.updateNode(nodeId, updates)}
      /> */}
    </div>
  );
}