import React, { useEffect, useState } from "react";
import { Table } from "@/components";
import { FileInput, Label, Button } from "flowbite-react";
import axios from "axios";

/**
 * Triggers a download of a CSV file from a given endpoint.
 * @param endpoint The URL endpoint to fetch the CSV file from.
 */
async function downloadCSV(endpoint: string): Promise<void> {
  try {
    const response = await axios.get(endpoint, { responseType: "blob" });

    // Create a link element, use it to download the blob, and remove it
    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = endpoint.includes("nodes") ? "nodes.csv" : "edges.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
    a.remove();
  } catch (error) {
    console.error("Error downloading CSV:", error);
  }
}

const CSVData = () => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/map/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(res.statusText);
      setFile("");
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file. Please try again.");
    }
  };

  return (
    <>
      <form
        action="/api/map/upload"
        method="post"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="mb-2 block">
          <Label htmlFor="csv-upload" value="Upload new CSV Data:" />
        </div>
        <FileInput
          className="w-96"
          id="csv-upload"
          name="csv-upload"
          accept="text/csv"
          value={file}
          helperText="CSV files only."
          onChange={(e) => setFile(e.target.value)}
        />
        <br />
        <Button type="submit">Upload File</Button>
      </form>

      <div className="mt-4 flex space-x-4 w-96">
        <Button onClick={() => downloadCSV("/api/map/download/nodes")}>
          Download Nodes CSV
        </Button>
        <Button onClick={() => downloadCSV("/api/map/download/edges")}>
          Download Edges CSV
        </Button>
      </div>

      <div className="flex">
        <Table data={nodes} />
        <div className="w-32" />
        <Table data={edges} />
      </div>
    </>
  );
};

export { CSVData };
