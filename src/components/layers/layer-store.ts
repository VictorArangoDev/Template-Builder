// src/components/layers/layers-store.ts
import { create } from 'zustand';
import type { TNode, TProject } from '../../types';
import { createNode, findNodeById, removeNodeById, updateNodeById, moveNode, duplicateNode, generateId } from '../../lib/utils';

interface LayersState {
  // Estado
  project: TProject | null;
  nodes: TNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  isDragging: boolean;
  expandedNodes: Set<string>;

  // Acciones
  setProject: (project: TProject) => void;
  setNodes: (nodes: TNode[]) => void;
  
  // CRUD de nodos
  addNode: (type: string, parentId?: string | null, index?: number) => void;
  updateNode: (nodeId: string, updates: Partial<TNode>) => void;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (fromIndex: number, toIndex: number) => void;
  
  // Selección
  selectNode: (nodeId: string | null) => void;
  hoverNode: (nodeId: string | null) => void;
  getSelectedNode: () => TNode | null;
  
  // Expansión/colapso
  toggleExpanded: (nodeId: string) => void;
  isExpanded: (nodeId: string) => boolean;
  
  // Drag & Drop
  setIsDragging: (isDragging: boolean) => void;
}

export const useLayersStore = create<LayersState>((set, get) => ({
  project: null,
  nodes: [],
  selectedNodeId: null,
  hoveredNodeId: null,
  isDragging: false,
  expandedNodes: new Set<string>(),

  setProject: (project) => {
    set({
      project,
      nodes: project.nodes || [],
      selectedNodeId: null,
    });
  },

  setNodes: (nodes) => {
    set({
      nodes: nodes || [],
      selectedNodeId: null,
      hoveredNodeId: null,
      isDragging: false,
    });
  },

  addNode: (type, parentId = null, index) => {
    const { nodes, selectedNodeId } = get();
    const newNode = createNode(type as any, parentId);
    
    let updatedNodes: TNode[];
    
    if (parentId) {
      // Añadir como hijo de un nodo específico
      const parentNode = findNodeById(nodes, parentId);
      if (!parentNode) return;
      
      const newChildren = [...parentNode.children];
      if (typeof index === 'number') {
        newChildren.splice(index, 0, newNode);
      } else {
        newChildren.push(newNode);
      }
      
      updatedNodes = updateNodeById(nodes, parentId, {
        children: newChildren,
      });
    } else {
      // Añadir al nivel raíz
      if (typeof index === 'number') {
        const newNodes = [...nodes];
        newNodes.splice(index, 0, newNode);
        updatedNodes = newNodes;
      } else {
        updatedNodes = [...nodes, newNode];
      }
    }
    
    set({
      nodes: updatedNodes.map((n, i) => ({ ...n, index: i })),
      selectedNodeId: newNode.id,
    });
    
    // Auto-expandir el padre
    if (parentId) {
      get().toggleExpanded(parentId);
    }
  },

  updateNode: (nodeId, updates) => {
    const { nodes } = get();
    const updatedNodes = updateNodeById(nodes, nodeId, updates);
    set({ nodes: updatedNodes });
  },

  removeNode: (nodeId) => {
    const { nodes, selectedNodeId } = get();
    const updatedNodes = removeNodeById(nodes, nodeId);
    set({
      nodes: updatedNodes.map((n, i) => ({ ...n, index: i })),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
    });
  },

  duplicateNode: (nodeId) => {
    const { nodes } = get();
    const updatedNodes = duplicateNode(nodes, nodeId);
    set({ nodes: updatedNodes.map((n, i) => ({ ...n, index: i })) });
  },

  moveNode: (fromIndex, toIndex) => {
    const { nodes } = get();
    const updatedNodes = moveNode(nodes, fromIndex, toIndex);
    set({ nodes: updatedNodes });
  },

  selectNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },

  hoverNode: (nodeId) => {
    set({ hoveredNodeId: nodeId });
  },

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return findNodeById(nodes, selectedNodeId);
  },

  toggleExpanded: (nodeId) => {
    const { expandedNodes } = get();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    set({ expandedNodes: newExpanded });
  },

  isExpanded: (nodeId) => {
    return get().expandedNodes.has(nodeId);
  },

  setIsDragging: (isDragging) => {
    set({ isDragging });
  },
}));