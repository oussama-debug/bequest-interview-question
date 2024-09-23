import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>();
  const [dataId, setDataId] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(`${API_URL}/`);
    const result = await response.json();
    if (response.ok) {
      setData(JSON.stringify(result));
    } else {
      console.error("Failed to fetch data:", result);
    }
  };

  const updateData = async () => {
    const response = await fetch(`${API_URL}/`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (response.ok) {
      setDataId(result.dataId);
      await getData();
    } else {
      console.error("Failed to update data:", result);
    }
  };

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok && result.verified === true) {
      console.log("Integrity check ✅")
    } else {
      console.error('Data has been tampered with', result);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
