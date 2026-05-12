// src/components/layers/layer-utils.ts
import type { TNode, NodeType } from '../../types';
import { NODE_TYPES } from '../../lib/constants';

// Obtener configuración de un tipo de nodo
export function getNodeConfig(type: NodeType) {
  return NODE_TYPES[type];
}

// Verificar si un nodo puede tener hijos
export function canHaveChildren(type: NodeType): boolean {
  return NODE_TYPES[type]?.canHaveChildren || false;
}

// Verificar si un nodo puede ser arrastrado
export function isDraggable(node: TNode): boolean {
  return !node.isLocked;
}

// Verificar si un nodo puede ser eliminado
export function isDeletable(node: TNode): boolean {
  return !node.isLocked;
}

// Verificar si un nodo puede ser padre de otro
export function canBeParent(parentType: NodeType, childType: NodeType): boolean {
  const parentConfig = NODE_TYPES[parentType];
  if (!parentConfig?.canHaveChildren) return false;
  
  // Reglas específicas de anidamiento
  switch (parentType) {
    case 'table':
      return childType === 'row';
    case 'row':
      return childType === 'column';
    case 'column':
      return ['heading', 'paragraph', 'image', 'variable'].includes(childType);
    case 'container':
      return ['heading', 'paragraph', 'image', 'variable', 'container'].includes(childType);
    default:
      return false;
  }
}

// Obtener profundidad máxima permitida
export function getMaxDepth(type: NodeType): number {
  // Profundidad máxima por tipo
  const depthMap: Record<string, number> = {
    table: 3,
    container: 5,
    row: 2,
    column: 1,
  };
  return depthMap[type] || 10;
}

// Calcular profundidad de un nodo en el árbol
export function calculateDepth(nodes: TNode[], targetId: string, currentDepth: number = 0): number {
  for (const node of nodes) {
    if (node.id === targetId) return currentDepth;
    if (node.children.length > 0) {
      const depth = calculateDepth(node.children, targetId, currentDepth + 1);
      if (depth >= 0) return depth;
    }
  }
  return -1;
}

// Obtener todos los IDs hijos (incluyendo anidados)
export function getAllChildIds(node: TNode): string[] {
  const ids: string[] = [];
  
  function traverse(n: TNode) {
    n.children.forEach(child => {
      ids.push(child.id);
      traverse(child);
    });
  }
  
  traverse(node);
  return ids;
}

// Contar hijos totales
export function countTotalChildren(node: TNode): number {
  return getAllChildIds(node).length;
}

// Verificar límite de hijos
export function hasReachedChildLimit(node: TNode): boolean {
  const config = NODE_TYPES[node.type];
  if (!config || !config.maxChildren) return false;
  return node.children.length >= config.maxChildren;
}