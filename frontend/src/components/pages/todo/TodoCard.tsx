import { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TodoCardProps } from "../../../types/todo";

export function TodoCard({ item, onDelete, onEdit }: TodoCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-lg border border-slate-200 flex items-start justify-between gap-2 transition shadow-xs"
    >
      <p className="text-sm font-medium text-slate-700">{item.title}</p>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer transition"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-md z-10 py-1 text-xs">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit(item);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:bg-slate-100 cursor-pointer font-medium"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete(item.id);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer font-medium"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
