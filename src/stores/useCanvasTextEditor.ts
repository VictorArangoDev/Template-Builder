import { create } from 'zustand';




interface CanvasTextEditorState {
  isOpen: boolean;
  nodeId: string | null;
  content: string;
  openEditor: (nodeId: string, initialContent: string) => void;
  closeEditor: () => void;
}

export const useCanvasTextEditorStore = create<CanvasTextEditorState>(set => ({
  isOpen: false,
  nodeId: null,
  content: '',
  openEditor: (nodeId, content) => set({ isOpen: true, nodeId, content }),
  closeEditor: () => set({ isOpen: false, nodeId: null }),
}));