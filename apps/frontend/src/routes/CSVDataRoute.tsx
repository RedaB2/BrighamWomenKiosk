import { useEffect, useState } from "react";
import Table from "./Table";
import "./CSVData.css";
import MenuBar from "@/routes/MenuBar.tsx";

export default function CSVDataRoute() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("/api/map/nodes");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setNodes(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    const fetchEdges = async () => {
      try {
        const res = await fetch("/api/map/edges");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setEdges(data);
      } catch (error) {
        console.error("Failed to fetch edges:", error);
      }
    };
    fetchNodes();
    fetchEdges();
  }, []);

  return (
    <>
      <form
        action="/api/map/upload"
        method="post"
        encType="multipart/form-data"
      >
      <MenuBar></MenuBar>
        <label htmlFor="csv-upload">Upload new CSV Data:</label>
        <br />
        <input
          type="file"
          id="csv-upload"
          name="poster"
          accept="text/csv"
          value={file}
          onChange={(e) => setFile(e.target.value)}
        />
        <br />
        <button type="submit">Upload File</button>
      </form>

      <button>Download CSV Data</button>
      <Table data={nodes} />
      <Table data={edges} />
    </>
  );
}
