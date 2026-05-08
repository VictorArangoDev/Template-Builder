import { useDesignStore } from '../stores/useDesignStore';
import type { DesignNode } from '../types/design';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function LayerPanel() {
  const nodes = useDesignStore(s => s.nodes);
  return (
    <div className="w-60 bg-white border-r overflow-auto p-2">
      <h3 className="font-bold mb-2">Capas</h3>
      {nodes.map((node, idx) => (
        <LayerItem key={node.id} node={node} depth={0} index={idx} />
      ))}
    </div>
  );
}

function LayerItem({ node, depth, index }: { node: DesignNode; depth: number; index: number }) {
  const { selectNode, selectedNodeId } = useDesignStore();
  const isSelected = node.id === selectedNodeId;
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({ id: node.id });

  const style = { transform: CSS.Transform.toString(transform), transition, paddingLeft: depth * 16 };

  return (
    <div>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-pointer flex items-center ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
        onClick={() => selectNode(node.id)}
      >
        {node.type} - {node.name}
      </div>
      {node.children.map((child, idx) => (
        <LayerItem key={child.id} node={child} depth={depth + 1} index={idx} />
      ))}
    </div>
  );
}