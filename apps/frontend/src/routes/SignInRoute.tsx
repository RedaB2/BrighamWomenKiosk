import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInRoute = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(username);
    console.log(password);
    navigate("/map");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="username"
        name="username"
        placeholder="Username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default SignInRoute;
