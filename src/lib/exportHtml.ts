import type { TNode } from '../types';

export type ExportPage = {
  id?: string;
  title?: string;
  slug?: string;
  nodes?: TNode[];
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stylesToString(styles: Record<string, string> | undefined): string {
  if (!styles) return '';
  return Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== '')
    .map(([k, v]) => `${k}:${String(v).trim()}`)
    .join(';');
}

function nodeTag(node: TNode): 'div' | 'p' | 'h2' | 'img' | 'span' {
  switch (node.type) {
    case 'paragraph':
      return 'p';
    case 'heading':
      return 'h2';
    case 'image':
      return 'img';
    case 'variable':
      return 'span';
    case 'container':
    default:
      return 'div';
  }
}

function nodePositionStyle(node: TNode): string {
  const isBody = node.name?.toLowerCase() === 'body';
  if (isBody) return 'position:relative;top:0;left:0;';
  const x = node.x || 0;
  const y = node.y || 0;
  // Mantiene el mismo modelo visual del canvas (absolute + translate)
  return `position:absolute;top:0;left:0;transform:translate(${x}px,${y}px);`;
}

export function nodesToInnerHtml(nodes: TNode[]): string {
  return nodes.map((n) => nodeToHtml(n)).join('');
}

export function nodeToHtml(node: TNode): string {
  const tag = nodeTag(node);
  const baseStyle = nodePositionStyle(node);
  const extraStyle = stylesToString(node.styles);
  const z = node.zIndex !== undefined ? `z-index:${node.zIndex};` : '';
  const styleAttr = [baseStyle, z, extraStyle].filter(Boolean).join('');
  const style = styleAttr ? ` style="${escapeHtml(styleAttr)}"` : '';

  const childrenHtml = node.children?.length ? node.children.map((c) => nodeToHtml(c)).join('') : '';

  if (tag === 'img') {
    const src = node.content || '';
    const alt = node.name || 'image';
    return `<img${style} src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" />`;
  }

  if (tag === 'span') {
    const content = node.content || node.name || '';
    return `<span${style}>${escapeHtml(content)}</span>`;
  }

  const content = node.type === 'container' ? '' : (node.content || '');
  return `<${tag}${style}>${escapeHtml(content)}${childrenHtml}</${tag}>`;
}

export function buildExportHtmlDocument(nodes: TNode[], title: string = 'Export'): string {
  const inner = nodesToInnerHtml(nodes);
  // Documento mínimo, con un wrapper relativo para anclar absolutos
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .page-root { position: relative; min-height: 100vh; width: 100%; }
      .page-wrapper { position: relative; min-height: 100vh; width: 100%; }
    </style>
  </head>
  <body>
    <div class="page-root">${inner}</div>
  </body>
</html>`;
}

export function buildExportHtmlDocumentFromPages(pages: ExportPage[], title: string = 'Export'): string {
  const safePages = Array.isArray(pages) ? pages : [];
  const inner = safePages
    .map((p, idx) => {
      const pageTitle = p?.title || `Page ${idx + 1}`;
      const pageSlug = p?.slug || `page-${idx + 1}`;
      const pageId = p?.id || pageSlug;
      const pageInner = nodesToInnerHtml((p?.nodes || []) as TNode[]);
      return `<!-- page:${escapeHtml(pageSlug)} -->
<div class="page-wrapper" data-page-id="${escapeHtml(pageId)}" data-page-slug="${escapeHtml(pageSlug)}" data-page-title="${escapeHtml(pageTitle)}">${pageInner}</div>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      html, body { height: 100%; margin: 0; padding: 0; }
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
      .page-root { width: 100%; }
      .page-wrapper { position: relative; min-height: 100vh; width: 100%; }
    </style>
  </head>
  <body>
    <div class="page-root">
      ${inner}
    </div>
  </body>
</html>`;
}

