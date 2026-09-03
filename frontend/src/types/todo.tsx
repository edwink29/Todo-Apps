export type TodoStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface TodoCardProps {
  item: Todo;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export interface Todo {
  id: string;
  title: string;
  status: TodoStatus;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface EditTodoModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface KanbanColumnProps {
  id: string; // "TODO" | "IN_PROGRESS" | "DONE"
  title: string;
  count: number;
  todos: Todo[];
  titleColorClass: string;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}