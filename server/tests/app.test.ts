import request from "supertest";
import { app } from "../app";

describe("GET /", () => {
  it("should list all data", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(typeof res.body.data).toBe("object");
    expect(Array.isArray(res.body.data)).toBe(false);
  });
});

describe("GET /:key", () => {
  it("should get data by key", async () => {
    const key = "testKey";
    const res = await request(app).get(`/${key}`);
    if (res.status === 200) {
      expect(res.body).toHaveProperty("dataId");
    } else {
      expect(res.status).toBe(500);
    }
  });
});

describe("POST /:key", () => {
  it("should save data and return dataId", async () => {
    const key = "testKey";
    const data = { data: "testData" };
    const res = await request(app).post(`/${key}`).send(data);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("dataId");
  });
});