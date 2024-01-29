import imgUrl from "./MapImg.png";
import "./menubar.css";

export default function MapRoute() {
  return (
    <>
      <div className="menubar">
        <a className="active" href="#home">
          Home
        </a>
        <a href="#map">Map</a>
        <a href="#csv">CSV</a>
        <a href="#serviceRequest">Service Request</a>
      </div>
      <div>
        <img src={imgUrl} alt="Map 1st Floor" width="500px" height="auto" />
      </div>
      <div>
        <button>Home</button>
        <button>Map</button>
        <button>CSV</button>
        <button>Service Requests</button>
      </div>
    </>
  );
}
