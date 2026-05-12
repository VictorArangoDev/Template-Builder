// src/types/index.ts

// Tipos de nodo/elemento para documentos
export type NodeType = 
  | 'heading' 
  | 'paragraph' 
  | 'image' 
  | 'table' 
  | 'variable'
  | 'container'
  | 'row'
  | 'column';

// Un nodo del documento
export interface TNode {
  id: string;
  type: NodeType;
  name: string;
  content: string;
  children: TNode[];
  parentId: string | null;
  depth: number;
  index: number;
  styles: Record<string, string>;
  attributes: Record<string, any>;
  variableKey?: string;
  isVisible: boolean;
  isLocked: boolean;
}

// Proyecto/Documento
export interface TProject {
  id: string;
  name: string;
  nodes: TNode[];
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Colección para variables dinámicas
export interface TCollection {
  id: string;
  name: string;
  fields: TCollectionField[];
}

// Campo de colección
export interface TCollectionField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'image' | 'boolean' | 'date';
}

// Configuración de tipos de capa/nodo
export interface TNodeTypeConfig {
  type: NodeType;
  label: string;
  icon: string;
  description: string;
  category: 'text' | 'media' | 'layout' | 'dynamic';
  defaultContent: string;
  defaultStyles: Record<string, string>;
  canHaveChildren: boolean;
  maxChildren?: number;
}

// Estado del editor
export interface TEditorState {
  project: TProject | null;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  isDragging: boolean;
  clipboard: TNode | null;
  history: TProject[];
  historyIndex: number;
}