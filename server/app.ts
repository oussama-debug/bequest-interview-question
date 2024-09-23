import express, { type Request, type Response } from "express";
import cors from "cors";

import { databaseClient } from "./tools/database";

const PORT = 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req: Request, res: Response) => {
  res.json(databaseClient.list());
});

app.get("/:key", (req: Request<{ key: string }>, res: Response) => {

});

app.post(
  "/:key",
  (
    req: Request<{ key: string }, any, { [key: string]: any }>,
    res: Response
  ) => {
    const hash = databaseClient.set(req.params.key, req.body.data);
    // return hash as dataId
    res
      .status(200)
      .json({ message: "Data save has been successful", dataId: hash });
  }
);

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
