import React, { useEffect, useState } from 'react';
import { GripVertical } from 'lucide-react';

const moveId = (ids, id, toIndex) => {
  const next = ids.filter((x) => x !== id);
  next.splice(toIndex, 0, id);
  return next;
};

/**
 * Drag-to-reorder grid using native drag events. Dragging starts only from the grip handle,
 * so toggles and buttons inside items keep working. The handle also supports ↑/↓ (and ←/→) keys.
 * `onReorder(ids)` is called once with the final order when it changed.
 * `trailing` is rendered after the items (e.g. an "add" tile) and is not sortable.
 */
export function SortableGrid({ items, onReorder, renderItem, trailing, className = '' }) {
  const [armedId, setArmedId] = useState(null); // item whose handle is held down
  const [dragId, setDragId] = useState(null);
  const [preview, setPreview] = useState(null); // ids in their in-progress order

  // Disarm if the handle is pressed and released anywhere without dragging
  useEffect(() => {
    if (armedId === null || dragId !== null) return undefined;
    const disarm = () => setArmedId(null);
    window.addEventListener('mouseup', disarm);
    return () => window.removeEventListener('mouseup', disarm);
  }, [armedId, dragId]);

  const ids = items.map((i) => i.id);
  const order = preview || ids;
  const byId = new Map(items.map((i) => [i.id, i]));
  const canSort = items.length > 1;

  const reset = () => {
    setArmedId(null);
    setDragId(null);
    setPreview(null);
  };

  const commit = (next) => {
    if (next.some((id, i) => id !== ids[i])) onReorder(next);
  };

  const allowDrop = (e) => {
    if (dragId === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleKey = (e, id) => {
    const index = ids.indexOf(id);
    const step = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const target = index + step;
    if (target >= 0 && target < ids.length) commit(moveId(ids, id, target));
  };

  return (
    <div className={className} onDragOver={allowDrop} onDrop={(e) => e.preventDefault()}>
      {order.map((id) => {
        const item = byId.get(id);
        if (!item) return null;
        const handle = canSort ? (
          <button
            type="button"
            title="Drag to reorder, or use the arrow keys"
            aria-label={`Reorder ${item.label}`}
            onMouseDown={() => setArmedId(id)}
            onMouseUp={() => setArmedId(null)}
            onKeyDown={(e) => handleKey(e, id)}
            className="-ml-1.5 mt-0.5 shrink-0 cursor-grab rounded-[4px] p-0.5 text-text-muted/30 transition-colors hover:text-text-muted/80 focus-visible:text-text-muted focus-visible:outline focus-visible:outline-1 focus-visible:outline-brand/60 active:cursor-grabbing"
          >
            <GripVertical size={14} />
          </button>
        ) : null;

        return (
          <div
            key={id}
            draggable={armedId === id}
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              e.dataTransfer.setData('text/plain', String(id));
              setDragId(id);
              setPreview(ids);
            }}
            onDragOver={(e) => {
              allowDrop(e);
              if (dragId === null || id === dragId) return;
              setPreview((p) => moveId(p || ids, dragId, (p || ids).indexOf(id)));
            }}
            onDragEnd={(e) => {
              // dropEffect 'none' = cancelled (Esc or dropped outside) → keep the old order
              if (e.dataTransfer.dropEffect !== 'none' && preview) commit(preview);
              reset();
            }}
          >
            {renderItem(item, { handle, dragging: dragId === id })}
          </div>
        );
      })}
      {trailing}
    </div>
  );
}

export default SortableGrid;
