import express, { type Request, type Response } from "express";
import { ENV } from "./config/env.ts";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors"

const app = express();

app.use(cors({ origin: ENV.CLIENT_API, credentials: true }));

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello Kumar",
  })
});


app.listen(ENV.PORT, () => {
  console.log(`Server is running on http://localhost:${ENV.PORT}`);
});