import React, { useEffect, useState } from "react";
import { Button, Label, Select, Textarea } from "flowbite-react";
import { FaPerson } from "react-icons/fa6";
import { CiLocationOn } from "react-icons/ci";
import {
  Nodes,
  Employees,
  RequestType,
  Urgency,
  RequestStatus,
} from "database";
import { Autocomplete } from "@/components";

const ServiceRequest = () => {
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
    fetchNodes();
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting");
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
  };

  return (
    <form
      className="mx-auto py-8 flex flex-col space-y-4 max-w-md"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold">Request Service Form</h1>
      <Autocomplete
        suggestions={roomSuggestions}
        setSuggestions={setRoomSuggestions}
        value={room}
        setValue={setRoom}
        id="room"
        htmlFor="room"
        label="Assign to room"
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
      <div className="space-y-2">
        <Label htmlFor="type">Service type</Label>
        <Select
          id="type"
          required
          value={type}
          onChange={(e) => setType(e.target.value as RequestType)}
        >
          <option value="JANI">Janitorial</option>
          <option value="MECH">Mechanical</option>
          <option value="MEDI">Medicinal</option>
          <option value="RELC">Patient relocation</option>
          <option value="CONS">Patient consultation</option>
          <option value="CUST">Other</option>
        </Select>
      </div>
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
