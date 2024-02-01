import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./sideBar.css";

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

const MenuBar = () => {
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

export { MenuBar };
