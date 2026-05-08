import { useDraggable } from '@dnd-kit/core';
import type { NodeType } from '../types/design';
import { useEditorStore } from '../stores/useEditorStore';

// ─── Configuración de elementos disponibles ───
interface ElementDefinition {
  type: NodeType;
  label: string;
  icon: string; // emoji o nombre de clase de icono
  category: string;
}

const ELEMENTS: ElementDefinition[] = [
  { type: 'section', label: 'Sección', icon: '⬜', category: 'Contenedores' },
  { type: 'container', label: 'Contenedor', icon: '📦', category: 'Contenedores' },
  { type: 'heading', label: 'Encabezado', icon: '🔤', category: 'Texto' },
  { type: 'text', label: 'Párrafo', icon: '📝', category: 'Texto' },
  { type: 'button', label: 'Botón', icon: '🔘', category: 'Interactividad' },
  { type: 'image', label: 'Imagen', icon: '🖼️', category: 'Multimedia' },
  // Agrega más según necesites (form, video, icon, etc.)
];

// Agrupación opcional por categorías
const CATEGORIES = [...new Set(ELEMENTS.map(e => e.category))];

// ─── Componente de elemento arrastrable ───
function DraggableElement({ type, label, icon }: ElementDefinition) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `add-element-${type}`,
    data: { type }, // info que llega al onDragStart/onDragEnd
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 p-2 rounded-md border cursor-move select-none transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'hover:bg-gray-100 hover:border-blue-300'}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

// ─── Panel principal ───
export default function AddElementPanel() {
  const { setLeftSidebarTab } = useEditorStore();

  return (
    <>
      <div
        className="shrink-0 relative w-50"
      
      >
      <div
        className="w-full h-full bg-background border-r flex overflow-hidden p-4 pb-0"
      >
        {/* Tabs */}
        <div className="w-full">


          {/* <Tabs
            value={activeTab}
            onValueChange={async (value) => {
              const newTab = value as EditorTab;

              if (newTab === 'layers' && pagesRef.current) {
                const canSwitch = await pagesRef.current.checkAndCloseSettings();
                if (!canSwitch) return;
              }

              setActiveSidebarTab(newTab);
              setShowElementLibrary(false);

              // Update URL without triggering Next.js navigation to avoid re-renders
              const targetPageId = currentPageId || (pages.length > 0 ? pages[0].id : null);
              if (targetPageId) {
                const segment = newTab === 'layers' ? 'layers' : 'pages';
                const newPath = `/ycode/${segment}/${targetPageId}${window.location.search}`;
                window.history.replaceState(null, '', newPath);
              }
            }}
            className="h-full overflow-hidden gap-0!"
          >
            <TabsList className="w-full shrink-0">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>

            <hr className="mt-4" />

            
            <TabsContent
              value="layers" className="flex flex-col min-h-0"
              forceMount
            >
              <header className="py-5 flex justify-between shrink-0 z-20">
                <span className="font-medium">{editingComponentId ? 'Layers' : 'Layers'}</span>
                <div className="-my-1">
                  <Button
                    size="xs" variant="secondary"
                    onClick={() => setShowElementLibrary(prev => !prev)}
                  >
                    <Icon name="plus" className={`${showElementLibrary ? 'rotate-45' : 'rotate-0'} transition-transform duration-100`} />
                  </Button>
                </div>
              </header>

              <div
                className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-auto no-scrollbar"
                style={{ '--tree-available-width': `${sidebarWidth - 33}px` } as React.CSSProperties}
              >
                {!currentPageId && !editingComponentId ? (
                  <Empty>
                    <EmptyTitle>No page selected</EmptyTitle>
                    <EmptyDescription>Select a page from the Pages tab to start building</EmptyDescription>
                  </Empty>
                ) : layersForCurrentPage.length === 0 ? (
                  <Empty>
                    <EmptyTitle>No layers yet</EmptyTitle>
                    <EmptyDescription>Click the + button above to add your first block</EmptyDescription>
                  </Empty>
                ) : (
                  <LayersTree
                    layers={layersForCurrentPage}
                    selectedLayerId={selectedLayerId}
                    selectedLayerIds={selectedLayerIds}
                    onLayerSelect={handleLayerSelect}
                    onReorder={handleLayersReorder}
                    pageId={currentPageId || ''}
                    liveLayerUpdates={liveLayerUpdates}
                    liveComponentUpdates={liveComponentUpdates}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="pages"
              className="flex flex-col min-h-0 overflow-y-auto no-scrollbar"
              forceMount
            >
              <LeftSidebarPages
                ref={pagesRef}
                pages={pages}
                folders={folders}
                currentPageId={currentPageId}
                onPageSelect={onPageSelect}
                setCurrentPageId={setCurrentPageId}
              />
            </TabsContent>

          </Tabs> */}
        </div>

      </div>

      {/* Resize handle - wide hit area, thin visible line on hover */}
      <div
        
        className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-30 flex items-center justify-center group/resize"
      >
        <div className="w-0.5 h-full bg-transparent group-hover/resize:bg-primary/50 group-active/resize:bg-primary/70 transition-colors" />
      </div>
      </div>

     

      {/* Element Library Slide-Out (lazy loaded, always mounted to preserve state) */}
      {/* <Suspense fallback={null}>
        <ElementLibrary
          isOpen={showElementLibrary}
          onClose={() => setShowElementLibrary(false)}
          liveLayerUpdates={liveLayerUpdates}
        />
      </Suspense> */}
    </>
  );
}