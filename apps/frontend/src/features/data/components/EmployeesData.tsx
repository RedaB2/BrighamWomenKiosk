import React, { useEffect, useState } from "react";
import { Table } from "@/components";
import { FileInput, Label, Button } from "flowbite-react";
import { downloadCSV } from "../utils";

const EmployeesData = () => {
  const [employees, setEmployees] = useState([]);
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/employees/upload", {
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
        action="/api/employees/upload"
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
        <Button onClick={() => downloadCSV("/api/employees/download")}>
          Download Employees CSV
        </Button>
      </div>

      <div className="flex">
        <Table data={employees} />
      </div>
    </>
  );
};

export { EmployeesData };
