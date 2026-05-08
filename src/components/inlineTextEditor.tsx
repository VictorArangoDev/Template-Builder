import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { useDesignStore } from '../stores/useDesignStore';
import { useCanvasTextEditorStore } from '../stores/useCanvasTextEditor';

export default function InlineTextEditor({ targetRect }: { targetRect: DOMRect }) {
  const { nodeId, closeEditor } = useCanvasTextEditorStore();
  const updateNode = useDesignStore(s => s.updateNode);

  const editor = useEditor({
    extensions: [StarterKit],
    content: useCanvasTextEditorStore.getState().content,
    onBlur: ({ editor }) => {
      if (nodeId) {
        updateNode(nodeId, { props: { text: editor.getHTML() } });
      }
      closeEditor();
    },
    autofocus: true,
  });

  if (!nodeId) return null;

  return (
    <div style={{ position: 'absolute', top: targetRect.top, left: targetRect.left, zIndex: 50, minWidth: 200 }}
         className="bg-white border shadow-lg p-2 rounded">
      <EditorContent editor={editor} />
    </div>
  );
}