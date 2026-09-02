import { Elysia } from "elysia";
import { todoModule } from "./modules/todo";

const app = new Elysia().use(todoModule).listen(3000);

console.log(`Server jalan di http://localhost:${app.server?.port}`);
