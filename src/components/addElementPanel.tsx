import { useState } from 'react'
import {
  Plus,
  MoreHorizontal,
  Link2,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useLayersStore } from './layers/layer-store'

// Custom SVG icons matching the design exactly
function ColumnsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="3" width="5" height="10" rx="1"/>
      <rect x="9" y="3" width="5" height="10" rx="1"/>
    </svg>
  )
}

function RowsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="2" width="10" height="5" rx="1"/>
      <rect x="3" y="9" width="10" height="5" rx="1"/>
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <rect x="9" y="9" width="5" height="5" rx="1"/>
    </svg>
  )
}

function HideIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z"/>
      <circle cx="8" cy="8" r="2"/>
      <line x1="3" y1="13" x2="13" y2="3"/>
    </svg>
  )
}

function AlignStartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="2" y1="2" x2="2" y2="14"/>
      <rect x="4" y="4" width="8" height="3" rx="0.5"/>
      <rect x="4" y="9" width="5" height="3" rx="0.5"/>
    </svg>
  )
}

function AlignCenterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="8" y1="2" x2="8" y2="14"/>
      <rect x="3" y="4" width="10" height="3" rx="0.5"/>
      <rect x="5" y="9" width="6" height="3" rx="0.5"/>
    </svg>
  )
}

function AlignEndIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="14" y1="2" x2="14" y2="14"/>
      <rect x="4" y="4" width="8" height="3" rx="0.5"/>
      <rect x="7" y="9" width="5" height="3" rx="0.5"/>
    </svg>
  )
}

function AlignStretchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="2" y1="2" x2="2" y2="14"/>
      <line x1="14" y1="2" x2="14" y2="14"/>
      <rect x="4" y="4" width="8" height="3" rx="0.5"/>
      <rect x="4" y="9" width="8" height="3" rx="0.5"/>
    </svg>
  )
}

interface FieldRowProps {
  label: string
  children: React.ReactNode
}

function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-xs font-semibold text-gray-400 min-w-[50px] uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 flex justify-end">{children}</div>
    </div>
  )
}

interface SpacingInputProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}

function SpacingInput({ value, onChange, className, placeholder = '0' }: SpacingInputProps) {
  const numericValue = value ? value.replace('px', '').replace('%', '') : '';
  
  return (
    <input
      type="text"
      value={numericValue}
      placeholder={placeholder}
      onChange={(e) => {
        const val = e.target.value;
        if (val === '') {
          onChange('');
        } else {
          onChange(`${val}px`);
        }
      }}
      className={cn(
        "w-8 text-center text-[10px] bg-transparent border-none focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 rounded p-0.5 font-semibold text-gray-700 placeholder-gray-300",
        className
      )}
    />
  );
}

interface SpacingVisualizerProps {
  styles: Record<string, string>;
  onStyleChange: (property: string, value: string) => void;
}

function SpacingVisualizer({ styles, onStyleChange }: SpacingVisualizerProps) {
  return (
    <div className="relative w-full aspect-video max-w-[210px] mx-auto my-3 border border-gray-100 rounded-lg bg-gray-50/30 p-2 flex items-center justify-center">
      {/* Outer margin box */}
      <div className="absolute inset-x-2 inset-y-2 border border-dashed border-orange-300/70 rounded bg-orange-50/10">
        {/* Margin Top */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <SpacingInput 
            value={styles.marginTop || ''} 
            onChange={(val) => onStyleChange('marginTop', val)} 
            placeholder="0"
          />
        </div>
        {/* Margin Bottom */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
          <SpacingInput 
            value={styles.marginBottom || ''} 
            onChange={(val) => onStyleChange('marginBottom', val)} 
            placeholder="0"
          />
        </div>
        {/* Margin Left */}
        <div className="absolute top-1/2 left-1.5 -translate-y-1/2 -translate-x-1/2 z-10">
          <SpacingInput 
            value={styles.marginLeft || ''} 
            onChange={(val) => onStyleChange('marginLeft', val)} 
            placeholder="0"
          />
        </div>
        {/* Margin Right */}
        <div className="absolute top-1/2 right-1.5 -translate-y-1/2 translate-x-1/2 z-10">
          <SpacingInput 
            value={styles.marginRight || ''} 
            onChange={(val) => onStyleChange('marginRight', val)} 
            placeholder="0"
          />
        </div>
        
        {/* Margin label */}
        <div className="absolute bottom-0.5 right-1 pointer-events-none select-none">
          <span className="text-[8px] font-bold text-orange-400/80 uppercase tracking-widest">M</span>
        </div>

        {/* Inner padding box */}
        <div className="absolute inset-x-8 inset-y-6 border border-solid border-emerald-300/70 rounded bg-emerald-50/15">
          {/* Padding Top */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <SpacingInput 
              value={styles.paddingTop || ''} 
              onChange={(val) => onStyleChange('paddingTop', val)} 
              placeholder="0"
            />
          </div>
          {/* Padding Bottom */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
            <SpacingInput 
              value={styles.paddingBottom || ''} 
              onChange={(val) => onStyleChange('paddingBottom', val)} 
              placeholder="0"
            />
          </div>
          {/* Padding Left */}
          <div className="absolute top-1/2 left-1.5 -translate-y-1/2 -translate-x-1/2 z-10">
            <SpacingInput 
              value={styles.paddingLeft || ''} 
              onChange={(val) => onStyleChange('paddingLeft', val)} 
              placeholder="0"
            />
          </div>
          {/* Padding Right */}
          <div className="absolute top-1/2 right-1.5 -translate-y-1/2 translate-x-1/2 z-10">
            <SpacingInput 
              value={styles.paddingRight || ''} 
              onChange={(val) => onStyleChange('paddingRight', val)} 
              placeholder="0"
            />
          </div>
          
          {/* Padding label */}
          <div className="absolute bottom-0.5 right-1 pointer-events-none select-none">
            <span className="text-[8px] font-bold text-emerald-500/80 uppercase tracking-widest">P</span>
          </div>

          {/* Content box */}
          <div className="absolute inset-x-8 inset-y-4 bg-blue-50/80 border border-blue-100 rounded flex items-center justify-center select-none pointer-events-none">
            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest">Box</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<'design' | 'settings' | 'interactions'>('design')
  
  const layersStore = useLayersStore();
  const selectedNode = layersStore.getSelectedNode();

  const handleStyleChange = (property: string, value: string) => {
    if (!selectedNode) return;
    
    layersStore.updateNode(selectedNode.id, {
      styles: {
        ...selectedNode.styles,
        [property]: value,
      }
    });
  }

  if (!selectedNode) {
    return (
      <aside className="w-64 bg-white border-l border-gray-200 flex flex-col justify-center items-center p-6 text-center select-none shrink-0">
        <p className="text-xs font-semibold text-gray-400">No element selected</p>
        <p className="text-[11px] text-gray-400 mt-1">Select an element from the layers list to inspect and edit its properties.</p>
      </aside>
    );
  }

  const styles = selectedNode.styles || {};
  
  // Calculate active layout states based on node styles
  const display = styles.display || 'flex';
  const flexDirection = styles.flexDirection || 'column';
  
  let layoutType = 'rows';
  if (display === 'none') {
    layoutType = 'hide';
  } else if (display === 'grid') {
    layoutType = 'grid';
  } else if (display === 'flex') {
    layoutType = flexDirection === 'row' ? 'columns' : 'rows';
  }

  const align = styles.alignItems || 'stretch';
  const justify = styles.justifyContent || 'start';
  const wrap = styles.flexWrap === 'wrap' ? 'yes' : 'no';
  const gap = styles.gap || '';

  return (
    <aside className="w-64 bg-white border-l border-gray-200 flex flex-col overflow-hidden shrink-0 select-none">
      {/* Tab header (Design, Settings, Interactions) */}
      <div className="flex border-b border-gray-200">
        {(['design', 'settings', 'interactions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-3 text-xs font-bold capitalize transition-all select-none border-b-2',
              activeTab === tab
                ? 'text-gray-800 border-blue-500 bg-white font-bold'
                : 'text-gray-400 border-transparent hover:text-gray-700 bg-gray-50/50'
            )}
          >
            {tab === 'design' ? 'Design' : tab === 'settings' ? 'Settings' : 'Interactions'}
          </button>
        ))}
      </div>

      {activeTab === 'design' ? (
        <>
          {/* Style selector */}
          <div className="p-3 border-b border-gray-200">
            <select className="w-full px-2.5 py-1.5 text-xs text-gray-400 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer">
              <option value="">Apply layer style...</option>
            </select>
          </div>

          {/* Style actions */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-200 text-gray-400 font-semibold text-[10px]">
            <button className="flex items-center gap-0.5 px-1.5 py-0.5 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors uppercase tracking-wider">
              <Plus className="w-3 h-3 stroke-[2.5]" />
              New
            </button>
            <button className="px-1.5 py-0.5 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors uppercase tracking-wider">
              Update
            </button>
            <button className="px-1.5 py-0.5 hover:bg-gray-100 hover:text-gray-700 rounded transition-colors uppercase tracking-wider">
              Detach
            </button>
            <button className="ml-auto p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-auto">
            {/* Class selector */}
            <div className="p-3 border-b border-gray-200 bg-gray-50/30">
              <select className="w-full px-2.5 py-1.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer">
                <option value="neutral">Neutral</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>

            {/* Layout section */}
            <div className="border-b border-gray-200 p-3">
              <div className="mb-2">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Layout</span>
              </div>
              <div className="space-y-2">
                <FieldRow label="Type">
                  <div className="flex items-center">
                    <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden p-0.5">
                      {[
                        { value: 'columns', icon: <ColumnsIcon />, title: 'Horizontal Flex' },
                        { value: 'rows', icon: <RowsIcon />, title: 'Vertical Flex' },
                        { value: 'grid', icon: <GridIcon />, title: 'Grid Layout' },
                        { value: 'hide', icon: <HideIcon />, title: 'Hide Element' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          title={item.title}
                          onClick={() => {
                            if (item.value === 'columns') {
                              handleStyleChange('display', 'flex');
                              handleStyleChange('flexDirection', 'row');
                            } else if (item.value === 'rows') {
                              handleStyleChange('display', 'flex');
                              handleStyleChange('flexDirection', 'column');
                            } else if (item.value === 'grid') {
                              handleStyleChange('display', 'grid');
                            } else if (item.value === 'hide') {
                              handleStyleChange('display', 'none');
                            }
                          }}
                          className={cn(
                            'p-1.5 rounded transition-all select-none',
                            layoutType === item.value
                              ? 'bg-white text-blue-600 shadow-xs'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                          )}
                        >
                          {item.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </FieldRow>

                {display === 'flex' && (
                  <>
                    <FieldRow label="Align">
                      <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden p-0.5">
                        {[
                          { value: 'flex-start', icon: <AlignStartIcon />, title: 'Align Start' },
                          { value: 'center', icon: <AlignCenterIcon />, title: 'Align Center' },
                          { value: 'flex-end', icon: <AlignEndIcon />, title: 'Align End' },
                          { value: 'stretch', icon: <AlignStretchIcon />, title: 'Align Stretch' },
                        ].map((item) => (
                          <button
                            key={item.value}
                            title={item.title}
                            onClick={() => handleStyleChange('alignItems', item.value)}
                            className={cn(
                              'p-1.5 rounded transition-all select-none',
                              align === item.value
                                ? 'bg-white text-blue-600 shadow-xs'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                            )}
                          >
                            {item.icon}
                          </button>
                        ))}
                      </div>
                    </FieldRow>

                    <FieldRow label="Justify">
                      <select
                        value={justify}
                        onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                        className="px-2 py-1 text-xs text-gray-700 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold cursor-pointer max-w-[120px]"
                      >
                        <option value="flex-start">Start</option>
                        <option value="center">Center</option>
                        <option value="flex-end">End</option>
                        <option value="space-between">Space Between</option>
                      </select>
                    </FieldRow>

                    <FieldRow label="Wrap">
                      <div className="flex bg-gray-50 border border-gray-200 rounded-lg overflow-hidden p-0.5 max-w-[100px]">
                        <button
                          onClick={() => handleStyleChange('flexWrap', 'wrap')}
                          className={cn(
                            'px-3 py-1 text-[10px] font-bold rounded transition-all select-none',
                            wrap === 'yes'
                              ? 'bg-white text-gray-800 shadow-xs'
                              : 'text-gray-400 hover:text-gray-600'
                          )}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleStyleChange('flexWrap', 'nowrap')}
                          className={cn(
                            'px-3 py-1 text-[10px] font-bold rounded transition-all select-none',
                            wrap === 'no'
                              ? 'bg-white text-gray-800 shadow-xs'
                              : 'text-gray-400 hover:text-gray-600'
                          )}
                        >
                          No
                        </button>
                      </div>
                    </FieldRow>
                  </>
                )}

                <FieldRow label="Gap">
                  <div className="flex items-center gap-1.5 max-w-[120px]">
                    <input
                      type="text"
                      placeholder="0px"
                      value={gap}
                      onChange={(e) => handleStyleChange('gap', e.target.value)}
                      className="w-full px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right"
                    />
                    <button className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors">
                      <Link2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </FieldRow>
              </div>
            </div>

            {/* Spacing section */}
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Spacing</span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <GridIcon />
                </button>
              </div>
              <SpacingVisualizer styles={styles} onStyleChange={handleStyleChange} />
            </div>

            {/* Sizing section */}
            <div className="border-b border-gray-200 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Sizing</span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="space-y-2">
                <FieldRow label="Width">
                  <input
                    type="text"
                    placeholder="auto"
                    value={styles.width || ''}
                    onChange={(e) => handleStyleChange('width', e.target.value)}
                    className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right max-w-[100px]"
                  />
                </FieldRow>
                <FieldRow label="Height">
                  <input
                    type="text"
                    placeholder="auto"
                    value={styles.height || ''}
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    className="px-2 py-1 text-xs font-semibold bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-right max-w-[100px]"
                  />
                </FieldRow>
              </div>
            </div>
          </div>
        </>
      ) : activeTab === 'settings' ? (
        <div className="p-4 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Element details</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">NODE NAME</label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => layersStore.updateNode(selectedNode.id, { name: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
              />
            </div>
            
            {(selectedNode.type === 'paragraph' || selectedNode.type === 'heading') && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1">TEXT CONTENT</label>
                <textarea
                  rows={4}
                  value={selectedNode.content}
                  onChange={(e) => layersStore.updateNode(selectedNode.id, { content: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold resize-none"
                />
              </div>
            )}

            {selectedNode.type === 'image' && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1">IMAGE SOURCE URL</label>
                <input
                  type="text"
                  value={selectedNode.content}
                  onChange={(e) => layersStore.updateNode(selectedNode.id, { content: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2 text-center">
          <p className="text-xs font-semibold text-gray-400">No interactions configured</p>
          <p className="text-[10px] text-gray-400">Trigger actions on click, hover or screen load.</p>
        </div>
      )}
    </aside>
  )
}
