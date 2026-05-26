// src/stores/useDesignStore.ts
import { create } from 'zustand';

interface DesignState {
  nodes: any[];
  pages: any[];
  activePage: string | null;
  currentPageId: string | null;
  setCurrentPage: (pages: any[]) => void;
  setPages: (pages: any[]) => void;
  setActivePage: (pageId: string) => void;
  addPage: (page: any) => void;
  removePage: (pageId: string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;

}

export const useDesignStore = create<DesignState>((set) => ({
  nodes:[],
  pages: [],
  activePage: null,
  currentPageId:null,
  setCurrentPage:(pages) => set({ pages }),
  setPages: (pages) => set({ pages }),
  setActivePage: (pageId) => set({ activePage: pageId }),
  addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
  removePage: (pageId) => set((state) => ({ 
    pages: state.pages.filter(p => p.id !== pageId),
    activePage: state.activePage === pageId ? null : state.activePage
  })),
  updateNodePosition: (nodeId: string, x: number, y: number) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, x, y }
          : node
      ),
    }));
  },
}));