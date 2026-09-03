import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchTodos();
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-3 min-h-75">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">TODO</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {todoList.length}
                </span>
              </div>
              {todoList.map((item) => (
                <TodoCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={setSelectedTodoForEdit}
                />
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-3 min-h-75">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-amber-600">
                  IN PROGRESS
                </span>
                <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {inProgressList.length}
                </span>
              </div>
              {inProgressList.map((item) => (
                <TodoCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={setSelectedTodoForEdit}
                />
              ))}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-3 min-h-75">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-semibold text-emerald-600">DONE</span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                  {doneList.length}
                </span>
              </div>
              {doneList.map((item) => (
                <TodoCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onEdit={setSelectedTodoForEdit}
                />
              ))}
            </div>
          </div>
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
