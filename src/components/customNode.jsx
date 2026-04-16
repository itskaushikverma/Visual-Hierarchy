import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../lib/utils';

export default function CustomNode({ id, data, selected, onNodeDataChange }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = data.sections.findIndex((s) => s.id === active.id);
    const newIndex = data.sections.findIndex((s) => s.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newSections = arrayMove(data.sections, oldIndex, newIndex);
    onNodeDataChange(id, { sections: newSections });
  }

  return (
    <div
      className={cn(
        'w-64 max-w-[300px] min-w-[250px] rounded-lg bg-gray-700 p-1 shadow-lg',
        selected && 'border-2 border-orange-400',
      )}
    >
      <div className="m-3 flex items-center justify-center rounded-md border border-indigo-300/50 bg-indigo-900/20 p-2 text-gray-200">
        <h3 className="text-center text-lg font-bold">{data.label}</h3>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        onDragStart={() => {
          suppressNodeClickRef.current = true;
        }}
      >
        <SortableContext
          items={data?.sections?.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {data?.sections?.map((section, index) => (
            <div
              key={index}
              className="relative m-3 rounded-md border border-gray-600 bg-gray-800 p-3 text-left text-sm"
            >
              <div className="font-semibold text-white">{section.title}</div>
              {section.description && (
                <div className="mt-1 line-clamp-1 text-xs text-gray-400 italic">
                  {section.description}
                </div>
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
