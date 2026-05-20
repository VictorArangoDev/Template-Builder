// src/stores/useDesignStore.ts
import { create } from 'zustand';

interface DesignState {
  pages: any[];
  activePage: string | null;
  currentPageId: string | null;
  setCurrentPage: (pages: any[]) => void;
  setPages: (pages: any[]) => void;
  setActivePage: (pageId: string) => void;
  addPage: (page: any) => void;
  removePage: (pageId: string) => void;
}

export const useDesignStore = create<DesignState>((set) => ({
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
}));