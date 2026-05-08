// Tipos de nodos visuales soportados
export type NodeType = 'section' | 'container' | 'heading' | 'text' | 'image' | 'button' | 'componentInstance' | 'slot';

// Estructura de estilos en formato Tailwind (puedes extenderla mucho más)
export interface TailwindStyles {
  // Layout
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  // Spacing
  margin?: string;
  padding?: string;
  // Typography
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  // Colors
  backgroundColor?: string;
  textColor?: string;
  // Borders
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  // Effects
  boxShadow?: string;
  opacity?: string;
  // Sizing
  width?: string;
  height?: string;
}

export interface DesignNode {
  id: string;
  type: NodeType;
  name: string;
  props: Record<string, any>;      // Props dinámicas: texto, src, href...
  styles: TailwindStyles;
  children: DesignNode[];
  componentId?: string;            // Si es una instancia de componente
  overrides?: Record<string, any>;
}

export interface DesignPage {
  id: string;
  title: string;
  slug: string;
  layoutId?: string;
  nodes: DesignNode[];             // Árbol raíz
}

export interface DesignComponent {
  id: string;
  name: string;
  nodes: DesignNode[];
  propsDefinition: { name: string; type: string; default?: any }[];
}

export interface DesignProject {
  id: string;
  name: string;
  pages: DesignPage[];
  layouts: DesignPage[];
  components: DesignComponent[];
  globalStyles: { colors: Record<string, string>; fonts: string[] };
  assets: { id: string; url: string; name: string }[];
}