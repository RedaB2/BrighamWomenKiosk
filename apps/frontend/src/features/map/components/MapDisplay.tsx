import { useEffect, useRef, useState } from "react";

import { Lines } from "./Lines";

const MapDisplay = (props: { selectedFloor: string }) => {
  const elementRef = useRef<HTMLImageElement>(null);
  const [coords, setCoords] = useState<number[]>([]);

  useEffect(() => {
    const updateCoords = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        const top = rect.top;
        const left = rect.left;
        const bottom = rect.bottom;
        const right = rect.right;
        const width = rect.width;
        const height = rect.height;
        setCoords([left, right, top, bottom, width, height]);
      }
    };

    updateCoords(); // Initial calculation

    window.addEventListener("resize", updateCoords);

    return () => {
      window.removeEventListener("resize", updateCoords);
    };
  }, [props.selectedFloor]);

  return (
    <>
      <div style={{ position: "relative" }}>
        <img
          ref={elementRef}
          src={props.selectedFloor}
          alt={"Floor image"}
          width={"1000"}
          height={"auto"}
        />
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <Lines
            top={coords[2]}
            left={coords[0]}
            height={coords[5]}
            width={coords[4]}
            bottom={coords[3]}
            right={coords[1]}
            selectedFloor={props.selectedFloor}
          />
        </div>
      </div>
    </>
  );
};

export { MapDisplay };
