import React, { useEffect, useState } from "react";
import { Table } from "@/components";
import { FileInput, Label, Button } from "flowbite-react";
import { downloadCSV } from "../utils";

const MapData = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodesFile, setNodesFile] = useState("");
  const [edgesFile, setEdgesFile] = useState("");

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

  const handleSubmitNodes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/map/upload/nodes", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(res.statusText);
      setNodesFile("");
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSubmitEdges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/map/upload/edges", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(res.statusText);
      setNodesFile("");
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file. Please try again.");
    }
  };

  return (
    <>
      <div className="flex gap-8">
        <form
          action="/api/map/upload/nodes"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmitNodes}
        >
          <div className="mb-2 block">
            <Label htmlFor="csv-upload" value="Upload new Nodes Data:" />
          </div>
          <FileInput
            className="w-96"
            id="csv-upload"
            name="csv-upload"
            accept="text/csv"
            value={nodesFile}
            helperText="CSV files only."
            onChange={(e) => setNodesFile(e.target.value)}
          />
          <br />
          <Button type="submit">Upload File</Button>
        </form>
        <form
          action="/api/map/upload/edges"
          method="post"
          encType="multipart/form-data"
          onSubmit={handleSubmitEdges}
        >
          <div className="mb-2 block">
            <Label htmlFor="csv-upload" value="Upload new Edges Data:" />
          </div>
          <FileInput
            className="w-96"
            id="csv-upload"
            name="csv-upload"
            accept="text/csv"
            value={edgesFile}
            helperText="CSV files only."
            onChange={(e) => setEdgesFile(e.target.value)}
          />
          <br />
          <Button type="submit">Upload File</Button>
        </form>
      </div>

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

export { MapData };
