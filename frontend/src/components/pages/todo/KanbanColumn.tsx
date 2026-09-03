import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TodoCard } from "./TodoCard";
import type { Todo, KanbanColumnProps } from "../../../types/todo";

export function KanbanColumn({
  id,
  title,
  count,
  todos,
  titleColorClass,
  onDelete,
  onEdit,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-3 min-h-80"
    >
      <span className={`font-semibold ${titleColorClass}`}>
        {title} ({count})
      </span>

      {/* SortableContext membungkus daftar ID kartu yang ada di kolom ini */}
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3 min-h-50">
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
