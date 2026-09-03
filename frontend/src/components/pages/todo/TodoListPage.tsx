import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { ClipboardList, Plus } from "lucide-react";

import { KanbanColumn } from "./KanbanColumn";
import { CreateTodoModal } from "./CreateTodoModal";
import { EditTodoModal } from "./EditTodoModal";
import type { Todo, TodoStatus } from "../../../types/todo";
import { todoService } from "../../../services/todoService";

const STATUSES: TodoStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
const isStatus = (id: string): id is TodoStatus =>
  STATUSES.includes(id as TodoStatus);

export function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoForEdit, setSelectedTodoForEdit] = useState<Todo | null>(
    null,
  );
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findContainer = (id: string): TodoStatus | undefined => {
    if (isStatus(id)) return id;
    return todos.find((t) => t.id === id)?.status;
  };

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setErrorMsg("Gagal terhubung ke backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus todo ini?")) return;

    try {
      await todoService.delete(id);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
      alert("Gagal menghapus todo. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const todo = todos.find((t) => t.id === String(event.active.id));
    if (todo) setActiveTodo(todo);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setTodos((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prev;

      const movedItem: Todo = { ...prev[activeIndex], status: overContainer };
      const withoutActive = prev.filter((t) => t.id !== activeId);

      if (isStatus(overId)) {
        return [...withoutActive, movedItem];
      }

      const overIndex = withoutActive.findIndex((t) => t.id === overId);
      if (overIndex === -1) return [...withoutActive, movedItem];

      const next = [...withoutActive];
      next.splice(overIndex, 0, movedItem);
      return next;
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTodo(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer) return;

    const containerItems = todos
      .filter((t) => t.status === overContainer)
      .sort((a, b) => a.order - b.order);

    const activeIndex = containerItems.findIndex((t) => t.id === activeId);
    if (activeIndex === -1) return;

    const overIndex = isStatus(overId)
      ? containerItems.length - 1
      : containerItems.findIndex((t) => t.id === overId);

    const reordered =
      overIndex !== -1 && overIndex !== activeIndex
        ? arrayMove(containerItems, activeIndex, overIndex)
        : containerItems;

    const updatedContainerItems = reordered.map((t, idx) => ({
      ...t,
      order: idx,
      status: overContainer,
    }));

    const newTodos = [
      ...todos.filter((t) => t.status !== overContainer),
      ...updatedContainerItems,
    ];

    setTodos(newTodos);

    try {
      await todoService.reorder(
        updatedContainerItems.map(({ id, status, order }) => ({
          id,
          status,
          order,
        })),
      );
    } catch (error) {
      console.error("Gagal menyimpan urutan todo:", error);
      fetchTodos();
    }
  };

  const todoList = todos
    .filter((t) => t.status === "TODO")
    .sort((a, b) => a.order - b.order);
  const inProgressList = todos
    .filter((t) => t.status === "IN_PROGRESS")
    .sort((a, b) => a.order - b.order);
  const doneList = todos
    .filter((t) => t.status === "DONE")
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen px-4 py-6 text-slate-800 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 rounded-3xl border border-white/80 bg-white/70 p-5 shadow-[0_12px_40px_-20px_rgba(30,41,59,0.35)] backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                My workspace
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Kanban Board
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Kelola tugas harianmu dengan lebih teratur.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Tambah Todo
          </button>
        </div>

        {isLoading && (
          <div className="rounded-2xl border border-white bg-white/75 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
            <p className="font-medium text-slate-500">
              Sedang mengambil data dari backend...
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm font-medium text-rose-600 shadow-sm">
            {errorMsg}
          </div>
        )}

        {!isLoading && !errorMsg && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <KanbanColumn
                id="TODO"
                title="TODO"
                count={todoList.length}
                todos={todoList}
                titleColorClass="text-slate-700"
                onDelete={handleDelete}
                onEdit={(todo) => setSelectedTodoForEdit(todo)}
              />

              <KanbanColumn
                id="IN_PROGRESS"
                title="IN PROGRESS"
                count={inProgressList.length}
                todos={inProgressList}
                titleColorClass="text-amber-600"
                onDelete={handleDelete}
                onEdit={(todo) => setSelectedTodoForEdit(todo)}
              />

              <KanbanColumn
                id="DONE"
                title="DONE"
                count={doneList.length}
                todos={doneList}
                titleColorClass="text-emerald-600"
                onDelete={handleDelete}
                onEdit={(todo) => setSelectedTodoForEdit(todo)}
              />
            </div>

            <DragOverlay>
              {activeTodo ? (
                <div className="flex items-start justify-between gap-2 rounded-2xl border border-indigo-300 bg-white p-4 shadow-2xl rotate-2 cursor-grabbing">
                  <p className="text-sm font-semibold text-slate-700">
                    {activeTodo.title}
                  </p>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTodos}
      />

      <EditTodoModal
        isOpen={!!selectedTodoForEdit}
        onClose={() => setSelectedTodoForEdit(null)}
        todo={selectedTodoForEdit}
        onSuccess={fetchTodos}
      />
    </div>
  );
}
