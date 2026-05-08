import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import { useDesignStore } from '../../stores/useDesignStore';
import { useEditorStore } from '../../stores/useEditorStore';
import { useComponentsStore } from '../../stores/useComponentStore';
import CanvasRenderer from '../canvas/canvasRendered';
import LayerPanel from '../LayerPanel';
import PropertiesPanel from '../PropertiesPanel';
import AddElementPanel from '../addElementPanel';
// import Toolbar from './Toolbar';
import InlineTextEditor from '../inlineTextEditor';
// import { loadProjectData, saveProjectData } from '@/lib/supabase-client'; // Llamadas directas o a API routes

export default function EditorApp({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // const project = await loadProjectData(projectId); // Carga páginas, componentes, assets
      // if (project) {
      //   useDesignStore.getState().setPages(project.pages);
      //   useComponentsStore.getState().setComponents(project.components);
      //   // ... otros stores
      // }
      setLoading(false);
    })();
  }, [projectId]);

  // Auto-guardado cada 5 segundos (simplificado)
  useEffect(() => {
    // if (loading) return;
    // const interval = setInterval(() => {
    //   const state = useDesignStore.getState();
    //   saveProjectData(projectId, { pages: state.pages, components: useComponentsStore.getState().components });
    // }, 5000);
    // return () => clearInterval(interval);
  }, [projectId, loading]);

  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  return (
    <div className="flex flex-col h-screen">
      {/* <Toolbar /> */}

      <div className="flex flex-1 overflow-hidden">
        <AddElementPanel />

        <DndContext
          collisionDetection={closestCenter}
          onDragStart={() => {}}
          onDragEnd={() => {}}
        >
          <CanvasRenderer />

          <DragOverlay>
            {/* vista previa del elemento arrastrado */}
          </DragOverlay>
        </DndContext>

        <LayerPanel />
        <PropertiesPanel />
      </div>

      {/* <InlineTextEditor /> */}
    </div>
  );
}