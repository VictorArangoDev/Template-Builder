import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { DesignNode, DesignPage, NodeType } from '../types/design';

interface DesignState {
  // Datos
  pages: DesignPage[];
  currentPageId: string | null;
  selectedNodeId: string | null;
  // Derivado: nodos de la página actual (se actualiza al cambiar de página)
  nodes: DesignNode[];

  // Acciones de proyecto
  setPages: (pages: DesignPage[]) => void;
  setCurrentPage: (pageId: string) => void;

  // Mutaciones del árbol
  addNode: (parentId: string | null, type: NodeType, index?: number) => void;
  updateNode: (nodeId: string, partial: Partial<DesignNode>) => void;
  deleteNode: (nodeId: string) => void;
  moveNode: (nodeId: string, newParentId: string, index: number) => void;
  duplicateNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  renameNode: (nodeId: string, name: string) => void;

  // Utilidades de búsqueda
  findNode: (nodeId: string) => DesignNode | null;
  findParent: (nodeId: string) => DesignNode | null;
}

// Helpers recursivos (fuera del store para reutilización)
function findNodeById(nodes: DesignNode[], id: string): DesignNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children.length > 0) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

function findParentNode(nodes: DesignNode[], childId: string, parent: DesignNode | null = null): DesignNode | null {
  for (const node of nodes) {
    if (node.children.some(child => child.id === childId)) return node;
    if (node.children.length > 0) {
      const found = findParentNode(node.children, childId, node);
      if (found) return found;
    }
  }
  return parent;
}

// Función para reemplazar un nodo en un array de forma inmutable (devuelve nuevo array)
function replaceNodeInArray(nodes: DesignNode[], nodeId: string, replacer: (node: DesignNode) => DesignNode): DesignNode[] {
  return nodes.map(node => {
    if (node.id === nodeId) return replacer(node);
    if (node.children.length > 0) {
      return { ...node, children: replaceNodeInArray(node.children, nodeId, replacer) };
    }
    return node;
  });
}

// Función para eliminar un nodo (devuelve nuevo array sin el nodo)
function removeNodeFromArray(nodes: DesignNode[], nodeId: string): DesignNode[] {
  return nodes
    .filter(node => node.id !== nodeId)
    .map(node => ({
      ...node,
      children: removeNodeFromArray(node.children, nodeId),
    }));
}

// Función para mover un nodo (la hacemos dentro del store con immer para simplicidad)

export const useDesignStore = create<DesignState>()(
  immer((set, get) => ({
    pages: [
      {
        id: 'page-1',
        title: 'Página 1',
        slug: 'index',
        nodes: [
          {
            id: 'node-1',
            type: 'heading',
            name: 'Título',
            props: { text: 'Bienvenido al Constructor', level: 1 },
            styles: { textAlign: 'center', margin: 'my-8' },
            children: []
          }
        ]
      }
    ],
    currentPageId: 'page-1',
    selectedNodeId: null,
    nodes: [
      {
        id: 'node-1',
        type: 'heading',
        name: 'Título',
        props: { text: 'Bienvenido al Constructor', level: 1 },
        styles: { textAlign: 'center', margin: 'my-8' },
        children: []
      }
    ],

    // ─── PROYECTO ──────────────────────────
    setPages: (pages) => {
      set(state => {
        state.pages = pages;
        // Si hay páginas, selecciona la primera por defecto
        if (pages.length > 0 && !state.currentPageId) {
          state.currentPageId = pages[0].id;
          state.nodes = pages[0].nodes;
        }
      });
    },

    setCurrentPage: (pageId) => {
      set(state => {
        const page = state.pages.find((p: { id: string; }) => p.id === pageId);
        if (page) {
          state.currentPageId = page.id;
          state.nodes = page.nodes;
          state.selectedNodeId = null; // Limpiar selección al cambiar de página
        }
      });
    },

    // ─── MUTACIONES DEL ÁRBOL ─────────────
    addNode: (parentId, type, index) => {
      set(state => {
        const newNode: DesignNode = {
          id: uuidv4(),
          type,
          name: type, // Nombre inicial según tipo
          props: {},
          styles: {},
          children: [],
        };

        if (!parentId) {
          // Insertar en la raíz de la página actual
          const nodes = state.nodes;
          const insertionIndex = index ?? nodes.length;
          nodes.splice(insertionIndex, 0, newNode as never); // immer permite mutar
        } else {
          // Encontrar el padre y agregar al array de hijos
          const insertInParent = (nodes: DesignNode[]): boolean => {
            for (const node of nodes) {
              if (node.id === parentId) {
                const children = node.children;
                const insertionIndex = index ?? children.length;
                children.splice(insertionIndex, 0, newNode as never);
                return true;
              }
              if (node.children.length > 0 && insertInParent(node.children)) {
                return true;
              }
            }
            return false;
          };
          insertInParent(state.nodes);
        }
        // Sincronizar el cambio en la página actual dentro de pages
        const currentPage = state.pages.find((p: { id: string }) => p.id === state.currentPageId);
        if (currentPage) {
          currentPage.nodes = state.nodes;
        }
        // Seleccionar el nuevo nodo automáticamente
        state.selectedNodeId = newNode.id;
      });
    },

    updateNode: (nodeId, partial) => {
      set(state => {
        const update = (nodes: DesignNode[]) => {
          for (const node of nodes) {
            if (node.id === nodeId) {
              Object.assign(node, partial); // immer hace copia inmutable
              return true;
            }
            if (node.children.length > 0 && update(node.children)) {
              return true;
            }
          }
          return false;
        };
        update(state.nodes);
        // Sincronizar página
        const currentPage = state.pages.find((p: { id:string }) => p.id === state.currentPageId);
        if (currentPage) currentPage.nodes = state.nodes;
      });
    },

    deleteNode: (nodeId) => {
      set(state => {
        state.nodes = removeNodeFromArray(state.nodes, nodeId);
        const currentPage = state.pages.find((p: { id:string }) => p.id === state.currentPageId);
        if (currentPage) currentPage.nodes = state.nodes;
        // Si el nodo eliminado estaba seleccionado, limpiar selección
        if (state.selectedNodeId === nodeId) {
          state.selectedNodeId = null;
        }
      });
    },

    moveNode: (nodeId, newParentId, index) => {
      set(state => {
        // 1. Encontrar el nodo a mover y eliminarlo temporalmente (guardando referencia)
        let nodeToMove: DesignNode | null = null;
        const removeAndGet = (nodes: DesignNode[]): DesignNode[] => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
              nodeToMove = { ...nodes[i] }; // copia profunda
              return nodes.filter(n => n.id !== nodeId);
            }
            if (nodes[i].children.length > 0) {
              nodes[i].children = removeAndGet(nodes[i].children);
            }
          }
          return nodes;
        };
        state.nodes = removeAndGet(state.nodes);

        if (!nodeToMove) return; // nodo no encontrado

        // 2. Insertar en el nuevo padre
        if (newParentId === null) {
          const insertionIndex = index ?? state.nodes.length;
          state.nodes.splice(insertionIndex, 0, nodeToMove as never);
        } else {
          const insertInParent = (nodes: DesignNode[]): boolean => {
            for (const node of nodes) {
              if (node.id === newParentId) {
                const children = node.children;
                const insertionIndex = index ?? children.length;
                children.splice(insertionIndex, 0, nodeToMove!);
                return true;
              }
              if (node.children.length > 0 && insertInParent(node.children)) {
                return true;
              }
            }
            return false;
          };
          insertInParent(state.nodes);
        }

        // Sincronizar página
        const currentPage = state.pages.find((p: { id:string }) => p.id === state.currentPageId);
        if (currentPage) currentPage.nodes = state.nodes;
      });
    },

    duplicateNode: (nodeId) => {
      set(state => {
        const duplicateRecursive = (node: DesignNode): DesignNode => ({
          ...node,
          id: uuidv4(),
          name: `${node.name} (copia)`,
          children: node.children.map(duplicateRecursive),
        });

        const update = (nodes: DesignNode[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
              const original = nodes[i];
              const copy = duplicateRecursive(original);
              nodes.splice(i + 1, 0, copy as never);
              return true;
            }
            if (nodes[i].children.length > 0 && update(nodes[i].children)) {
              return true;
            }
          }
          return false;
        };
        update(state.nodes);

        const currentPage = state.pages.find((p: { id:string }) => p.id === state.currentPageId);
        if (currentPage) currentPage.nodes = state.nodes;
      });
    },

    selectNode: (nodeId) => {
      set(state => { state.selectedNodeId = nodeId; });
    },

    renameNode: (nodeId, name) => {
      set(state => {
        const update = (nodes: DesignNode[]) => {
          for (const node of nodes) {
            if (node.id === nodeId) {
              node.name = name;
              return true;
            }
            if (node.children.length > 0 && update(node.children)) {
              return true;
            }
          }
          return false;
        };
        update(state.nodes);
      });
    },

    // ─── UTILIDADES DE BÚSQUEDA ──────────
    findNode: (nodeId) => {
      return findNodeById(get().nodes, nodeId);
    },

    findParent: (nodeId) => {
      return findParentNode(get().nodes, nodeId);
    },
  }))
);