import { useState } from "react";
import { todoService } from "../../../services/todoService";
import type { CreateTodoModalProps } from "../../../types/todo";

export function CreateTodoModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTodoModalProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await todoService.create(title);
      setTitle("");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-2xl sm:p-7">
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">Task baru</p>
        <h2 className="mb-5 text-xl font-bold tracking-tight text-slate-800">
          Tambah Todo Baru
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Masukkan judul tugas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            autoFocus
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
