import { useState, useCallback } from 'react';

/**
 * Custom hook for managing drag and drop functionality
 * @param {Array} initialItems - Initial array of items
 * @param {Function} onReorder - Callback when items are reordered
 * @returns {Object} - Drag and drop state and handlers
 */
const useDragDrop = (initialItems = [], onReorder) => {
  const [items, setItems] = useState(initialItems);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Handle drag start
  const handleDragStart = useCallback((id, index) => {
    setDraggingIndex(index);
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((index) => {
    setDragOverIndex(index);
  }, []);

  // Handle drop
  const handleDrop = useCallback((sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex) return;

    const newItems = [...items];
    const [movedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, movedItem);

    setItems(newItems);
    setDraggingIndex(null);
    setDragOverIndex(null);

    if (onReorder) {
      onReorder(newItems);
    }
  }, [items, onReorder]);

  // Reset to initial items
  const resetItems = useCallback(() => {
    setItems(initialItems);
    setDraggingIndex(null);
    setDragOverIndex(null);
  }, [initialItems]);

  // Update items programmatically
  const updateItems = useCallback((newItems) => {
    setItems(newItems);
  }, []);

  return {
    items,
    draggingIndex,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    resetItems,
    updateItems,
  };
};

export default useDragDrop;
