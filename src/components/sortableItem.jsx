import React, { createContext, useContext, useMemo } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";


const SortableItemContext = createContext({
    attributes: {},
    listeners: undefined,
    ref() { }
});

export function SortableItem({ children, id }) {

    const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id });

    const context = useMemo(
        () => ({ attributes, listeners, ref: setActivatorNodeRef }),
        [attributes, listeners, setActivatorNodeRef]
    );

    const style = {
        opacity: isDragging ? 0.5 : undefined,
        transform: CSS.Translate.toString(transform),
        transition
    };

    return (
        <SortableItemContext.Provider value={context}>
            <li ref={setNodeRef} style={style}>
                {children}
            </li>
        </SortableItemContext.Provider>
    );
}

export function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
        <button type="button" {...attributes} {...listeners} ref={ref} className="p-1 touch-none cursor-grab active:cursor-grabbing focus:cursor-grabbing rounded-md  hover:bg-black/50">
            <GripVertical />
        </button>
    );
}
