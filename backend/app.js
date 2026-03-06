import express from "express";
import cors from "cors";
import escrowRoutes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api", escrowRoutes);

app.use(errorMiddleware);

export default app;
