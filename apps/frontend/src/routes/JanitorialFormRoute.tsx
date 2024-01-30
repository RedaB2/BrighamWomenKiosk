import React, { ChangeEvent, useState } from "react";
import "./JanitorialFormStyles.css";
import { useNavigate } from "react-router-dom";

function JanitorialRequestForm() {
  const [nameInput, setNameInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  const navigate = useNavigate();

  function submit() {
    if (nameInput !== "" && commentInput !== "") {
      const [name] = nameInput;
      const [comment] = commentInput;
      console.log(name);
      console.log(comment);
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

  return (
    <form onSubmit={submit} className={"submit"}>
      <h1>Janitorial Request Form</h1>
      <div className={"janitorialForm"}>
        <div className={"input"}>
          <p>Name:</p>
          <input onChange={handleNameInput} value={nameInput} />
          <p>Additional Information:</p>
          <textarea
            className={"comment"}
            onChange={handleCommentInput}
            value={commentInput}
          />
        </div>
        <div className={"button"}>
          <button onClick={submit}>Submit</button>
          <button onClick={clear}>Clear</button>
          <button onClick={back}>Back</button>
        </div>
      </div>
    </form>
  );
}

export default JanitorialRequestForm;
