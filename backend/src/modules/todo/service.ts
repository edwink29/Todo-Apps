import { prisma } from "../../db/prisma";
import type { TodoStatus } from "@prisma/client";

export const todoService = {
  getAll: () =>
    prisma.todo.findMany({
      orderBy: { order: "asc" },
    }),

  create: (title: string) =>
    prisma.todo.create({
      data: { title },
    }),

  update: (id: string, data: { title?: string; status?: TodoStatus }) =>
    prisma.todo.update({
      where: { id },
      data,
    }),

  remove: (id: string) =>
    prisma.todo.delete({
      where: { id },
    }),

  reorder: (items: { id: string; status: TodoStatus; order: number }[]) =>
    prisma.$transaction(
      items.map((item) =>
        prisma.todo.update({
          where: { id: item.id },
          data: { status: item.status, order: item.order },
        }),
      ),
    ),
};
