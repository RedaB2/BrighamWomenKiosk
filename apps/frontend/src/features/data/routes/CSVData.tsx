import React, { useEffect, useState } from "react";
import { Table } from "@/components";
import { FileInput, Label, Button } from "flowbite-react";
import downloadCSV from "./downloadCSV.ts";

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

      <br/>
      
      <div>
        <Button className="my-8" onClick={() => downloadCSV("/api/download/nodes")}>
          Download Nodes CSV
        </Button>
        <br />
        <Button className="my-8" onClick={() => downloadCSV("/api/download/edges")}>
          Download Edges CSV
        </Button>
      </div>

      {/*<Button className="my-8">Download CSV Data</Button>*/}
      <div className="flex">
        <Table data={nodes} />
        <div className="w-32" />
        <Table data={edges} />
      </div>
    </>
  );
};

export { CSVData };
