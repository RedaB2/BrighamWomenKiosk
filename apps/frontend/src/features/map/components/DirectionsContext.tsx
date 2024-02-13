import { createContext, Dispatch, SetStateAction } from "react";

const DirectionsContext = createContext<{
  path: string[];
  setPath: Dispatch<string[]>;
}>({
  path: [],
  // eslint-disable-next-line no-empty-function
  setPath: () => {},
});

const StartContext = createContext<{
  startLocation: string;
  setStartLocation: Dispatch<SetStateAction<string>>;
}>({
  startLocation: "",
  // eslint-disable-next-line no-empty-function
  setStartLocation: () => {},
});

const EndContext = createContext<{
  endLocation: string;
  setEndLocation: Dispatch<SetStateAction<string>>;
}>({
  endLocation: "",
  // eslint-disable-next-line no-empty-function
  setEndLocation: () => {},
});

export { DirectionsContext, StartContext, EndContext };
