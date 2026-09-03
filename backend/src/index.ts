import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";

const app = new Elysia()
  // Pasang cors() dengan origin true atau ijinkan semua origin
  .use(
    cors({
      origin: true, // Mengizinkan domain Vercel kamu
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  // ... rest of your code
  .listen(process.env.PORT || 3000);
