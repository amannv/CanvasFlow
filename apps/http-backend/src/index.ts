import express from "express";
import "dotenv/config";
import userRouter from "./routes/userRoutes";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
