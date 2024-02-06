import { createContext, Dispatch } from "react";

const DirectionsContext = createContext<{
  path: string[];
  setPath: Dispatch<string[]>;
}>({
  path: [],
  // eslint-disable-next-line no-empty-function
  setPath: () => {},
});

export { DirectionsContext };
