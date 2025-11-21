import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Handle, Position } from "@xyflow/react";
import { cn } from "../lib/utils";

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
    <div className={cn('p-1 w-64 max-w-[300px] rounded-lg shadow-lg bg-gray-700 min-w-[250px]', selected && 'border-orange-400 border-2')}>

      <div className="m-3 p-2 flex items-center justify-center bg-indigo-900/20 text-gray-200 border border-indigo-300/50 rounded-md">
        <h3 className="font-bold text-center text-lg">{data.label}</h3>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter} onDragStart={() => { suppressNodeClickRef.current = true; }}   >
        <SortableContext items={data?.sections?.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {data?.sections?.map((section, index) => (
            <div key={index} className="m-3 p-3 border border-gray-600 rounded-md text-sm bg-gray-800 relative text-left">
              <div className="font-semibold text-white">{section.title}</div>
              {section.description && (
                <div className="text-gray-400 mt-1 text-xs italic line-clamp-1">{section.description}</div>
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