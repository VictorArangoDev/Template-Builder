// src/stores/useDesignStore.ts
import { create } from 'zustand';
import type { TNode } from '../types';

interface DesignState {
  nodes: any[];
  pages: any[];
  activePage: string | null;
  currentPageId: string | null;
  setCurrentPageId: (pageId: string | null) => void;
  setPages: (pages: any[]) => void;
  setActivePage: (pageId: string) => void;
  addPage: (page: any) => void;
  removePage: (pageId: string) => void;
  selectPage: (pageId:string) => void;
  renamePage: (pageId:string, title:string) => void;
  updateNodePosition: (nodeId: string, x: number, y: number) => void;
  updateCurrentPageNodes: (nodes: TNode[]) => void;
  

}

export const useDesignStore = create<DesignState>((set) => ({
  nodes:[],
  pages: [],
  activePage: null,
  currentPageId:null,
  setCurrentPageId:(pageId) => set({ currentPageId: pageId }),
  setPages: (pages) => set({ pages }),
  setActivePage: (pageId) => set({ activePage: pageId }),
  addPage: (page) => set((state) => ({ pages: [...state.pages, page] })),
  removePage: (pageId) => set((state) => ({ 
    pages: state.pages.filter(p => p.id !== pageId),
    activePage: state.activePage === pageId ? null : state.activePage
  })),
  selectPage: (pageId) => set({ currentPageId: pageId}),
  updateNodePosition: (nodeId: string, x: number, y: number) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, x, y }
          : node
      ),
    }));
  },
  renamePage(pageId:string, title:string){
  },
  updateCurrentPageNodes: (nodes) => {
    set((state) => {
      const pageId = state.currentPageId;
      if (!pageId) return { pages: state.pages };
      return {
        pages: state.pages.map((p: any) =>
          p.id === pageId
            ? { ...p, nodes }
            : p
        ),
      };
    });
  },
}));