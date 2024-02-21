import React, { useEffect, useState, createContext, useContext } from "react";
import { DataTable, DataTableColumnHeader } from "@/components";
import {
  FileInput,
  Label,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Modal,
  TextInput,
  Select,
} from "flowbite-react";
import { downloadCSV } from "../utils";
import { Employees } from "database";
import { ColumnDef, Row } from "@tanstack/react-table";
import { MdMoreHoriz } from "react-icons/md";
import { LiaUserEditSolid } from "react-icons/lia";
import { CiTrash } from "react-icons/ci";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const EmployeeContext = createContext<{
  employees: Employees[];
  setEmployees: React.Dispatch<React.SetStateAction<Employees[]>>;
  // eslint-disable-next-line no-empty-function
}>({ employees: [], setEmployees: () => {} });

const EmployeesData = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    navigate("/auth/sign-in");
  }

  const [employees, setEmployees] = useState<Employees[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [file, setFile] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("REGULAR");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const handleAddEmployee = async () => {
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          role,
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setEmployees([...employees, data]);
    } catch (error) {
      alert("Failed to add employee. Please try again.");
    }
  };

  const onCloseModal = () => {
    setOpenCreateModal(false);
    setFirstName("");
    setLastName("");
    setRole("REGULAR");
    setUsername("");
    setPassword("");
  };

  const handleFormFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    switch (e.target.id) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "role":
        setRole(e.target.value);
        break;
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="px-16 py-8">
        <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
          <div className="px-16 space-y-4">
            <form
              action="/api/employees/upload"
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="mb-2 block">
                <Label htmlFor="csv-upload" value="Upload new CSV Data:" />
              </div>
              <div>
                <FileInput
                  className="w-96"
                  id="csv-upload"
                  name="csv-upload"
                  accept="text/csv"
                  value={file}
                  helperText="CSV files only."
                  onChange={(e) => setFile(e.target.value)}
                />
              </div>
              <br />
              <div>
                <Button type="submit">Upload File</Button>
              </div>
            </form>
            <Button onClick={() => downloadCSV("/api/employees/download")}>
              Download Employees CSV
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex flex-col px-16 py-8">
        <EmployeeContext.Provider value={{ employees, setEmployees }}>
          <DataTable
            data={employees}
            columns={employeesTableColumns}
            searchColumn="firstName"
            onAddRow={() => {
              setOpenCreateModal(true);
            }}
          />
          <Modal
            dismissible
            show={openCreateModal}
            size="md"
            onClose={onCloseModal}
            popup
          >
            <Modal.Header>
              <h4 className="mx-4 my-2">Add New Employee</h4>
            </Modal.Header>
            <Modal.Body>
              <form
                className="flex max-w-md flex-col gap-4"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  await handleAddEmployee();
                  onCloseModal();
                }}
              >
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="firstName" value="First name" />
                  </div>
                  <TextInput
                    id="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={handleFormFieldChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="lastName" value="Last name" />
                  </div>
                  <TextInput
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={handleFormFieldChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="role" value="Role" />
                  </div>
                  <Select
                    id="role"
                    required
                    value={role}
                    onChange={handleFormFieldChange}
                  >
                    <option value="REGULAR">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </Select>
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="username" value="Username" />
                  </div>
                  <TextInput
                    id="username"
                    type="text"
                    placeholder="johndoe1"
                    required
                    value={username}
                    onChange={handleFormFieldChange}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="password" value="Password" />
                  </div>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={handleFormFieldChange}
                  />
                </div>
                <Button type="submit">Submit</Button>
              </form>
            </Modal.Body>
          </Modal>
        </EmployeeContext.Provider>
      </div>
    </>
  );
};

const employeesTableColumns: ColumnDef<Employees>[] = [
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
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => row.getValue("firstName"),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => row.getValue("lastName"),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => row.getValue("role"),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Username" />
    ),
    cell: ({ row }) => row.getValue("username"),
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Password" />
    ),
    cell: ({ row }) => row.getValue("password"),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return <EmployeesActions row={row} />;
    },
  },
];

type EmployeesActionsProps = {
  row: Row<Employees>;
};

const EmployeesActions = ({ row }: EmployeesActionsProps) => {
  const { employees, setEmployees } = useContext(EmployeeContext);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [firstName, setFirstName] = useState<string>(row.getValue("firstName"));
  const [lastName, setLastName] = useState<string>(row.getValue("lastName"));
  const [role, setRole] = useState<string>(row.getValue("role"));
  const [username, setUsername] = useState<string>(row.getValue("username"));
  const [password, setPassword] = useState<string>(row.getValue("password"));

  const handleFormFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    switch (e.target.id) {
      case "firstName":
        setFirstName(e.target.value);
        break;
      case "lastName":
        setLastName(e.target.value);
        break;
      case "role":
        setRole(e.target.value);
        break;
      case "username":
        setUsername(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleEditEmployee = async (id: number) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          firstName,
          lastName,
          role,
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setEmployees(
        employees.map((employee) => (employee.id === id ? data : employee))
      );
    } catch (error) {
      alert("Failed to edit employee. Please try again.");
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(res.statusText);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      alert("Failed to delete employee. Please try again.");
    }
  };

  return (
    <>
      <Dropdown
        label="Actions"
        renderTrigger={() => (
          <Button outline pill size="xs">
            <MdMoreHoriz className="h-4 w-4" />
          </Button>
        )}
      >
        <Dropdown.Item
          icon={LiaUserEditSolid}
          onClick={() => setOpenEditModal(true)}
        >
          Edit employee information
        </Dropdown.Item>
        <Dropdown.Item icon={CiTrash} onClick={() => setOpenDeleteModal(true)}>
          Delete employee
        </Dropdown.Item>
      </Dropdown>
      <Modal
        dismissible
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-2 text-md font-semibold text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this employee?
            </h3>
            <h6 className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              All associated data (e.g. services, etc.) will be permanently
              deleted as well. This action cannot be undone.
            </h6>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={async () => {
                  await deleteEmployee(row.getValue("id"));
                  setOpenDeleteModal(false);
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        dismissible
        show={openEditModal}
        size="md"
        onClose={() => setOpenEditModal(false)}
        popup
      >
        <Modal.Header>
          <h4 className="mx-4 my-2">Add New Employee</h4>
        </Modal.Header>
        <Modal.Body>
          <form
            className="flex max-w-md flex-col gap-4"
            onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              await handleEditEmployee(row.getValue("id"));
              setOpenEditModal(false);
            }}
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="firstName" value="First name" />
              </div>
              <TextInput
                id="firstName"
                type="text"
                placeholder="John"
                required
                value={firstName}
                onChange={handleFormFieldChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="lastName" value="Last name" />
              </div>
              <TextInput
                id="lastName"
                type="text"
                placeholder="Doe"
                required
                value={lastName}
                onChange={handleFormFieldChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="role" value="Role" />
              </div>
              <Select
                id="role"
                required
                value={role}
                onChange={handleFormFieldChange}
              >
                <option value="REGULAR">Staff</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username" value="Username" />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="johndoe1"
                required
                value={username}
                onChange={handleFormFieldChange}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={handleFormFieldChange}
              />
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export { EmployeesData };
