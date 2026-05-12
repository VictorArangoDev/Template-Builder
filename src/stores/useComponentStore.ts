// src/stores/useComponentStore.ts
import { create } from 'zustand';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
  props: Record<string, any>;
  children?: ComponentItem[];
}

interface ComponentsState {
  components: ComponentItem[];
  
  setComponents: (components: ComponentItem[]) => void;
  addComponent: (component: ComponentItem) => void;
  removeComponent: (id: string) => void;
  updateComponent: (id: string, updates: Partial<ComponentItem>) => void;
}

export const useComponentsStore = create<ComponentsState>((set) => ({
  components: [],
  
  setComponents: (components) => set({ components }),
  addComponent: (component) => set((state) => ({ 
    components: [...state.components, component] 
  })),
  removeComponent: (id) => set((state) => ({ 
    components: state.components.filter(c => c.id !== id) 
  })),
  updateComponent: (id, updates) => set((state) => ({
    components: state.components.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
}));