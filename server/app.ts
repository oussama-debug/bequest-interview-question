import express, { type Request, type Response } from "express";
import cors from "cors";

import { databaseClient } from "./tools/database";
import { calculateHash256 } from "./tools/crypto";

const PORT = 8080;
export const app = express();

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req: Request, res: Response) => {
  res.json(databaseClient.list());
});

app.get("/:key", (req: Request<{ key: string }>, res: Response) => {
  const data = databaseClient.get(req.params.key);
  if (data.success === true && data.data) {
    res.status(200).json({ ...data, dataId: calculateHash256(data.data) });
  } else {
    res.status(500).json({ ...data });
  }
});

app.post('/verify', (
  req: Request<any, any, { [key: string]: any }>,
  res: Response
) => {
  const dataToVerify = JSON.parse(req.body.data)
  const verified = databaseClient.verify(dataToVerify);
  res.status(200).json({ verified: verified});
});

app.post(
  "/",
  (
    req: Request<any, any, { [key: string]: any }>,
    res: Response
  ) => {
    const newData = JSON.parse(req.body.data);
    const keys = Object.keys(newData);

    for (let key of keys) {
      if(newData[key].data) {
        databaseClient.set(key, newData[key].data);
      }
    }
    res.status(200).json({ success: true });
  }
);

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
