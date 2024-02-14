import { Edges, Nodes } from "database";
import { createContext, Dispatch, SetStateAction } from "react";

const MapContext = createContext<{
  nodes: Nodes[];
  setNodes: Dispatch<SetStateAction<Nodes[]>>;
  edges: Edges[];
  setEdges: Dispatch<SetStateAction<Edges[]>>;
  selectedFloor: string;
  setSelectedFloor: Dispatch<SetStateAction<string>>;
  algorithm: string;
  setAlgorithm: Dispatch<SetStateAction<string>>;
  path: string[];
  setPath: Dispatch<string[]>;
  startLocation: string;
  setStartLocation: Dispatch<SetStateAction<string>>;
  endLocation: string;
  setEndLocation: Dispatch<SetStateAction<string>>;
}>({
  nodes: [],
  // eslint-disable-next-line no-empty-function
  setNodes: () => {},
  edges: [],
  // eslint-disable-next-line no-empty-function
  setEdges: () => {},
  selectedFloor: "",
  // eslint-disable-next-line no-empty-function
  setSelectedFloor: () => {},
  algorithm: "",
  // eslint-disable-next-line no-empty-function
  setAlgorithm: () => {},
  path: [],
  // eslint-disable-next-line no-empty-function
  setPath: () => {},
  startLocation: "",
  // eslint-disable-next-line no-empty-function
  setStartLocation: () => {},
  endLocation: "",
  // eslint-disable-next-line no-empty-function
  setEndLocation: () => {},
});

export { MapContext };
