import { useDesignStore } from '../stores/useDesignStore';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export default function PropertiesPanel() {
  const selectedNodeId = useDesignStore(s => s.selectedNodeId);
  const node = useDesignStore(s => selectedNodeId ? s.findNode(selectedNodeId) : null);
  const updateNode = useDesignStore(s => s.updateNode);

  const form = useForm({ defaultValues: node?.props ?? {} });

  useEffect(() => {
    if (node) form.reset(node.props);
  }, [node]);

  const onSubmit = (data: any) => {
    updateNode(node!.id, { props: data });
  };

  if (!node) return <div className="p-4">Selecciona un elemento</div>;

  return (
    <div className="w-64 bg-white border-l p-4">
      <h3 className="font-bold">Propiedades</h3>
      <form onChange={form.handleSubmit(onSubmit)}>
        {node.type === 'heading' && (
          <>
            <label>Texto</label>
            <input {...form.register('text')} className="border p-1 w-full" />
            <label>Nivel (h1-h6)</label>
            <select {...form.register('level')} className="border p-1 w-full">
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>h{n}</option>)}
            </select>
          </>
        )}
        {node.type === 'button' && (
          <>
            <label>Texto</label>
            <input {...form.register('text')} className="border p-1 w-full" />
            <label>URL</label>
            <input {...form.register('href')} className="border p-1 w-full" />
          </>
        )}
        {/* Panel de estilos común */}
        {/* <StyleEditor node={node} /> */}
      </form>
    </div>
  );
}