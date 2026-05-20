// src/lib/utils.ts
import type { TNode } from '../types/index';
import { NODE_TYPES } from './constants';



// Generar ID único (reemplaza crypto.randomUUID en caso de no estar disponible)
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Crear un nuevo nodo con valores por defecto
export function createNode(type: keyof typeof NODE_TYPES, parentId: string | null = null): TNode {
  const config = NODE_TYPES[type];
  return {
    id: generateId(),
    type,
    name: config.label,
    content: config.defaultContent || '',
    children: [],
    parentId,
    depth: 0,
    index: 0,
    styles: { ...config.defaultStyles },
    attributes: {},
    isVisible: true,
    isLocked: false,
  };
}

// Encontrar un nodo por ID en el árbol
export function findNodeById(nodes: TNode[], id: string): TNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Eliminar un nodo por ID
export function removeNodeById(nodes: TNode[], id: string): TNode[] {
  return nodes
    .filter(node => node.id !== id)
    .map(node => ({
      ...node,
      children: removeNodeById(node.children, id),
    }));
}

// Actualizar un nodo por ID
export function updateNodeById(
  nodes: TNode[],
  id: string,
  updates: Partial<TNode>
): TNode[] {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    if (node.children.length > 0) {
      return {
        ...node,
        children: updateNodeById(node.children, id, updates),
      };
    }
    return node;
  });
}

// Mover un nodo en el árbol
export function moveNode(
  nodes: TNode[],
  fromIndex: number,
  toIndex: number
): TNode[] {
  const result = [...nodes];
  const [movedNode] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, movedNode);
  
  // Actualizar índices
  return result.map((node, index) => ({
    ...node,
    index,
  }));
}

// Duplicar un nodo
export function duplicateNode(nodes: TNode[], nodeId: string): TNode[] {
  const node = findNodeById(nodes, nodeId);
  if (!node) return nodes;
  
  const duplicated = {
    ...node,
    id: generateId(),
    name: `${node.name} (copy)`,
    children: node.children.map(child => ({
      ...child,
      id: generateId(),
      parentId: node.id,
    })),
  };
  
  const index = nodes.findIndex(n => n.id === nodeId);
  const result = [...nodes];
  result.splice(index + 1, 0, duplicated);
  
  return result;
}

// Serializar nodos para guardar
export function serializeNodes(nodes: TNode[]): string {
  return JSON.stringify(nodes);
}

// Deserializar nodos al cargar
export function deserializeNodes(data: string): TNode[] {
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Obtener la ruta de un nodo (breadcrumb)
export function getNodePath(nodes: TNode[], nodeId: string): TNode[] {
  const path: TNode[] = [];
  
  function traverse(currentNodes: TNode[]): boolean {
    for (const node of currentNodes) {
      if (node.id === nodeId) {
        path.push(node);
        return true;
      }
      if (node.children.length > 0 && traverse(node.children)) {
        path.unshift(node);
        return true;
      }
    }
    return false;
  }
  
  traverse(nodes);
  return path;
}

// Formatear nombre de nodo para display
export function formatNodeName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
}

// Clase condicional (reemplaza cn() de Shadcn/ui)
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}