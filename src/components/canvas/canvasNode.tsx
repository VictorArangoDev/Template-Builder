import React from 'react'
import { cn } from '../../lib/utils'
import type { TNode } from '../../types'

interface CanvasNodeProps {
  node: TNode
  selectedNodeId: string | null
  onSelectNode: (nodeId: string | null) => void
}

export default function CanvasNode({
  node,
  selectedNodeId,
  onSelectNode,
}: CanvasNodeProps) {
  const isSelected = selectedNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  // Convert style properties into react-compatible camelCase inline styles
  const getInlineStyles = () => {
    const inlineStyles: React.CSSProperties = {};
    if (!node.styles) return inlineStyles;

    Object.entries(node.styles).forEach(([key, val]) => {
      // Map basic key names if they contain dashes
      const camelKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      (inlineStyles as any)[camelKey] = val;
    });

    return inlineStyles;
  };

  const style = {
    ...getInlineStyles(),
  };

  // Render container node
  if (node.type === 'container') {
    const isBody = node.name.toLowerCase() === 'body';
    return (
      <div
        style={style}
        onClick={handleClick}
        className={cn(
          'relative transition-all duration-150',
          isBody
            ? 'w-full min-h-full bg-white p-8 border-none focus:outline-none'
            : 'border border-dashed border-gray-200 p-4 rounded-md my-2 hover:border-blue-300',
          isSelected && (isBody ? 'outline-2 outline-blue-600 -outline-offset-2' : 'outline-2 outline-blue-600 outline-offset-1')
        )}
      >
        {/* Visual selector border line for selected node */}
        {isSelected && !isBody && (
          <div className="absolute -top-2 -left-[1px] bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-20 pointer-events-none select-none">
            {node.name}
          </div>
        )}

        {node.children && node.children.length > 0 ? (
          node.children.map((child) => (
            <CanvasNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
            />
          ))
        ) : (
          <div className="text-center py-6 text-[11px] text-gray-400 font-semibold border border-dashed border-gray-200 bg-gray-50/50 rounded-sm">
            Empty {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render text/paragraph node
  if (node.type === 'paragraph') {
    return (
      <div className="relative group/text my-1.5">
        <p
          style={style}
          onClick={handleClick}
          className={cn(
            'text-gray-700 text-sm leading-relaxed p-1 hover:bg-blue-50/30 rounded transition-colors',
            isSelected && 'outline-2 outline-blue-600 rounded-sm'
          )}
        >
          {node.content || 'Start typing text here...'}
        </p>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render heading node
  if (node.type === 'heading') {
    return (
      <div className="relative group/text my-2">
        <h2
          style={style}
          onClick={handleClick}
          className={cn(
            'text-gray-900 text-lg font-bold p-1 hover:bg-blue-50/30 rounded transition-colors',
            isSelected && 'outline-2 outline-blue-600 rounded-sm'
          )}
        >
          {node.content || 'Heading'}
        </h2>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render image node
  if (node.type === 'image') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'relative my-3 p-1 rounded hover:bg-blue-50/30 transition-all overflow-hidden flex justify-center',
          isSelected && 'outline-2 outline-blue-600 rounded-sm'
        )}
      >
        <img
          src={node.content || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=60'}
          alt={node.name}
          style={style}
          className="max-w-full h-auto rounded-md shadow-xs object-cover"
        />
        {isSelected && (
          <div className="absolute -top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs z-20 pointer-events-none select-none">
            {node.name}
          </div>
        )}
      </div>
    );
  }

  // Render variable node
  if (node.type === 'variable') {
    return (
      <div className="relative inline-block my-1 mx-0.5">
        <span
          onClick={handleClick}
          // style={style}
          className={cn(
            'inline-block text-black text-xs font-mono ',
            isSelected && 'outline-2 outline-blue-600'
          )}
        >
          {`{${node.content || node.name}}`}
        </span>
        {isSelected && (
          <div className="absolute -top-3.5 left-0 bg-blue-600 text-white text-[9px] font-bold px-1 py-0.2 rounded shadow-xs z-20 pointer-events-none select-none">
            Variable
          </div>
        )}
      </div>
    );
  }

  // Fallback for other nodes
  return (
    <div
      onClick={handleClick}
      style={style}
      className={cn(
        'p-3 border border-gray-200 rounded my-2 text-xs font-semibold hover:border-blue-400 cursor-pointer',
        isSelected && 'border-blue-600 ring-2 ring-blue-100'
      )}
    >
      {node.name} ({node.type})
    </div>
  );
}
