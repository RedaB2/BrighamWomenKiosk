import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropDown } from "@/components";

const Janitorial = () => {
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [priorityInput, setPriorityInput] = useState<string>("");

  const [showPriorityDropDown, setShowPriorityDropDown] =
    useState<boolean>(false);
  const priorities = () => {
    return ["Low", "Medium", "High"];
  };

  const navigate = useNavigate();

  function submit() {
    if (nameInput !== "" && commentInput !== "") {
      const [name] = nameInput;
      const [comment] = commentInput;
      const [priority] = priorityInput;
      console.log(name);
      console.log(comment);
      console.log(priority);
    }
  }

  function clear() {
    setNameInput("");
    setCommentInput("");
  }

  function back() {
    navigate("/service-request");
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

  return (
    <form>
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
          <button
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
          </button>
          <p>Additional Information:</p>
          <textarea
            className={"comment"}
            onChange={handleCommentInput}
            value={commentInput}
          />
        </div>
        <div>
          <button onClick={submit}>Submit</button>
          <button onClick={clear}>Clear</button>
          <button onClick={back}>Back</button>
        </div>
      </div>
    </form>
  );
};

export { Janitorial };
