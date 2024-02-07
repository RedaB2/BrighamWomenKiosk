import React, { useEffect, useState } from "react";
import { Table } from "@/components";
import { FileInput, Label, Button } from "flowbite-react";
import { downloadCSV } from "../utils";

const ServicesData = () => {
  const [services, setServices] = useState([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/services/upload", {
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
        action="/api/services/upload"
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
        <Button onClick={() => downloadCSV("/api/services/download")}>
          Download Service Requests CSV
        </Button>
      </div>

      <div className="flex">
        <Table data={services} />
      </div>
    </>
  );
};

export { ServicesData };
