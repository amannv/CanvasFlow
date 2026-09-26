import express from "express";
import "dotenv/config";
import userRouter from "./routes/userRoutes";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string, `http://localhost:${PORT}`],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
