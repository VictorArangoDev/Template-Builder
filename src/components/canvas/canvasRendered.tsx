'use client';
import { useDesignStore } from '../../stores/useDesignStore';
import CanvasNode from './canvasNode';

export default function CanvasRenderer() {
  const nodes = useDesignStore(state => state.nodes);
  const selectNode = useDesignStore(state => state.selectNode);
  const selectedNodeId = useDesignStore(state => state.selectedNodeId);

  return (
    <div className="flex-1 bg-gray-50 p-8 overflow-auto" onClick={() => selectNode(null)}>
      <div className="min-h-screen bg-white mx-auto max-w-5xl shadow-lg p-4">
        {nodes.map(node => (
          <CanvasNode key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  );
}