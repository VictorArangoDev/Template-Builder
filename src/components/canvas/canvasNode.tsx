import type { DesignNode } from '../../types/design';
import { useDesignStore } from '../../stores/useDesignStore';
import { stylesToClassString } from '../../lib/utils';

interface Props {
  node: DesignNode;
  depth: number;
}

export default function CanvasNode({ node, depth }: Props) {
  const { selectNode, selectedNodeId } = useDesignStore();
  const isSelected = node.id === selectedNodeId;
  const classString = stylesToClassString(node.styles);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);
  };

  const commonProps = {
    className: `relative ${classString} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`,
    onClick: handleClick,
  };

  switch (node.type) {
    case 'section':
      return (
        <section {...commonProps}>
          {node.children.map(child => <CanvasNode key={child.id} node={child} depth={depth+1} />)}
        </section>
      );
    case 'container':
      return (
        <div {...commonProps}>
          {node.children.map(child => <CanvasNode key={child.id} node={child} depth={depth+1} />)}
        </div>
      );
    case 'heading':
      const Level = (node.props.level || 2) <= 6 ? `h${node.props.level}` : 'h2';
      // @ts-ignore
      return <Level {...commonProps}>{node.props.text || 'Heading'}</Level>;
    case 'text':
      return <p {...commonProps}>{node.props.text || 'Text'}</p>;
    case 'image':
      return <img {...commonProps} src={node.props.src || 'https://via.placeholder.com/400'} alt={node.props.alt || ''} />;
    case 'button':
      return <button {...commonProps}>{node.props.text || 'Button'}</button>;
    default:
      return <div {...commonProps}>{node.type}</div>;
  }
}