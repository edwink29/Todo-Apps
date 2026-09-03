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
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="h-16 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/60"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_5px_14px_-12px_rgba(30,41,59,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md cursor-pointer ${
        isOpen ? "z-20" : "z-0"
      }`}
    >
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400 transition group-hover:bg-indigo-500" />
      <p className="flex-1 text-sm font-medium leading-5 text-slate-700">{item.title}</p>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="rounded-lg p-1 text-slate-400 opacity-70 transition hover:bg-slate-100 hover:text-slate-700 group-hover:opacity-100 cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-30 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-xs shadow-xl">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onEdit(item);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onDelete(item.id);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
