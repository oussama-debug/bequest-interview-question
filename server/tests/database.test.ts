import { DatabaseClient } from "../tools/database";

describe("Client", () => {
  let client: DatabaseClient;

  beforeEach(() => {
    client = new DatabaseClient();
  });

  test("getAll returns all set values", () => {
    client.set("key1", "value1");
    client.set("key2", "value2");

    const allData = client.list();

    expect(Object.keys(allData.data).length).toBe(2);
    expect(allData["key1"].data).toBe("value1");
    expect(allData["key2"].data).toBe("value2");
  });
});
