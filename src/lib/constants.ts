import type { NodeType, TNodeTypeConfig } from '../types/index';

// Tipos de nodos disponibles y su configuración
export const NODE_TYPES: Record<NodeType, TNodeTypeConfig> = {
  heading: {
    type: 'heading',
    label: 'Heading',
    icon: 'heading',
    description: 'Add a heading to your document',
    category: 'text',
    defaultContent: 'New Heading',
    defaultStyles: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
      tag: 'h2',
    },
    canHaveChildren: false,
  },
  paragraph: {
    type: 'paragraph',
    label: 'Paragraph',
    icon: 'type',
    description: 'Add a text paragraph',
    category: 'text',
    defaultContent: 'Start typing your paragraph here...',
    defaultStyles: {
      fontSize: '16px',
      fontWeight: '400',
      color: '#a1a1aa',
      lineHeight: '1.6',
      marginBottom: '12px',
    },
    canHaveChildren: false,
  },
  image: {
    type: 'image',
    label: 'Image',
    icon: 'image',
    description: 'Add an image to your document',
    category: 'media',
    defaultContent: '',
    defaultStyles: {
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      borderRadius: '8px',
      objectFit: 'cover',
    },
    canHaveChildren: false,
  },
  table: {
    type: 'table',
    label: 'Table',
    icon: 'table',
    description: 'Add a data table',
    category: 'layout',
    defaultContent: '',
    defaultStyles: {
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: '0',
    },
    canHaveChildren: true,
    maxChildren: 50,
  },
  variable: {
    type: 'variable',
    label: 'Variable',
    icon: 'braces',
    description: 'Insert a dynamic variable from collection',
    category: 'dynamic',
    defaultContent: '',
    defaultStyles: {
      padding: '4px 8px',
      backgroundColor: '#3b3b5c',
      borderRadius: '4px',
      color: '#a78bfa',
      fontWeight: '500',
    },
    canHaveChildren: false,
  },
  container: {
    type: 'container',
    label: 'Container',
    icon: 'container',
    description: 'Add a container for grouping elements',
    category: 'layout',
    defaultContent: '',
    defaultStyles: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    canHaveChildren: true,
  },
  row: {
    type: 'row',
    label: 'Table Row',
    icon: 'row',
    description: 'Add a table row',
    category: 'layout',
    defaultContent: '',
    defaultStyles: {
      display: 'flex',
      borderBottom: '1px solid #2a2a4a',
    },
    canHaveChildren: true,
    maxChildren: 10,
  },
  column: {
    type: 'column',
    label: 'Table Column',
    icon: 'column',
    description: 'Add a table column',
    category: 'layout',
    defaultContent: '',
    defaultStyles: {
      flex: '1',
      padding: '8px',
      borderRight: '1px solid #2a2a4a',
    },
    canHaveChildren: true,
  },
} as const;

// IDs y configuración de Supabase (si se usa)
export const SUPABASE_CONFIG = {
  url: import.meta.env.PUBLIC_SUPABASE_URL || '',
  anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '',
};

// Límites del editor
export const EDITOR_LIMITS = {
  MAX_NODES: 500,
  MAX_DEPTH: 10,
  MAX_HISTORY: 50,
  MAX_NAME_LENGTH: 100,
};

// Categorías de nodos para el menú
export const NODE_CATEGORIES = [
  {
    id: 'text',
    label: 'Text',
    icon: 'type',
    types: ['heading', 'paragraph'] as NodeType[],
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'image',
    types: ['image'] as NodeType[],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: 'layout',
    types: ['table', 'container', 'row', 'column'] as NodeType[],
  },
  {
    id: 'dynamic',
    label: 'Dynamic',
    icon: 'braces',
    types: ['variable'] as NodeType[],
  },
] as const;