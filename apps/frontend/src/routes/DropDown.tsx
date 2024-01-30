import React, { useEffect, useState } from "react";
import "./DropDown.css";

type DropDownProps = {
  objects: string[];
  showDropDown: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  toggleDropDown: Function;
  // eslint-disable-next-line @typescript-eslint/ban-types
  objSelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
  objects,
  objSelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  const onClickHandler = (object: string): void => {
    objSelection(object);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  return (
    <div className={showDropDown ? "dropdown" : "dropdown active"}>
      {objects.map((object: string, index: number): JSX.Element => {
        return (
          <p
            key={index}
            onClick={(): void => {
              onClickHandler(object);
            }}
          >
            {object}
          </p>
        );
      })}
    </div>
  );
};

export default DropDown;
