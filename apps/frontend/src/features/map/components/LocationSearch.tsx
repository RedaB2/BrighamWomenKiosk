import React, { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import { Nodes } from "database";

const LocationSearch = () => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");
  const [directions, setDirections] = useState<string[]>([]);
  const newDirections = directions
    .slice(0, directions.length - 1)
    .map((ID) => nodes.filter((node) => node["nodeID"] === ID));

  const locations: { nodeID: string; longName: string }[] = nodes.map(
    (node) => {
      return { nodeID: node.nodeID, longName: node.longName };
    },
  );

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await fetch("/api/map/nodes");
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setNodes(data);
      } catch (error) {
        console.error("Failed to fetch nodes:", error);
      }
    };
    fetchNodes();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const startNodeId = nodes
      .filter((node) => node["longName"] === startLocation)
      .map((node) => node.nodeID)[0];
    const endNodeId = nodes
      .filter((node) => node["longName"] === endLocation)
      .map((node) => node.nodeID)[0];
    try {
      const res = await fetch("/api/map/pathfinding", {
        method: "POST",
        body: JSON.stringify({
          startNodeId,
          endNodeId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      setDirections((await res.json()).path);
      console.log(newDirections);
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  return (
    <>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <Label
            id="startLocation"
            htmlFor="startLocation"
            value="Enter starting point"
          />
          <TextInput
            id="startLocation"
            type="text"
            placeholder="Medical Records Conference Room Floor L1"
            required
            rightIcon={CiSearch}
            value={startLocation}
            onChange={(e) => {
              setStartLocation(e.target.value);
              if (e.target.value.length > 0) {
                setStartSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    ),
                );
              } else {
                setStartSuggestions([]);
              }
            }}
          />
          {startSuggestions.length > 0 && (
            <div className="absolute bg-white w-full border z-10 rounded-md shadow-lg">
              {startSuggestions.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setStartLocation(s);
                    setStartSuggestions([]);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  {startSuggestions}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <Label htmlFor="endLocation" value="Enter destination" />
          <TextInput
            id="endLocation"
            type="text"
            placeholder="Nuclear Medicine Floor L1"
            required
            rightIcon={CiSearch}
            value={endLocation}
            onChange={(e) => {
              setEndLocation(e.target.value);
              if (e.target.value.length > 0) {
                setEndSuggestions(
                  locations
                    .map((loc) => loc.longName)
                    .filter((loc) =>
                      loc.toLowerCase().includes(e.target.value.toLowerCase()),
                    ),
                );
              } else {
                setEndSuggestions([]);
              }
            }}
          />
          {endSuggestions.length > 0 && (
            <div className="absolute bg-white w-full border  z-10 rounded-md shadow-lg overflow-hidden">
              {endSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={() => {
                    setEndLocation(suggestion);
                    setEndSuggestions([]);
                  }}
                  className="px-4 py-2 cursor-pointer"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <table>
        <tbody style={{ fontSize: "12px" }}>
          {newDirections.map((row, i) => (
            <tr key={i}>
              <td>{row[0].longName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export { LocationSearch };
