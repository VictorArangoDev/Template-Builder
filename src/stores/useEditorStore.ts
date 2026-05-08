import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { NodeType } from '../types/design';

// ─── Tipos internos ─────────────────────
export type SidebarTab = 'layers' | 'add-elements' | 'components';
export type RightPanelTab = 'properties' | 'styles' | 'settings';

export interface DropIndicator {
  parentId: string | null;
  index: number;
}

export interface EditorState {
  // Paneles
  leftSidebarOpen: boolean;
  leftSidebarTab: SidebarTab;
  rightSidebarOpen: boolean;
  rightSidebarTab: RightPanelTab;

  // Modo de vista previa
  isPreviewMode: boolean;

  // Drag & Drop
  isDragging: boolean;
  draggedType: NodeType | null;
  dropIndicator: DropIndicator | null;

  // Modales
  modalName: string | null;   // Nombre del modal abierto (ej: 'component-create', 'settings')

  // Deshacer / Rehacer (puede delegar en un store separado)
  canUndo: boolean;
  canRedo: boolean;

  // Acciones de UI
  toggleLeftSidebar: () => void;
  setLeftSidebarTab: (tab: SidebarTab) => void;
  toggleRightSidebar: () => void;
  setRightSidebarTab: (tab: RightPanelTab) => void;
  togglePreviewMode: () => void;

  // Acciones de DnD
  startDrag: (type: NodeType) => void;
  updateDropIndicator: (indicator: DropIndicator | null) => void;
  endDrag: () => void;

  // Modales
  openModal: (name: string) => void;
  closeModal: () => void;

  // Historial (interfaz)
  setUndoRedoState: (canUndo: boolean, canRedo: boolean) => void;
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    // ─── Estado inicial ─────────────────
    leftSidebarOpen: true,
    leftSidebarTab: 'layers',
    rightSidebarOpen: true,
    rightSidebarTab: 'properties',

    isPreviewMode: false,

    isDragging: false,
    draggedType: null,
    dropIndicator: null,

    modalName: null,

    canUndo: false,
    canRedo: false,

    // ─── Acciones de paneles ────────────
    toggleLeftSidebar: () =>
      set((state) => {
        state.leftSidebarOpen = !state.leftSidebarOpen;
      }),

    setLeftSidebarTab: (tab) =>
      set((state) => {
        state.leftSidebarTab = tab;
        if (!state.leftSidebarOpen) state.leftSidebarOpen = true; // abrir si está cerrado
      }),

    toggleRightSidebar: () =>
      set((state) => {
        state.rightSidebarOpen = !state.rightSidebarOpen;
      }),

    setRightSidebarTab: (tab) =>
      set((state) => {
        state.rightSidebarTab = tab;
        if (!state.rightSidebarOpen) state.rightSidebarOpen = true;
      }),

    // ─── Modo vista previa ──────────────
    togglePreviewMode: () =>
      set((state) => {
        state.isPreviewMode = !state.isPreviewMode;
      }),

    // ─── Drag & Drop ────────────────────
    startDrag: (type) =>
      set((state) => {
        state.isDragging = true;
        state.draggedType = type;
        state.dropIndicator = null;
      }),

    updateDropIndicator: (indicator) =>
      set((state) => {
        state.dropIndicator = indicator;
      }),

    endDrag: () =>
      set((state) => {
        state.isDragging = false;
        state.draggedType = null;
        state.dropIndicator = null;
      }),

    // ─── Modales ────────────────────────
    openModal: (name) =>
      set((state) => {
        state.modalName = name;
      }),

    closeModal: () =>
      set((state) => {
        state.modalName = null;
      }),

    // ─── Sincronización con historial ───
    // (se llama desde useHistoryStore o el componente que lo implemente)
    setUndoRedoState: (canUndo, canRedo) =>
      set((state) => {
        state.canUndo = canUndo;
        state.canRedo = canRedo;
      }),
  }))
);