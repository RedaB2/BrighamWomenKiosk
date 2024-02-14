import groundFloor from "./assets/00_thegroundfloor.png";
import lowerLevel1 from "./assets/00_thelowerlevel1.png";
import lowerLevel2 from "./assets/00_thelowerlevel2.png";
import firstFloor from "./assets/01_thefirstfloor.png";
import secondFloor from "./assets/02_thesecondfloor.png";
import thirdFloor from "./assets/03_thethirdfloor.png";

const floorToAsset = (floor: "L2" | "L1" | "G" | "1" | "2" | "3") => {
  switch (floor) {
    case "L2":
      return lowerLevel2;
    case "L1":
      return lowerLevel1;
    case "G":
      return groundFloor;
    case "1":
      return firstFloor;
    case "2":
      return secondFloor;
    case "3":
      return thirdFloor;
  }
};

const assetToFloor = (asset: string) => {
  switch (asset) {
    case lowerLevel2:
      return "L2";
    case lowerLevel1:
      return "L1";
    case groundFloor:
      return "G";
    case firstFloor:
      return "1";
    case secondFloor:
      return "2";
    case thirdFloor:
      return "3";
    default:
      return "1";
  }
};

export { floorToAsset, assetToFloor };
