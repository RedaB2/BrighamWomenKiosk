import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropDown, Table } from "@/components";

const ServiceRequest = () => {
  const [serviceRequests, setServiceRequests] = useState([]);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setServiceRequests(data);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
      }
    };
    fetchServiceRequests();
  }, []);

  const [showRoomDropDown, setShowRoomDropDown] = useState<boolean>(false);
  const [showRequestDropDown, setShowRequestDropDown] =
    useState<boolean>(false);
  const [selectRoom, setSelectRoom] = useState<string>("");
  const rooms = () => {
    return ["Room 1", "Room 2", "Room 3"];
  };
  const [selectRequest, setSelectRequest] = useState<string>("");
  const requests = () => {
    return [
      "Janitorial",
      "Mechanical",
      "Medicine",
      "Consultation",
      "Patient Relocation",
    ];
  };
  const navigate = useNavigate();

  const toggleRoomDropDown = () => {
    setShowRoomDropDown(!showRoomDropDown);
  };

  const toggleRequestDropDown = () => {
    setShowRequestDropDown(!showRequestDropDown);
  };

  const dismissRoomHandler = (
    event: React.FocusEvent<HTMLButtonElement>
  ): void => {
    if (event.currentTarget === event.target) {
      setShowRoomDropDown(false);
    }
  };

  const dismissRequestHandler = (
    event: React.FocusEvent<HTMLButtonElement>
  ): void => {
    if (event.currentTarget === event.target) {
      setShowRequestDropDown(false);
    }
  };

  const roomSelection = (room: string): void => {
    setSelectRoom(room);
  };

  const requestSelection = (request: string): void => {
    setSelectRequest(request);
  };

  function submit() {
    if (selectRoom !== "" && selectRequest !== "") {
      const [room] = selectRoom;
      const [request] = selectRequest;
      console.log(room);
      console.log(request);
    }

    if (selectRequest == "Janitorial") {
      navigate("/services/janitorial");
    }
  }

  function back() {
    navigate("/");
  }

  return (
    <div className={"dropdown"}>
      <h1>Submit a Service Request</h1>
      <div>
        {selectRoom ? `You selected ${selectRoom}.` : "Select a Room..."}
      </div>
      <button
        className={showRoomDropDown ? "active" : undefined}
        onClick={(): void => toggleRoomDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissRoomHandler(e)
        }
      >
        <div>{"Rooms"}</div>
        {showRoomDropDown && (
          <DropDown
            objects={rooms()}
            showDropDown={false}
            toggleDropDown={(): void => toggleRoomDropDown()}
            objSelection={roomSelection}
          />
        )}
      </button>
      <div>
        {selectRequest
          ? `You selected a ${selectRequest} request.`
          : "Select a Request..."}
      </div>
      <button
        className={showRequestDropDown ? "active" : undefined}
        onClick={(): void => toggleRequestDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissRequestHandler(e)
        }
      >
        <div>{"Requests"}</div>
        {showRequestDropDown && (
          <DropDown
            objects={requests()}
            showDropDown={false}
            toggleDropDown={(): void => toggleRequestDropDown()}
            objSelection={requestSelection}
          />
        )}
      </button>
      <div>
        <button type="submit" onClick={submit}>
          Submit
        </button>
        <button onClick={back}>Back</button>
      </div>
      <Table data={serviceRequests} />
    </div>
  );
};

export { ServiceRequest };
