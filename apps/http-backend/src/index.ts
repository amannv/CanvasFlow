import express from "express";
import "dotenv/config";
import userRouter from "./routes/userRoutes";
const app = express();



app.use(express.json());

app.use("/api/v1/user", userRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
