import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username != "admin" || password != "admin") {
      alert("Wrong Password or Account");
      return;
    }
    console.log(username);
    console.log(password);
    navigate("/");
  };

  const handleResetPassword = (e: FormEvent) => {
    e.preventDefault();
    navigate("/auth/reset-password");
  };

  const handleSignUp = (e: FormEvent) => {
    e.preventDefault();
    navigate("/auth/sign-up");
  };

  return (
    <form onSubmit={handleSubmit} className={"centeredElement"}>
      <h1>Sign In</h1>
      <div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
      <br />
      <button type="button" role="link" onClick={handleResetPassword}>
        Reset Password
      </button>
      <br />
      <button type="button" role="link" onClick={handleSignUp}>
        Create an Account
      </button>
    </form>
  );
};

export { SignIn };
