import { useState, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import { KanbanColumn } from "./KanbanColumn";
import { TodoCard } from "./TodoCard";
import { CreateTodoModal } from "./CreateTodoModal";
import { EditTodoModal } from "./EditTodoModal";
import type { Todo } from "../../../types/todo";
import { todoService } from "../../../services/todoService";

export function TodoListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTodoForEdit, setSelectedTodoForEdit] = useState<Todo | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeTodo = todos.find((t) => t.id === activeId);
    if (!activeTodo) return;

    let newStatus: "TODO" | "IN_PROGRESS" | "DONE" = activeTodo.status;

    if (["TODO", "IN_PROGRESS", "DONE"].includes(overId)) {
      newStatus = overId as "TODO" | "IN_PROGRESS" | "DONE";
    } else {
      const overTodo = todos.find((t) => t.id === overId);
      if (overTodo) {
        newStatus = overTodo.status;
      }
    }

    if (activeTodo.status === newStatus) return;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === activeId ? { ...todo, status: newStatus } : todo,
      ),
    );

    try {
      await todoService.update(activeId, activeTodo.title, newStatus);
    } catch (error) {
      console.error("Gagal memperbarui status todo:", error);
      fetchTodos();
    }
  };

  const todoList = todos.filter((t) => t.status === "TODO");
  const inProgressList = todos.filter((t) => t.status === "IN_PROGRESS");
  const doneList = todos.filter((t) => t.status === "DONE");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kanban Board</h1>
            <p className="text-sm text-slate-500">Kelola tugas harianmu</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer shadow-sm"
          >
            + Tambah Todo
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-slate-500 font-medium">
            Sedang mengambil data dari backend...
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg text-center mb-6 text-sm">
            {errorMsg}
          </div>
        )}

        {!isLoading && !errorMsg && (
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
