import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { todoModule } from "./modules/todo";

const app = new Elysia()
  .use(cors()) 
  .use(todoModule)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
