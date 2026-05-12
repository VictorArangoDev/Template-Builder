// src/components/layers/LayersPanelMenu.tsx
import React, { useEffect, useRef } from 'react';
import type { NodeType } from '../../types';
import { NODE_CATEGORIES } from '../../lib/constants';
import { 
  Type, 
  Image, 
  Table, 
  Braces, 
  Container,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Group,
  Ungroup,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import './layers.css';

interface LayersPanelMenuProps {
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: (type: NodeType) => void;
  selectedNodeId: string | null;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  text: <Type size={14} />,
  media: <Image size={14} />,
  layout: <Table size={14} />,
  dynamic: <Braces size={14} />,
};

export const LayersPanelMenu: React.FC<LayersPanelMenuProps> = ({
  position,
  onClose,
  onAddNode,
  selectedNodeId,
  onDeleteSelected,
  onDuplicateSelected,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Ajustar posición para que no se salga de la pantalla
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 220),
    y: Math.min(position.y, window.innerHeight - 400),
  };

  return (
    <div
      ref={menuRef}
      className="layers-menu"
      style={{ left: adjustedPosition.x, top: adjustedPosition.y }}
    >
      {/* Sección: Add Element */}
      <div className="layers-menu__section">
        <div className="layers-menu__section-title">Add Element</div>
        {NODE_CATEGORIES.map(category => (
          <div key={category.id} className="layers-menu__category">
            <div className="layers-menu__category-header">
              {CATEGORY_ICONS[category.id]}
              <span>{category.label}</span>
            </div>
            {category.types.map(type => (
              <button
                key={type}
                className="layers-menu__item"
                onClick={() => onAddNode(type)}
              >
                <span className="layers-menu__item-label">Add {type}</span>
                <span className="layers-menu__shortcut">⌘+{type.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Sección: Actions (solo si hay nodo seleccionado) */}
      {selectedNodeId && (
        <>
          <div className="layers-menu__divider" />
          <div className="layers-menu__section">
            <div className="layers-menu__section-title">Actions</div>
            
            <button
              className="layers-menu__item"
              onClick={onDuplicateSelected}
            >
              <Copy size={14} />
              <span className="layers-menu__item-label">Duplicate</span>
              <span className="layers-menu__shortcut">⌘D</span>
            </button>

            <button
              className="layers-menu__item layers-menu__item--danger"
              onClick={onDeleteSelected}
            >
              <Trash2 size={14} />
              <span className="layers-menu__item-label">Delete</span>
              <span className="layers-menu__shortcut">⌫</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};