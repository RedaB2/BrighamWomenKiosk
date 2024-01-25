import React from "react";
import "./SignInStyles.css";

export default function ResetPasswordRoute() {
  return (
    <form className={"centeredElement"}>
      <h1> Reset Password </h1>
      <div>
        <input placeholder={"Username"} />
      </div>
      <div>
        <input placeholder={"New Password"} />
      </div>
      <div>
        <input placeholder={"Confirm Password"} />
      </div>
      <button>Confirm</button>
    </form>
  );
}
