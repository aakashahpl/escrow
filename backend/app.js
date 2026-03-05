import express from "express";
import escrowRoutes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api", escrowRoutes);

app.use(errorMiddleware);

export default app;
