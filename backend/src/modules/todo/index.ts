import { Elysia, t } from "elysia";
import { todoService } from "./service";
import { createTodoModel, updateTodoModel, reorderTodoModel } from "./model";

export const todoModule = new Elysia({ prefix: "/todos" })
  .get("/", async () => {
    return await todoService.getAll();
  })
  .post(
    "/",
    async ({ body }) => {
      return await todoService.create(body.title);
    },
    {
      body: createTodoModel,
    },
  )
  .patch(
    "/reorder",
    async ({ body }) => {
      return await todoService.reorder(body);
    },
    {
      body: reorderTodoModel,
    },
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      return await todoService.update(params.id, body);
    },
    {
      params: t.Object({ id: t.String() }),
      body: updateTodoModel,
    },
  )
  .delete(
    "/:id",
    async ({ params }) => {
      return await todoService.remove(params.id);
    },
    {
      params: t.Object({ id: t.String() }),
    },
  );
