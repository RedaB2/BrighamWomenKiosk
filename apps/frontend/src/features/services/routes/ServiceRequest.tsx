import React, { useEffect, useState } from "react";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { FaPerson, FaLocationDot } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import {
  Nodes,
  Employees,
  RequestType,
  Urgency,
  RequestStatus,
} from "database";
import { Autocomplete } from "@/components";
import { useLocation } from "react-router-dom";

const ServiceRequest = () => {
  const location = useLocation();

  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [roomSuggestions, setRoomSuggestions] = useState<string[]>([]);
  const [room, setRoom] = useState<string>("");

  const [employees, setEmployees] = useState<Employees[]>([]);
  const [employeeSuggestions, setEmployeeSuggestions] = useState<string[]>([]);
  const [employee, setEmployee] = useState<string>("");

  const [type, setType] = useState<RequestType>("JANI");
  const [urgency, setUrgency] = useState<Urgency>("LOW");
  const [status, setStatus] = useState<RequestStatus>("UNASSIGNED");
  const [notes, setNotes] = useState<string>();

  const [maintenanceType, setMaintenanceType] = useState<string>("");
  const [medicineName, setMedicineName] = useState<string>("");
  const [medicineDosage, setMedicineDosage] = useState<string>("");

  const [roomToSuggestions, setRoomToSuggestions] = useState<string[]>([]);
  const [roomTo, setRoomTo] = useState<string>("");

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
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/employees");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    const initializeRoom = () => {
      const initialRoomID = new URLSearchParams(location.state).get('roomID');
      if (initialRoomID && nodes.length > 0) {
        const initialRoom = nodes.find((node) => node.nodeID === initialRoomID);
        if (initialRoom) {
          setRoom(initialRoom.longName);
        }
      }
    };
    fetchNodes();
    fetchEmployees();
    initializeRoom();
  }, [location.state, nodes]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nodes.some((node) => node.longName === room)) {
      alert("Invalid room. Please select a room from the autocomplete.");
      return;
    }

    if (
      !employees.some((emp) => emp.firstName + " " + emp.lastName === employee)
    ) {
      alert(
        "Invalid employee. Please select an employee from the autocomplete."
      );
      return;
    }

    let selectedNodeID = undefined;

    if (type === "RELC" && roomTo !== "") {
      const selectedNode = nodes.find((node) => node.longName === roomTo);

      if (selectedNode) {
        selectedNodeID = selectedNode.nodeID;
      } else {
        alert("Invalid room. Please select a room from the autocomplete.");
        return;
      }
    }

    const nodeID = nodes
      .filter((node) => node.longName === room)
      .map((node) => node.nodeID)[0];

    const employeeID = employees
      .filter((emp) => emp.firstName + " " + emp.lastName === employee)
      .map((emp) => emp.id)[0];

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify({
          maintenanceType,
          medicineName,
          medicineDosage,
          roomTo: selectedNodeID,
          type,
          urgency,
          notes,
          completionStatus: status,
          nodeID,
          employeeID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      alert("Service request received");
      resetForm();
    } catch (error) {
      alert("Failed to submit service request. Please try again.");
    }
  };

  const resetForm = () => {
    setRoom("");
    setEmployee("");
    setType("JANI");
    setUrgency("LOW");
    setStatus("UNASSIGNED");
    setNotes("");
    setMaintenanceType("");
    setMedicineName("");
    setMedicineDosage("");
    setRoomTo("");
  };

  const resetFormChangeServiceType = () => {
    setRoom("");
    setEmployee("");
    setUrgency("LOW");
    setStatus("UNASSIGNED");
    setNotes("");
    setMaintenanceType("");
    setMedicineName("");
    setMedicineDosage("");
    setRoomTo("");
  };

  return (
    <form
      className="mx-auto py-8 flex flex-col space-y-4 max-w-md"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Request Service Form
      </h1>
      {type === "JANI" ? (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by Phil and Giovanni{" "}
        </p>
      ) : type === "MECH" ? (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by Abe and Miya{" "}
        </p>
      ) : type === "MEDI" ? (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by HIEN and Luke{" "}
        </p>
      ) : type === "RELC" ? (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by Felix and Daniel{" "}
        </p>
      ) : type === "CONS" ? (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by Oliver and Matt{" "}
        </p>
      ) : (
        <p className="text-md italic font-semibold text-gray-500 dark:text-gray-400">
          {" "}
          Request page created by Felix{" "}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="type">Service type</Label>
        <Select
          id="type"
          required
          value={type}
          onChange={(e) => {
            setType(e.target.value as RequestType);
            resetFormChangeServiceType();
          }}
        >
          <option value="JANI">Janitorial</option>
          <option value="MECH">Maintenance request</option>
          <option value="MEDI">Medicine delivery</option>
          <option value="RELC">Patient relocation</option>
          <option value="CONS">Patient consultation</option>
          <option value="CUST">Other</option>
        </Select>
      </div>

      <Autocomplete
        suggestions={roomSuggestions}
        setSuggestions={setRoomSuggestions}
        value={room}
        setValue={setRoom}
        id="room"
        htmlFor="room"
        label={type === "RELC" ? "From room" : "Assign to room"}
        placeholder="Nuclear Medicine Floor L1"
        required
        rightIcon={CiLocationOn}
        onChange={(e) => {
          setRoom(e.target.value);
          if (e.target.value.length > 0) {
            setRoomSuggestions(
              nodes
                .map((loc) => {
                  return loc.longName;
                })
                .filter((loc) =>
                  loc.toLowerCase().includes(e.target.value.toLowerCase())
                )
                .slice(0, 10)
            );
          } else {
            setRoomSuggestions([]);
          }
        }}
      />

      {type === "RELC" && (
        <Autocomplete
          suggestions={roomToSuggestions}
          setSuggestions={setRoomToSuggestions}
          value={roomTo}
          setValue={setRoomTo}
          id="room-to"
          htmlFor="room-to"
          label="To room"
          placeholder="Jen Center for Primary Care"
          required
          rightIcon={FaLocationDot}
          onChange={(e) => {
            setRoomTo(e.target.value);
            if (e.target.value.length > 0) {
              setRoomToSuggestions(
                nodes
                  .map((loc) => {
                    return loc.longName;
                  })
                  .filter((loc) =>
                    loc.toLowerCase().includes(e.target.value.toLowerCase())
                  )
                  .slice(0, 10)
              );
            } else {
              setRoomToSuggestions([]);
            }
          }}
        />
      )}

      {type === "MEDI" && (
        <div>
          <Label htmlFor="medicineName">
            Medicine to be delivered
            <TextInput
              type="text"
              name="medicineName"
              id="medicineName"
              placeholder="Ibuprofen"
              value={medicineName}
              onChange={(event) => {
                setMedicineName(event.target.value);
              }}
            />
          </Label>
          <br />
          <Label htmlFor="medicineDosage">
            Dosage
            <TextInput
              type="text"
              name="medicineDosage"
              id="medicineDosage"
              placeholder="0"
              value={medicineDosage}
              onChange={(event) => {
                setMedicineDosage(event.target.value);
              }}
            />
          </Label>
        </div>
      )}

      <Autocomplete
        suggestions={employeeSuggestions}
        setSuggestions={setEmployeeSuggestions}
        value={employee}
        setValue={setEmployee}
        id="employee"
        htmlFor="employee"
        label="Assign to employee"
        placeholder="John Doe"
        required
        rightIcon={FaPerson}
        onChange={(e) => {
          setEmployee(e.target.value);
          if (e.target.value.length > 0) {
            setEmployeeSuggestions(
              employees
                .map((emp) => emp.firstName + " " + emp.lastName)
                .filter((emp) =>
                  emp.toLowerCase().includes(e.target.value.toLowerCase())
                )
                .slice(0, 10)
            );
          } else {
            setEmployeeSuggestions([]);
          }
        }}
      />

      {type === "MECH" && (
        <div className="space-y-2">
          <Label htmlFor="maintenanceType">Maintenence Type</Label>
          <Select
            id="maintenanceType"
            required
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value as string)}
          >
            <option value="ELEC">Electrical</option>
            <option value="LOCK">Locksmith</option>
            <option value="PLUM">Plumbing</option>
            <option value="TECH">Technology</option>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="urgency">Urgency</Label>
        <Select
          id="urgency"
          required
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as Urgency)}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          id="status"
          required
          value={status}
          onChange={(e) => setStatus(e.target.value as RequestStatus)}
        >
          <option value="UNASSIGNED">Unassigned</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Additional notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export { ServiceRequest };
