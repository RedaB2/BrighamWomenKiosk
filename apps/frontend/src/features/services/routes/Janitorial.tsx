import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropDown } from "@/components";
import { Button } from "flowbite-react";

const Janitorial = () => {
  const [nameInput, setNameInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<string>("");
  const [commentInput, setCommentInput] = useState("");

  const [showPriorityDropDown, setShowPriorityDropDown] =
    useState<boolean>(false);
  const priorities = () => {
    return ["LOWU", "MEDI", "HIGH"];
  };

  const navigate = useNavigate();

  function clear() {
    setNameInput("");
    setCommentInput("");
  }

  function back() {
    navigate("/services");
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNameInput(e.target.value);
  }

  function handleCommentInput(e: ChangeEvent<HTMLTextAreaElement>) {
    setCommentInput(e.target.value);
  }

  const togglePriorityDropDown = () => {
    setShowPriorityDropDown(!showPriorityDropDown);
  };

  const dismissPriorityHandler = (
    e: React.FocusEvent<HTMLButtonElement>
  ): void => {
    if (e.currentTarget === e.target) {
      setShowPriorityDropDown(false);
    }
  };

  const prioritySelection = (priority: string): void => {
    setPriorityInput(priority);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Fix this form
    const data = {
      type: "JANI",
      urgency: priorityInput,
      notes: commentInput,
      nodeID: "CCONF001L1",
    };
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error(res.statusText);
      navigate("/services");
    } catch (error) {
      console.error("Failed to submit janitorial request:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Janitorial Request Form</h1>
      <div className={"janitorialForm"}>
        <div>
          <p>Name:</p>
          <input onChange={handleNameInput} value={nameInput} />
          <div>
            {priorityInput
              ? `You selected a ${priorityInput} priority.`
              : "Select a Priority..."}
          </div>
          <Button
            type={"button"}
            className={showPriorityDropDown ? "active" : undefined}
            onClick={(): void => togglePriorityDropDown()}
            onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
              dismissPriorityHandler(e)
            }
          >
            <div>{"Priorities"}</div>
            {showPriorityDropDown && (
              <DropDown
                objects={priorities()}
                showDropDown={false}
                toggleDropDown={(): void => togglePriorityDropDown()}
                objSelection={prioritySelection}
              />
            )}
          </Button>
          <p>Additional Information:</p>
          <textarea
            className={"comment"}
            onChange={handleCommentInput}
            value={commentInput}
          />
        </div>
        <div>
          <Button type="submit">Submit</Button>
          <Button onClick={clear}>Clear</Button>
          <Button onClick={back}>Back</Button>
        </div>
      </div>
    </form>
  );
};

export { Janitorial };
