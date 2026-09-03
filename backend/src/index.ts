import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { todoModule } from "./modules/todo/index"; // sesuaikan path import-nya

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(todoModule) // <-- ini yang hilang, wajib ditambahkan
  .listen(process.env.PORT || 3000);

console.log(`🦊 Elysia berjalan di port ${app.server?.port}`);
