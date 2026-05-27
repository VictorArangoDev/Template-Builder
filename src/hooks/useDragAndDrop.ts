import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDragAndDropProps {
  nodeId: string;
  initialX: number;
  initialY: number;
  onDragStart?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  onDragMove?: (x: number, y: number) => void;
  disabled?: boolean;
}

export const useDragAndDrop = ({
  initialX,
  initialY,
  onDragStart,
  onDragEnd,
  onDragMove,
  disabled = false,
}: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Guardamos las posiciones en refs para evitar re-renders en cada movimiento
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: initialX, y: initialY });
  const currentPos = useRef({ x: initialX, y: initialY });
  
  const elementRef = useRef<HTMLElement | null>(null);

  // Sincronizar coordenadas cuando cambian desde el Store externo (ej: panel de propiedades)
  useEffect(() => {
    if (!isDragging) {
      elementStartPos.current = { x: initialX, y: initialY };
      currentPos.current = { x: initialX, y: initialY };
      if (elementRef.current) {
        elementRef.current.style.transform = `translate(${initialX}px, ${initialY}px)`;
      }
    }
  }, [initialX, initialY, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { ...currentPos.current };
    
    onDragStart?.();
  }, [disabled, onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    
    const newX = elementStartPos.current.x + deltaX;
    const newY = elementStartPos.current.y + deltaY;
    
    currentPos.current = { x: newX, y: newY };

    // Mutación directa del DOM (Ultra rápido, corre en la GPU)
    if (elementRef.current) {
      elementRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }

    onDragMove?.(newX, newY);
  }, [isDragging, onDragMove]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    // Notificamos al store la posición final real calculada
    onDragEnd?.(currentPos.current.x, currentPos.current.y);
  }, [isDragging, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    elementRef,
    handlers: {
      onMouseDown: handleMouseDown,
    },
    cursor: isDragging ? 'grabbing' : 'grab',
  };
};