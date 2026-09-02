import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  .use(cors())
  .get("/", () => "API jalan")
  .listen(3000);

console.log("Server jalan di http://localhost:3000");
