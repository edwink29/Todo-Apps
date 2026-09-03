import { environment } from "../constants/environtment";
import { fetchAPI } from "../utils/fetch";
import type { Todo } from "../types/todo";

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    return fetchAPI<Todo[]>(`${environment.API_URL}/todos`, {
      method: "GET",
    });
  },

  create: async (title: string): Promise<Todo> => {
    return fetchAPI<Todo>(`${environment.API_URL}/todos`, {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  update: async (
    id: string,
    title: string,
    status?: "TODO" | "IN_PROGRESS" | "DONE",
  ): Promise<Todo> => {
    return fetchAPI<Todo>(`${environment.API_URL}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title, status }),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI<void>(`${environment.API_URL}/todos/${id}`, {
      method: "DELETE",
    });
  },

  updateStatusAndOrder: async (
    id: string,
    status: "TODO" | "IN_PROGRESS" | "DONE",
    order: number,
  ): Promise<Todo> => {
    return fetchAPI<Todo>(`${environment.API_URL}/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, order }),
    });
  },
};
