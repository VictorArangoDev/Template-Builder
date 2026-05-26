// hooks/useDragAndDrop.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface DragPosition {
  x: number;
  y: number;
}

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
  nodeId,
  initialX,
  initialY,
  onDragStart,
  onDragEnd,
  onDragMove,
  disabled = false,
}: UseDragAndDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: position.x, y: position.y };
    
    onDragStart?.();
  }, [disabled, position, onDragStart]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;
    
    const newX = elementStartPos.current.x + deltaX;
    const newY = elementStartPos.current.y + deltaY;
    
    setPosition({ x: newX, y: newY });
    onDragMove?.(newX, newY);
  }, [isDragging, onDragMove]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onDragEnd?.(position.x, position.y);
  }, [isDragging, position, onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Actualizar posición cuando cambian las props
  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: initialX, y: initialY });
    }
  }, [initialX, initialY, isDragging]);

  return {
    isDragging,
    position,
    handlers: {
      onMouseDown: handleMouseDown,
    },
    cursor: isDragging ? 'grabbing' : 'grab',
  };
};