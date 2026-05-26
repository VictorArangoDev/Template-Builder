import { useState } from 'react'
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Home,
  Trash2,
  Copy,
  FileText
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useLayersStore } from './layer-store'
import { useDesignStore } from '../../stores/useDesignStore'
import type { TNode } from '../../types'

// Custom icons matching the design exactly
function BodyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
      <rect x="2" y="2" width="12" height="12" rx="1.5" />
    </svg>
  )
}

function SectionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
      <rect x="2" y="4" width="12" height="8" rx="1.5" />
    </svg>
  )
}

function TextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0">
      <path d="M4 4h8M8 4v8M6 12h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface TreeItemProps {
  node: TNode
  level: number
  expanded: boolean
  selected: boolean
  onToggle: () => void
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
}

function TreeItem({
  node,
  level,
  expanded,
  selected,
  onToggle,
  onSelect,
  onDelete,
  onDuplicate
}: TreeItemProps) {
  const hasChildren = node.children && node.children.length > 0;

  // Select icon based on node name/type to match screenshot: Body, Section, Text
  const getIcon = () => {
    const name = node.name.toLowerCase();
    if (name === 'body') return <BodyIcon />;
    if (name === 'section') return <SectionIcon />;
    if (name === 'text') return <TextIcon />;

    // Default by type
    if (node.type === 'container') return <SectionIcon />;
    return <TextIcon />;
  }



  return (
    <div className="group relative">
      <div
        className={cn(
          'flex items-center gap-2 py-1.5 px-2.5 cursor-pointer transition-all duration-150 rounded-md mx-1.5 my-0.5 select-none',
          selected
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'hover:bg-gray-100 text-gray-700'
        )}
        style={{ paddingLeft: `${level * 12 + 10}px` }}
        onClick={onSelect}
      >
        {/* Expand/Collapse arrow */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            className={cn(
              'p-0.5 rounded-sm flex items-center justify-center transition-colors',
              selected ? 'hover:bg-blue-700 text-white' : 'hover:bg-gray-200 text-gray-400'
            )}
          >
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        <span className={selected ? 'text-white' : 'text-gray-400'}>
          {getIcon()}
        </span>

        {/* Label */}
        <span className="text-xs tracking-wide truncate flex-1">
          {node.name}
        </span>

        {/* Hover quick actions */}
        <div className={cn(
          'absolute right-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-white border border-gray-100 p-0.5 rounded shadow-xs',
          selected && 'bg-blue-600 border-blue-500'
        )}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className={cn(
              'p-1 rounded hover:bg-gray-100 text-black hover:text-gray-600',
              selected && 'hover:bg-blue-700 text-black hover:text-white'
            )}
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              'p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500',
              selected && 'hover:bg-red-600 text-black hover:text-white'
            )}
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function LayersPanel() {
  const [activeTab, setActiveTab] = useState<'layers' | 'pages' | 'components'>('layers')
  const [showAddDropdown, setShowAddDropdown] = useState(false)

  // Zustand stores
  const layersStore = useLayersStore();
  const designStore = useDesignStore();

  const toggleNode = (nodeId: string) => {
    layersStore.toggleExpanded(nodeId);
  }

  const renderTree = (nodes: TNode[], level: number = 0) => {
    return nodes.map((node) => {
      const isExpanded = layersStore.isExpanded(node.id);
      const isSelected = layersStore.selectedNodeId === node.id;

      return (
        <div key={node.id}>
          <TreeItem
            node={node}
            level={level}
            expanded={isExpanded}
            selected={isSelected}
            onToggle={() => toggleNode(node.id)}
            onSelect={() => layersStore.selectNode(node.id)}
            onDelete={() => layersStore.removeNode(node.id)}
            onDuplicate={() => layersStore.duplicateNode(node.id)}
          />
          {node.children && isExpanded && (
            <div className="transition-all duration-150">
              {renderTree(node.children, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0 select-none">
      {/* Tab header (Segmented control) */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab('layers')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all select-none',
              activeTab === 'layers'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            )}
          >
            Layers
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all select-none',
              activeTab === 'pages'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            )}
          >
            Pages
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={cn(
              'flex-1 py-1.5 text-xs font-semibold rounded-md transition-all select-none',
              activeTab === 'components'
                ? 'bg-white text-gray-800 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            )}
          >
            Components
          </button>
        </div>
      </div>

      {activeTab === 'layers' ? (
        <>
          {/* Layers header */}
          <div className="flex items-center justify-between px-4 py-3 relative">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Layers
            </span>
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-700"
              title="Add element"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
            </button>

            {/* Dropdown Add Menu */}
            {showAddDropdown && (
              <div className="absolute right-4 top-10 w-44 bg-white border border-gray-200 rounded-lg shadow-md py-1 z-35 text-[11px] text-gray-600 font-semibold">
                {[
                  { label: 'Container (Section)', type: 'container' },
                  { label: 'Heading', type: 'heading' },
                  { label: 'Paragraph (Text)', type: 'paragraph' },
                  { label: 'Image', type: 'image' },
                  { label: 'Variable', type: 'variable' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => {
                      layersStore.addNode(item.type as any, layersStore.selectedNodeId);
                      setShowAddDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-gray-50 transition-colors"
                  >
                    + {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layer tree */}
          <div className="flex-1 overflow-auto py-1">
            {layersStore.nodes.length > 0 ? (
              renderTree(layersStore.nodes)
            ) : (
              <div className="text-center py-8 text-xs text-gray-400 font-medium">
                No layers found.
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'pages' ? (
        <>
          {/* Pages header */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pages
            </span>
            <button
              onClick={() => {
                const pageName = prompt('Nombre de la nueva página:', 'Nueva página');
                if (pageName && pageName.trim()) {
                  const id = `page-${Date.now()}`;
                  const slug = pageName
                    .toLowerCase()
                    .trim()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                    .replace(/[^a-z0-9]+/g, '-') // Reemplazar espacios y caracteres especiales con guiones
                    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final

                  designStore.setPages([
                    ...designStore.pages,
                    {
                      id,
                      title: pageName.trim(),
                      slug: slug || `new-page-${designStore.pages.length}`,
                      nodes: []
                    }
                  ]);
                }
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-700"
              title="Create new page"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Pages list */}
          <div className="flex-1 overflow-auto py-1">
            {designStore.pages.map((page) => {
              const isActive = designStore.currentPageId === page.id;
              return (
                <div
                  key={page.id}
                  // onClick={() => designStore.setCurrentPage(page.id)}
                  className={cn(
                    'flex items-center gap-2 py-1.5 px-3 cursor-pointer transition-all rounded-md mx-2 my-0.5 text-xs font-semibold',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-100 text-gray-600'
                  )}
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="truncate flex-1">{page.title}</span>
                  {/* <span className="text-[10px] text-gray-400 font-normal">/{page.slug}</span> */}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* Layers header */}
          <div className="flex items-center justify-between px-4 py-3 relative">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Layers
            </span>
            <button
              onClick={() => setShowAddDropdown(!showAddDropdown)}
              className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-700"
              title="Add element"
            >
              <Plus className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </>
      )}



    </aside>
  )
}
