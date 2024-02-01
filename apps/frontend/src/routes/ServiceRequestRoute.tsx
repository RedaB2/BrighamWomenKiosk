import React, { useState, FormEvent } from "react";
import "./ServiceRequestStyles.css";
import { useNavigate } from "react-router-dom";
import DropDown from "./DropDown";
import MenuBar from "@/routes/MenuBar.tsx";

const ServiceRequestRoute = () => {
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

  const handleJanitorialForm = (e: FormEvent) => {
    e.preventDefault();
    navigate("/service-request/janitorial");
  };

  const toggleRoomDropDown = () => {
    setShowRoomDropDown(!showRoomDropDown);
  };

  const toggleRequestDropDown = () => {
    setShowRequestDropDown(!showRequestDropDown);
  };

  const dismissRoomHandler = (
    event: React.FocusEvent<HTMLButtonElement>,
  ): void => {
    if (event.currentTarget === event.target) {
      setShowRoomDropDown(false);
    }
  };

  const dismissRequestHandler = (
    event: React.FocusEvent<HTMLButtonElement>,
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

  return (
    <div className={"dropdown"}>
      <MenuBar></MenuBar>
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
        <button type="submit" onClick={handleJanitorialForm}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ServiceRequestRoute;
