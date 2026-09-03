import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoCard } from "./TodoCard";
import type { KanbanColumnProps } from "../../../types/todo";

export function KanbanColumn({
  id,
  title,
  count,
  todos,
  titleColorClass,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const accentClass =
    id === "TODO"
      ? "bg-slate-500"
      : id === "IN_PROGRESS"
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div
      ref={setNodeRef}
      className={`min-h-80 rounded-2xl border p-4 flex flex-col gap-4 transition-all duration-200 ${
        isOver
          ? "border-indigo-300 bg-indigo-50/70 shadow-lg shadow-indigo-100"
          : "border-white/80 bg-white/70 shadow-[0_10px_28px_-22px_rgba(30,41,59,0.5)]"
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${accentClass}`} />
          <span className={`text-sm font-bold tracking-wide ${titleColorClass}`}>{title}</span>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{count}</span>
      </div>

      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex min-h-50 flex-col gap-3 rounded-xl transition-colors">
          {todos.map((item) => (
            <TodoCard
              key={item.id}
              item={item}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
