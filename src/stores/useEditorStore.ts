// src/stores/useEditorStore.ts
import { create } from 'zustand';

interface EditorState {
  projectId: string | null;
  activePage: string | null;
  viewport: 'desktop' | 'tablet' | 'mobile';
  zoom: number;
  showGrid: boolean;
  showGuides: boolean;
  isSaving: boolean;
  
  setEditorState: (state: Partial<EditorState>) => void;
  setViewport: (viewport: EditorState['viewport']) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleGuides: () => void;
  setSaving: (isSaving: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  projectId: null,
  activePage: null,
  viewport: 'desktop',
  zoom: 100,
  showGrid: true,
  showGuides: true,
  isSaving: false,
  
  setEditorState: (state) => set(state),
  setViewport: (viewport) => set({ viewport }),
  setZoom: (zoom) => set({ zoom }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleGuides: () => set((state) => ({ showGuides: !state.showGuides })),
  setSaving: (isSaving) => set({ isSaving }),
}));