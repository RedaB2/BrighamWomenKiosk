import React, { createContext, useContext, useEffect, useState } from "react";
import { DataTable, DataTableColumnHeader } from "@/components";
import {
  FileInput,
  Label,
  Button,
  Select,
  Checkbox,
  Card,
} from "flowbite-react";
import { downloadCSV } from "../utils";
import { Employees, RequestStatus, Requests } from "database";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { PieChart, DonutChart, StackedHorizontalBarChart } from "@/components";

const typeLabelsMap: Record<Requests["type"], string> = {
  JANI: "Janitorial",
  MECH: "Mechanical Maintenance",
  MEDI: "Medicine Delivery",
  RELC: "Patient Relocation",
  CONS: "Patient Consultation",
  CUST: "Other",
};

const completionStatusLabelsMap: Record<Requests["completionStatus"], string> =
  {
    UNASSIGNED: "Unassigned",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };

const ServicesWithEmployeesContext = createContext<{
  servicesWithEmployees: (Requests & {
    employee: Employees | null;
  })[];
  setServicesWithEmployees: React.Dispatch<
    React.SetStateAction<
      (Requests & {
        employee: Employees | null;
      })[]
    >
  >;
}>({
  servicesWithEmployees: [],
  // eslint-disable-next-line no-empty-function
  setServicesWithEmployees: () => {},
});

const ServicesData = () => {
  const navigate = useNavigate();

  const [servicesWithEmployees, setServicesWithEmployees] = useState<
    (Requests & {
      employee: Employees | null;
    })[]
  >([]);
  const [file, setFile] = useState("");
  const [selectedEmployeeType, setSelectedEmployeeType] = useState<
    Employees["role"] | ""
  >("");
  const [seriesPie, setSeriesPie] = useState<number[]>([]);

  // Data for PieChart
  const requestTypesMap = servicesWithEmployees.reduce((map, service) => {
    const type = service.type;
    const userFriendlyLabel = typeLabelsMap[type];
    map[userFriendlyLabel] = (map[userFriendlyLabel] || 0) + 1;
    return map;
  }, {} as Record<string, number>);
  const labelsPie = Object.keys(requestTypesMap);

  useEffect(() => {
    const fetchServicesWithEmployees = async () => {
      try {
        const res = await fetch("/api/services/with-employee");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setServicesWithEmployees(data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServicesWithEmployees();
  }, []);

  useEffect(() => {
    // filter seriesPie based on selectedEmployeeType
    const filteredServices = selectedEmployeeType
      ? servicesWithEmployees.filter(
          (service) => service.employee?.role === selectedEmployeeType
        )
      : servicesWithEmployees;
    const requestTypesMap = filteredServices.reduce((map, service) => {
      const type = service.type;
      const userFriendlyLabel = typeLabelsMap[type];
      map[userFriendlyLabel] = (map[userFriendlyLabel] || 0) + 1;
      return map;
    }, {} as Record<string, number>);
    const seriesPie = Object.values(requestTypesMap);
    setSeriesPie(seriesPie);
  }, [servicesWithEmployees, selectedEmployeeType]);

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

  // Data for DonutChart
  const completionStatusMap = servicesWithEmployees.reduce((map, service) => {
    const status = service.completionStatus;
    const userFriendlyLabel = completionStatusLabelsMap[status];
    map[userFriendlyLabel] = (map[userFriendlyLabel] || 0) + 1;
    return map;
  }, {} as Record<string, number>);

  const seriesDonut = Object.values(completionStatusMap).map((count) =>
    Number(((count / servicesWithEmployees.length) * 100).toFixed(2))
  );
  const labelsDonut = Object.keys(completionStatusMap);

  // Data for StackedHorizontalBarChart
  // Calculate labelsBar
  const types = Array.from(
    new Set(servicesWithEmployees.map((request) => request.type))
  );
  const typesBar = types.map((type) => typeLabelsMap[type]);
  const statuses = Object.keys(completionStatusLabelsMap);
  const getStatusCountsForType = (
    status: string,
    type: string,
    data: Requests[]
  ): number => {
    // Filter data based on the provided status and type
    const filteredData = data.filter(
      (service) => service.completionStatus === status && service.type === type
    );
    // Return the count of filtered data
    return filteredData.length;
  };

  // Calculate seriesBar
  const seriesBar = statuses.map((status) => {
    const dataForStatus: number[] = types.map((type) =>
      getStatusCountsForType(status, type, servicesWithEmployees)
    );
    return {
      name: status,
      data: dataForStatus,
    };
  });

  return (
    <>
      <div className="px-16 py-8">
        <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <div className="flex space-x-8">
            <div>
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
                  className="w-50%"
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
                <Button
                  className="text-sm md:text-base" // Use responsive font size
                  onClick={() => downloadCSV("/api/services/download")}
                >
                  Download Service Requests CSV
                </Button>
              </div>
            </div>
            <div className="flex flex-col space-y-2 w-[500px]">
              <Label htmlFor="status" value="Filter by employee role:" />
              <Select
                id="status"
                sizing="sm"
                className="w-32"
                value={selectedEmployeeType}
                onChange={(e) => {
                  setSelectedEmployeeType(
                    e.target.value as Employees["role"] | ""
                  );
                }}
              >
                <option value={""}>All</option>
                <option value="REGULAR">Regular</option>
                <option value="ADMIN">Admin</option>
              </Select>
              <div className="w-full flex-1">
                <PieChart
                  title="Requests statistics"
                  series={seriesPie}
                  labels={labelsPie}
                />
              </div>
            </div>
            <DonutChart series={seriesDonut} labels={labelsDonut} />
          </div>
          <div className="px-16 py-8">
            <StackedHorizontalBarChart data={seriesBar} categories={typesBar} />
          </div>
        </Card>
      </div>

      <div className="flex flex-col px-16 py-8">
        <ServicesWithEmployeesContext.Provider
          value={{
            servicesWithEmployees,
            setServicesWithEmployees,
          }}
        >
          <DataTable
            columns={requestsTableColumns}
            data={servicesWithEmployees}
            searchColumn="employee"
            onAddRow={() => navigate("/services")}
          />
        </ServicesWithEmployeesContext.Provider>
      </div>
    </>
  );
};

const requestsTableColumns: ColumnDef<
  Requests & { employee: Employees | null }
>[] = [
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "nodeID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room ID" />
    ),
    cell: ({ row }) => row.getValue("nodeID"),
  },
  {
    accessorKey: "employeeID",
    accessorFn: (row) => row.employeeID?.toString(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee ID" />
    ),
    cell: ({ row }) => row.getValue("employeeID"),
  },
  {
    accessorKey: "employee",
    accessorFn: (row) =>
      row.employee?.firstName + " " + row.employee?.lastName || "Unassigned",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Employee Name" />
    ),
    cell: ({ row }) => row.getValue("employee"),
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Urgency" />
    ),
    cell: ({ row }) => row.getValue("urgency"),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => row.getValue("type"),
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
    cell: ({ row }) => row.getValue("notes"),
  },
  {
    accessorKey: "medicineName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medicine Name" />
    ),
    cell: ({ row }) => row.getValue("medicineName"),
  },
  {
    accessorKey: "medicineDosage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medicine Dosage" />
    ),
    cell: ({ row }) => row.getValue("medicineDosage"),
  },
  {
    accessorKey: "maintenanceType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Maintenance Type" />
    ),
    cell: ({ row }) => row.getValue("maintenanceType"),
  },
  {
    accessorKey: "roomTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Room To" />
    ),
    cell: ({ row }) => row.getValue("roomTo"),
  },
  {
    accessorKey: "hazardousWaste",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hazardous Waste" />
    ),
    // undefind -> not show anything, true -> Yes, false -> No
    cell: ({ row }) =>
      row.getValue("hazardousWaste") === null
        ? row.getValue("hazardousWaste")
        : row.getValue("hazardousWaste")
        ? "Yes"
        : "No",
  },
  {
    accessorKey: "department",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Department" />
    ),
    cell: ({ row }) => row.getValue("department"),
  },
  {
    accessorKey: "completionStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Completion Status" />
    ),
    cell: ({ row }) => row.getValue("completionStatus"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <ServicesActions row={row} />;
    },
  },
];

type ServicesActionsProps = {
  row: Row<Requests>;
};

const ServicesActions = ({ row }: ServicesActionsProps) => {
  const {
    servicesWithEmployees: services,
    setServicesWithEmployees: setServices,
  } = useContext(ServicesWithEmployeesContext);

  const changeCompletionStatus = async (
    id: number,
    newStatus: RequestStatus
  ) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completionStatus: newStatus }),
      });
      if (!res.ok) throw new Error(res.statusText);
      const updatedServices = services.map((service) =>
        service.id === id
          ? { ...service, completionStatus: newStatus }
          : service
      );
      setServices(updatedServices);
    } catch (error) {
      alert("Failed to update completion status. Please try again.");
    }
  };

  return (
    <Select
      id="status"
      sizing="sm"
      required
      className="w-32"
      key={row.original.id}
      defaultValue={row.original.completionStatus}
      onChange={(e) =>
        changeCompletionStatus(row.original.id, e.target.value as RequestStatus)
      }
    >
      <option value="UNASSIGNED">Unassigned</option>
      <option value="ASSIGNED">Assigned</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
    </Select>
  );
};

export { ServicesData };
