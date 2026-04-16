import {
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { useEffect, useMemo, useState } from 'react';
import { DragHandle, SortableItem } from './sortableItem';

export default function SortableList({ items, onChange, renderItem }) {
  const [active, setActive] = useState(null);

  const safeItems = items ?? [];

  const activeItem = useMemo(
    () => safeItems.find((item) => item.id === active?.id),
    [active, safeItems],
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={(active) => setActive(active)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = safeItems.findIndex(({ id }) => id === active.id);
          const overIndex = safeItems.findIndex(({ id }) => id === over.id);
          onChange(arrayMove(safeItems, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => setActive(null)}
    >
      <SortableContext items={safeItems}>
        <ul role="application">
          {safeItems.map((item) => (
            <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeItem ? renderItem(activeItem) : null}
      </DragOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
