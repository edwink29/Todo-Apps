import { t } from "elysia";

export const createTodoModel = t.Object({
  title: t.String({ minLength: 1 }),
});

export const updateTodoModel = t.Object({
  title: t.Optional(t.String({ minLength: 1 })),
  status: t.Optional(
    t.Union([t.Literal("TODO"), t.Literal("IN_PROGRESS"), t.Literal("DONE")]),
  ),
});

export const reorderTodoModel = t.Array(
  t.Object({
    id: t.String(),
    status: t.Union([
      t.Literal("TODO"),
      t.Literal("IN_PROGRESS"),
      t.Literal("DONE"),
    ]),
    order: t.Number(),
  }),
);
