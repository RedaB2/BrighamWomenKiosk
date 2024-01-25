import imgUrl from "./MapImg.jpg";
import CSVDataDisplay from "./CSVData.tsx";

export default function MapRoute() {
  return (
    <>
      <div>
        <img src={imgUrl} alt="Map 2nd Floor" />
      </div>
      <CSVDataDisplay></CSVDataDisplay>
    </>
  );
}
