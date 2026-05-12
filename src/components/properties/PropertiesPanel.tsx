// src/components/properties/PropertiesPanel.tsx
import React, { useState, useCallback, useMemo } from 'react';
import type { TNode, TProject, NodeType } from '../../types';
import { NODE_TYPES } from '../../lib/constants';
import { useLayersStore } from '../layers/layer-store';
import { cn } from '../../lib/utils';
import {
  Settings,
  Type,
  PaintBucket,
  Layout,
  Link2,
  Image,
  Variable,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Plus,
  X
} from 'lucide-react';
// import './properties.css';

interface PropertiesPanelProps {
  selectedNode: TNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<TNode>) => void;
  project: TProject | null;
}

type TabType = 'style' | 'content' | 'advanced';

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode,
  project,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['typography', 'spacing', 'colors'])
  );

  const layersStore = useLayersStore();

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  }, []);

  // Handle style changes
  const handleStyleChange = useCallback(
    (property: string, value: string) => {
      if (!selectedNode) return;
      onUpdateNode(selectedNode.id, {
        styles: {
          ...selectedNode.styles,
          [property]: value,
        },
      });
    },
    [selectedNode, onUpdateNode]
  );

  // Handle content changes
  const handleContentChange = useCallback(
    (content: string) => {
      if (!selectedNode) return;
      onUpdateNode(selectedNode.id, { content });
    },
    [selectedNode, onUpdateNode]
  );

  // Handle variable key change
  const handleVariableKeyChange = useCallback(
    (variableKey: string) => {
      if (!selectedNode) return;
      onUpdateNode(selectedNode.id, { variableKey });
    },
    [selectedNode, onUpdateNode]
  );

  // Handle name change
  const handleNameChange = useCallback(
    (name: string) => {
      if (!selectedNode) return;
      onUpdateNode(selectedNode.id, { name });
    },
    [selectedNode, onUpdateNode]
  );

  // Reset styles to default
  const handleResetStyles = useCallback(() => {
    if (!selectedNode) return;
    const defaultConfig = NODE_TYPES[selectedNode.type];
    if (defaultConfig) {
      onUpdateNode(selectedNode.id, {
        styles: { ...defaultConfig.defaultStyles },
      });
    }
  }, [selectedNode, onUpdateNode]);

  // Get collection fields for variable selection
  const collectionFields = useMemo(() => {
    if (!project?.collectionId) return [];
    // Aquí se cargarían los campos de la colección desde la API
    return [
      { key: 'name', label: 'Name', type: 'string' },
      { key: 'email', label: 'Email', type: 'string' },
      { key: 'company', label: 'Company', type: 'string' },
      { key: 'date', label: 'Date', type: 'date' },
    ];
  }, [project?.collectionId]);

  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <div className="properties-panel__empty">
          <Settings size={32} className="properties-panel__empty-icon" />
          <p className="properties-panel__empty-text">No element selected</p>
          <p className="properties-panel__empty-hint">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const config = NODE_TYPES[selectedNode.type];
  const isVariableNode = selectedNode.type === 'variable';

  return (
    <div className="properties-panel">
      {/* Header */}
      <div className="properties-panel__header">
        <div className="properties-panel__header-left">
          <Settings size={14} className="properties-panel__header-icon" />
          <h3 className="properties-panel__title">Properties</h3>
        </div>
        
        <div className="properties-panel__header-actions">
          <button
            className="properties-panel__header-btn"
            onClick={() => layersStore.removeNode(selectedNode.id)}
            title="Delete element"
          >
            <Trash2 size={14} />
          </button>
          <button
            className="properties-panel__header-btn"
            onClick={() => layersStore.duplicateNode(selectedNode.id)}
            title="Duplicate element"
          >
            <Copy size={14} />
          </button>
        </div>
      </div>

      {/* Node Info */}
      <div className="properties-panel__node-info">
        <span className="properties-panel__node-type">
          {config?.label || selectedNode.type}
        </span>
        <span className="properties-panel__node-id" title={selectedNode.id}>
          ID: {selectedNode.id.slice(0, 8)}...
        </span>
      </div>

      {/* Tabs */}
      <div className="properties-panel__tabs">
        <button
          className={cn(
            'properties-panel__tab',
            activeTab === 'content' && 'properties-panel__tab--active'
          )}
          onClick={() => setActiveTab('content')}
        >
          <Type size={14} />
          <span>Content</span>
        </button>
        <button
          className={cn(
            'properties-panel__tab',
            activeTab === 'style' && 'properties-panel__tab--active'
          )}
          onClick={() => setActiveTab('style')}
        >
          <PaintBucket size={14} />
          <span>Style</span>
        </button>
        <button
          className={cn(
            'properties-panel__tab',
            activeTab === 'advanced' && 'properties-panel__tab--active'
          )}
          onClick={() => setActiveTab('advanced')}
        >
          <Settings size={14} />
          <span>Advanced</span>
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="properties-panel__content">
          {/* Name */}
          <div className="properties-panel__section">
            <div
              className="properties-panel__section-header"
              onClick={() => toggleSection('name')}
            >
              <span>Name</span>
              {expandedSections.has('name') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedSections.has('name') && (
              <div className="properties-panel__section-content">
                <input
                  type="text"
                  className="properties-panel__input"
                  value={selectedNode.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Content Editor */}
          {!isVariableNode && (
            <div className="properties-panel__section">
              <div
                className="properties-panel__section-header"
                onClick={() => toggleSection('content')}
              >
                <span>Content</span>
                {expandedSections.has('content') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </div>
              {expandedSections.has('content') && (
                <div className="properties-panel__section-content">
                  {selectedNode.type === 'image' ? (
                    <input
                      type="text"
                      className="properties-panel__input"
                      placeholder="Image URL"
                      value={selectedNode.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                    />
                  ) : (
                    <textarea
                      className="properties-panel__textarea"
                      value={selectedNode.content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      rows={4}
                      placeholder="Enter content..."
                    />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Variable Selection */}
          {isVariableNode && (
            <div className="properties-panel__section">
              <div
                className="properties-panel__section-header"
                onClick={() => toggleSection('variable')}
              >
                <Variable size={14} />
                <span>Variable Field</span>
                {expandedSections.has('variable') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </div>
              {expandedSections.has('variable') && (
                <div className="properties-panel__section-content">
                  <select
                    className="properties-panel__select"
                    value={selectedNode.variableKey || ''}
                    onChange={(e) => handleVariableKeyChange(e.target.value)}
                  >
                    <option value="">Select a field...</option>
                    {collectionFields.map(field => (
                      <option key={field.key} value={field.key}>
                        {field.label} ({field.key})
                      </option>
                    ))}
                  </select>
                  
                  {selectedNode.variableKey && (
                    <div className="properties-panel__variable-preview">
                      <span className="properties-panel__variable-label">Preview:</span>
                      <code className="properties-panel__variable-code">
                        {`{{${selectedNode.variableKey}}}`}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Visibility & Lock */}
          <div className="properties-panel__section">
            <div className="properties-panel__section-content">
              <label className="properties-panel__checkbox-label">
                <input
                  type="checkbox"
                  className="properties-panel__checkbox"
                  checked={selectedNode.isVisible}
                  onChange={(e) => onUpdateNode(selectedNode.id, { isVisible: e.target.checked })}
                />
                <Eye size={14} />
                <span>Visible</span>
              </label>
              
              <label className="properties-panel__checkbox-label">
                <input
                  type="checkbox"
                  className="properties-panel__checkbox"
                  checked={selectedNode.isLocked}
                  onChange={(e) => onUpdateNode(selectedNode.id, { isLocked: e.target.checked })}
                />
                <Lock size={14} />
                <span>Locked</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Style Tab */}
      {activeTab === 'style' && (
        <div className="properties-panel__content">
          {/* Typography */}
          <div className="properties-panel__section">
            <div
              className="properties-panel__section-header"
              onClick={() => toggleSection('typography')}
            >
              <Type size={14} />
              <span>Typography</span>
              {expandedSections.has('typography') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedSections.has('typography') && (
              <div className="properties-panel__section-content">
                <div className="properties-panel__field">
                  <label className="properties-panel__label">Font Size</label>
                  <input
                    type="text"
                    className="properties-panel__input"
                    value={selectedNode.styles?.fontSize || ''}
                    onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                    placeholder="16px"
                  />
                </div>
                
                <div className="properties-panel__field">
                  <label className="properties-panel__label">Font Weight</label>
                  <select
                    className="properties-panel__select"
                    value={selectedNode.styles?.fontWeight || '400'}
                    onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  >
                    <option value="300">Light (300)</option>
                    <option value="400">Regular (400)</option>
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi Bold (600)</option>
                    <option value="700">Bold (700)</option>
                  </select>
                </div>

                <div className="properties-panel__field">
                  <label className="properties-panel__label">Color</label>
                  <div className="properties-panel__color-input">
                    <input
                      type="color"
                      className="properties-panel__color-picker"
                      value={selectedNode.styles?.color || '#ffffff'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                    <input
                      type="text"
                      className="properties-panel__input"
                      value={selectedNode.styles?.color || '#ffffff'}
                      onChange={(e) => handleStyleChange('color', e.target.value)}
                    />
                  </div>
                </div>

                <div className="properties-panel__field">
                  <label className="properties-panel__label">Text Align</label>
                  <select
                    className="properties-panel__select"
                    value={selectedNode.styles?.textAlign || 'left'}
                    onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="justify">Justify</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Spacing */}
          <div className="properties-panel__section">
            <div
              className="properties-panel__section-header"
              onClick={() => toggleSection('spacing')}
            >
              <Layout size={14} />
              <span>Spacing</span>
              {expandedSections.has('spacing') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedSections.has('spacing') && (
              <div className="properties-panel__section-content">
                <div className="properties-panel__field-row">
                  <div className="properties-panel__field">
                    <label className="properties-panel__label">Padding</label>
                    <input
                      type="text"
                      className="properties-panel__input"
                      value={selectedNode.styles?.padding || ''}
                      onChange={(e) => handleStyleChange('padding', e.target.value)}
                      placeholder="8px"
                    />
                  </div>
                  <div className="properties-panel__field">
                    <label className="properties-panel__label">Margin</label>
                    <input
                      type="text"
                      className="properties-panel__input"
                      value={selectedNode.styles?.margin || ''}
                      onChange={(e) => handleStyleChange('margin', e.target.value)}
                      placeholder="0px"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Styles */}
          <button
            className="properties-panel__reset-btn"
            onClick={handleResetStyles}
          >
            <RotateCcw size={14} />
            <span>Reset to Default Styles</span>
          </button>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="properties-panel__content">
          {/* Custom Attributes */}
          <div className="properties-panel__section">
            <div
              className="properties-panel__section-header"
              onClick={() => toggleSection('attributes')}
            >
              <span>Custom Attributes</span>
              {expandedSections.has('attributes') ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            {expandedSections.has('attributes') && (
              <div className="properties-panel__section-content">
                {Object.entries(selectedNode.attributes || {}).map(([key, value]) => (
                  <div key={key} className="properties-panel__attribute-row">
                    <input
                      type="text"
                      className="properties-panel__input properties-panel__input--sm"
                      value={key}
                      placeholder="Key"
                      readOnly
                    />
                    <input
                      type="text"
                      className="properties-panel__input properties-panel__input--sm"
                      value={String(value)}
                      placeholder="Value"
                      onChange={(e) => {
                        const newAttrs = {
                          ...selectedNode.attributes,
                          [key]: e.target.value,
                        };
                        onUpdateNode(selectedNode.id, { attributes: newAttrs });
                      }}
                    />
                    <button
                      className="properties-panel__remove-attr-btn"
                      onClick={() => {
                        const newAttrs = { ...selectedNode.attributes };
                        delete newAttrs[key];
                        onUpdateNode(selectedNode.id, { attributes: newAttrs });
                      }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                
                <button
                  className="properties-panel__add-attr-btn"
                  onClick={() => {
                    const newKey = `attr-${Date.now()}`;
                    const newAttrs = {
                      ...selectedNode.attributes,
                      [newKey]: '',
                    };
                    onUpdateNode(selectedNode.id, { attributes: newAttrs });
                  }}
                >
                  <Plus size={14} />
                  <span>Add Attribute</span>
                </button>
              </div>
            )}
          </div>

          {/* Node Info */}
          <div className="properties-panel__section">
            <div className="properties-panel__section-content">
              <div className="properties-panel__info-row">
                <span className="properties-panel__info-label">Type</span>
                <span className="properties-panel__info-value">{selectedNode.type}</span>
              </div>
              <div className="properties-panel__info-row">
                <span className="properties-panel__info-label">ID</span>
                <span className="properties-panel__info-value">{selectedNode.id}</span>
              </div>
              <div className="properties-panel__info-row">
                <span className="properties-panel__info-label">Depth</span>
                <span className="properties-panel__info-value">{selectedNode.depth}</span>
              </div>
              <div className="properties-panel__info-row">
                <span className="properties-panel__info-label">Children</span>
                <span className="properties-panel__info-value">{selectedNode.children.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};