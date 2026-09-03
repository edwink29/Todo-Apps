import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { todoModule } from "./modules/todo";

const app = new Elysia()
  .use(cors())
  .use(todoModule)
  .listen(process.env.PORT ? Number(process.env.PORT) : 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
