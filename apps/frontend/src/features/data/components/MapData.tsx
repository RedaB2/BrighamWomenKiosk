import React, { useEffect, useState } from "react";
import { DataTable, DataTableColumnHeader } from "@/components";
import { FileInput, Label, Button, Checkbox, Card } from "flowbite-react";
import { downloadCSV } from "../utils";
import { ColumnDef } from "@tanstack/react-table";
import { Edges, Nodes } from "database";

const MapData = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodesFile, setNodesFile] = useState("");
  const [edgesFile, setEdgesFile] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

  const handleSubmitAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file${index + 1}`, file);
    });

    try {
      const res = await fetch("api/map/upload/all", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(res.statusText);
      setSelectedFiles([]);
      alert("Files uploaded successfully!");
    } catch (error) {
      alert("Failed to upload files. Please try again.");
    }
  };

  return (
    <>
      <div className="px-16 py-8">
        <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <div className="flex gap-8">
            <div className="space-y-4">
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
                  className="w-50%"
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
              <Button onClick={() => downloadCSV("/api/map/download/nodes")}>
                Download Nodes CSV
              </Button>
            </div>
            <div className="space-y-4">
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
                  className="w-50%"
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
              <Button onClick={() => downloadCSV("/api/map/download/edges")}>
                Download Edges CSV
              </Button>
            </div>
            <div className="space-y-4">
              <form
                action="/api/map/upload/edges"
                method="post"
                encType="multipart/form-data"
                onSubmit={handleSubmitAll}
              >
                <div className="mb-2 block">
                  <Label
                    htmlFor="csv-upload"
                    value="Upload new Nodes/Edges/Employee Data:"
                  />
                </div>
                <FileInput
                  className="w-50%"
                  id="csv-upload"
                  name="csv-upload"
                  accept="text/csv"
                  multiple
                  helperText="CSV files only."
                  onChange={(e) => {
                    if (!e.target.files) {
                      return;
                    }
                    const files = Array.from(e.target.files) as File[];
                    setSelectedFiles(files);
                  }}
                />
                <br />
                <Button type="submit">Upload Files</Button>
              </form>
              <Button onClick={() => downloadCSV("/api/map/download/all")}>
                Download All
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col space-y-16 px-16 py-8">
        <DataTable
          columns={nodesTableColumns}
          data={nodes}
          searchColumn="longName"
          columnNames={[
            "nodeID",
            "xcoord",
            "ycoord",
            "floor",
            "building",
            "nodeType",
            "longName",
            "shortName",
          ]}
        />
        <DataTable
          columns={edgesTableColumns}
          data={edges}
          searchColumn="edgeID"
          columnNames={["edgeID", "startNode", "endNode", "weight"]}
        />
      </div>
    </>
  );
};

const nodesTableColumns: ColumnDef<Nodes>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && undefined)
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          table.toggleAllPageRowsSelected(event.target.checked);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          row.toggleSelected(event.target.checked);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nodeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room ID" />
    ),
    cell: ({ row }) => row.getValue("nodeID"),
  },
  {
    accessorKey: "xcoord",
    accessorFn: (row) => row.xcoord?.toString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="X-Coordinate" />
    ),
    cell: ({ row }) => row.getValue("xcoord"),
  },
  {
    accessorKey: "ycoord",
    accessorFn: (row) => row.ycoord?.toString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Y-Coordinate" />
    ),
    cell: ({ row }) => row.getValue("ycoord"),
  },
  {
    accessorKey: "floor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Floor" />
    ),
    cell: ({ row }) => row.getValue("floor"),
  },
  {
    accessorKey: "building",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Building" />
    ),
    cell: ({ row }) => row.getValue("building"),
  },
  {
    accessorKey: "nodeType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => row.getValue("nodeType"),
  },
  {
    accessorKey: "longName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Long Name" />
    ),
    cell: ({ row }) => row.getValue("longName"),
  },
  {
    accessorKey: "shortName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Short Name" />
    ),
    cell: ({ row }) => row.getValue("shortName"),
  },
];

const edgesTableColumns: ColumnDef<Edges>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && undefined)
        }
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          table.toggleAllPageRowsSelected(event.target.checked);
        }}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          row.toggleSelected(event.target.checked);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "edgeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Edge ID" />
    ),
    cell: ({ row }) => row.getValue("edgeID"),
  },
  {
    accessorKey: "startNode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Room" />
    ),
    cell: ({ row }) => row.getValue("startNode"),
  },
  {
    accessorKey: "endNode",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Room" />
    ),
    cell: ({ row }) => row.getValue("endNode"),
  },
  {
    accessorKey: "weight",
    accessorFn: (row) => row.weight?.toString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Weight" />
    ),
    cell: ({ row }) => row.getValue("weight"),
  },
];

export { MapData };
