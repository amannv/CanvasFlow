import express from "express";
import "dotenv/config";
import userRouter from "./routes/userRoutes";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL as string, "http://localhost:3000"],
    credentials: true,
  }),
);

app.use("/api/v1/user", userRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
