import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import type { DesignComponent, DesignNode } from '../types/design';
import { useDesignStore } from './useDesignStore';

interface ComponentsState {
  components: DesignComponent[];
  selectedComponentId: string | null;

  // Carga inicial
  setComponents: (components: DesignComponent[]) => void;

  // CRUD de componentes maestros
  createComponent: (name: string, nodes: DesignNode[]) => void;
  updateComponent: (id: string, partial: Partial<DesignComponent>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;

  // Instancias en el diseño
  createInstance: (componentId: string, parentId: string | null, index?: number) => void;
  detachInstance: (instanceNodeId: string) => void;
  applyOverrides: (instanceNodeId: string, overrides: Record<string, any>) => void;

  // Utilidades
  getComponent: (id: string) => DesignComponent | undefined;
  getResolvedProps: (instanceNode: DesignNode) => DesignNode; // devuelve nodo con props fusionadas
}

// Helpers inmutables
function cloneNodes(nodes: DesignNode[]): DesignNode[] {
  return nodes.map(node => ({
    ...node,
    id: uuidv4(),
    children: cloneNodes(node.children),
    // Mantener las props/estilos originales (se aplicarán overrides después si es necesario)
  }));
}

export const useComponentsStore = create<ComponentsState>()(
  immer((set, get) => ({
    components: [],
    selectedComponentId: null,

    setComponents: (components) =>
      set((state) => {
        state.components = components;
      }),

    createComponent: (name, nodes) => {
      const newComponent: DesignComponent = {
        id: uuidv4(),
        name,
        nodes: nodes.map(node => ({ ...node })), // copia superficial (los hijos se mantienen)
        propsDefinition: [], // por ahora vacío (se pueden definir después)
      };
      set((state) => {
        state.components.push(newComponent);
        state.selectedComponentId = newComponent.id;
      });
    },

    updateComponent: (id, partial) =>
      set((state) => {
        const comp = state.components.find((c : { id: string }) => c.id === id);
        if (comp) {
          Object.assign(comp, partial);
        }
      }),

    deleteComponent: (id) => {
      set((state) => {
        state.components = state.components.filter((c : { id: string }) => c.id !== id);
        if (state.selectedComponentId === id) state.selectedComponentId = null;
      });
      // Opcional: eliminar todas las instancias de este componente del diseño
      // (se puede implementar más adelante)
    },

    selectComponent: (id) =>
      set((state) => {
        state.selectedComponentId = id;
      }),

    createInstance: (componentId, parentId, index) => {
      const designStore = useDesignStore.getState();
      const component = get().components.find(c => c.id === componentId);
      if (!component) return;

      // 1. Insertar el nodo de tipo 'componentInstance' en el árbol
      designStore.addNode(parentId, 'componentInstance', index);
      const newInstanceId = designStore.selectedNodeId; // addNode lo selecciona automáticamente
      if (!newInstanceId) return;

      // 2. Asignar el componentId y el nombre del componente
      designStore.updateNode(newInstanceId, {
        componentId,
        name: component.name,
        props: {},      // Las props se heredan del componente maestro, no se copian aquí
        overrides: {},
      });

      // 3. (Opcional) Quitar la selección del nuevo nodo si se desea
      // designStore.selectNode(null);
    },

    detachInstance: (instanceNodeId) => {
      const designStore = useDesignStore.getState();
      const instanceNode = designStore.findNode(instanceNodeId);
      if (!instanceNode || instanceNode.type !== 'componentInstance') return;

      const component = get().components.find(c => c.id === instanceNode.componentId);
      if (!component) return;

      // Encontrar el padre y el índice de la instancia
      const parent = designStore.findParent(instanceNodeId);
      const siblings = parent ? parent.children : designStore.nodes; // nodos raíz
      const index = siblings.findIndex(n => n.id === instanceNodeId);
      if (index === -1) return;

      // Clone profundo de los nodos maestros (con nuevos IDs)
      const cloned = cloneNodes(component.nodes);

      // Aplicar overrides locales a los nodos clonados
      // (Para simplificar, suponemos que los overrides se aplican en el render, pero al desvincular queremos que se conviertan en props estáticas).
      // Aquí podríamos fusionar las props según la lógica de resolución.
      // Por ahora dejamos los nodos clonados sin overrides; se pierden. (Se puede mejorar después)

      // Eliminar el nodo instancia
      designStore.deleteNode(instanceNodeId);

      // Insertar cada nodo clonado en la misma posición, desplazando el índice
      cloned.forEach((node, i) => {
        designStore.addNode(parent?.id ?? null, node.type, index + i);
        const newId = designStore.selectedNodeId;
        if (newId) {
          // Copiar todas las propiedades del nodo clonado
          designStore.updateNode(newId, {
            name: node.name,
            props: { ...node.props },
            styles: { ...node.styles },
            // Los hijos ya se añadieron recursivamente en cloneNodes, pero no se insertaron en el árbol.
            // cloneNodes solo clona estructura, no inserta. Para que los hijos estén presentes,
            // necesitamos insertar todo el subárbol. addNode solo añade el nodo raíz; sus hijos no se insertan.
            // Esta es una limitación: necesitamos una función que agregue un subárbol completo.
            // Por simplicidad, asumimos que los componentes no tienen hijos (o los hijos se pierden al desvincular).
            // Para una implementación completa, habría que crear un "addSubTree" en el design store.
          });
        }
      });
    },

    applyOverrides: (instanceNodeId, overrides) => {
      useDesignStore.getState().updateNode(instanceNodeId, { overrides });
    },

    getComponent: (id) => get().components.find(c => c.id === id),

    getResolvedProps: (instanceNode) => {
      const component = get().components.find(c => c.id === instanceNode.componentId);
      if (!component) return instanceNode;

      // Fusiona los props maestros (del primer nodo raíz del componente, por simplicidad)
      // con los overrides de la instancia.
      // En una implementación real, se iteraría sobre todos los nodos del componente y sus overrides.
      // Aquí un ejemplo básico para nodo raíz:
      const masterProps = component.nodes[0]?.props ?? {};
      const resolvedProps = {
        ...masterProps,
        ...instanceNode.overrides,
      };
      return {
        ...instanceNode,
        props: resolvedProps,
      };
    },
  }))
);