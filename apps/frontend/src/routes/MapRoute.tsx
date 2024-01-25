import imgUrl from "./MapImg.png";
import CSVDataDisplay from "./CSVData.tsx";

export default function MapRoute() {
  return (
    <>
      <div>
        <img src={imgUrl} alt="Map 1st Floor" width="500px" height="auto" />
      </div>
      <CSVDataDisplay></CSVDataDisplay>
    </>
  );
}
