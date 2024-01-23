import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInStyles.css";

const SignInRoute = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    navigate("/");
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
    </form>
  );
};

export default SignInRoute;
