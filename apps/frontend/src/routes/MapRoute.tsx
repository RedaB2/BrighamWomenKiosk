import "./sideBar.css";
import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import groundFloor from "./MapImages/00_thegroundfloor.png";
import lowerLevel1 from "./MapImages/00_thelowerlevel1.png";
import lowerLevel2 from "./MapImages/00_thelowerlevel2.png";
import firstFloor from "./MapImages/01_thefirstfloor.png";
import secondFloor from "./MapImages/02_thesecondfloor.png";
import thirdFloor from "./MapImages/03_thethirdfloor.png";
import AutofillInput from "./AutofillInput.tsx";
import { useState } from "react";
//import "./MapStyles.css";

function openNav() {
  const name = document.getElementById("mySidebar");
  if (name != null) {
    name.style.width = "250px";
  }
}

function closeNav() {
  const name = document.getElementById("mySidebar");
  if (name != null) {
    name.style.width = "0px";
  }
}

const MapRoute = () => {
  const navigate = useNavigate();

  const handleSignIn = (e: FormEvent) => {
    e.preventDefault();
    navigate("/sign-in");
  };
  const handleMapPage = (e: FormEvent) => {
    e.preventDefault();
    navigate("/");
  };
  const handleCSV = (e: FormEvent) => {
    e.preventDefault();
    navigate("/csv-data");
  };
  const handleServiceRequests = (e: FormEvent) => {
    e.preventDefault();
    navigate("/service-request");
  };

  const [selectedFloor, setSelectedFloor] = useState("");

  return (
    <>
      <div id="mySidebar" className="sidebar">
        <a className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <a href="/sign-in">Sign In</a>
        <a href="/">Map</a>
        <a href="/csv-data">CSV Data</a>
        <a href="/service-request">Service Requests</a>
      </div>

      <button className="openbtn" onClick={openNav}>
        &#9776; Menu
      </button>

      <div>
        <AutofillInput></AutofillInput>
        <select
          name="mapFloors"
          id="mapFloors"
          onChange={(e) => setSelectedFloor(e.target.value)}
        >
          <option value={groundFloor}>Ground Floor</option>
          <option value={lowerLevel1}>Lower Level 1</option>
          <option value={lowerLevel2}>Lower Level 2</option>
          <option value={firstFloor}>First Floor</option>
          <option value={secondFloor}>Second Floor</option>
          <option value={thirdFloor}>Third Floor</option>
        </select>
      </div>
      <img
        src={selectedFloor}
        alt={"Floor image"}
        width={"1000"}
        height={"auto"}
      />

      <div>
        <button type="button" role="link" onClick={handleSignIn}>
          Sign In
        </button>
        <button type="button" role="link" onClick={handleMapPage}>
          Map
        </button>
        <button type="button" role="link" onClick={handleCSV}>
          CSV
        </button>
        <button type="button" role="link" onClick={handleServiceRequests}>
          Service Requests
        </button>
      </div>
    </>
  );
};
export default MapRoute;
