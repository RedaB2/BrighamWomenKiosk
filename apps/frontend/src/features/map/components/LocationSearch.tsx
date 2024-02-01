import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { CiSearch } from "react-icons/ci";
import { Nodes } from "database";

const LocationSearch = () => {
  const [nodes, setNodes] = useState<Nodes[]>([]);
  const [startSuggestions, setStartSuggestions] = useState<string[]>([]);
  const [endSuggestions, setEndSuggestions] = useState<string[]>([]);
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");

  const locations: { nodeID: string; longName: string }[] = nodes.map(
    (node) => {
      return { nodeID: node.nodeID, longName: node.longName };
    }
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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/map/pathfinding", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(res.statusText);
      alert("Path found!");
    } catch (error) {
      alert("Failed to find path. Please try again.");
    }
  };

  return (
    <form
      action="/api/map/pathfinding"
      method="post"
      onSubmit={submitHandler}
      className="flex flex-col space-y-4"
    >
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
                    loc.toLowerCase().includes(e.target.value.toLowerCase())
                  )
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
                    loc.toLowerCase().includes(e.target.value.toLowerCase())
                  )
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
  );
};

export { LocationSearch };
