import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== checkPassword) {
      alert("Passwords do not match!");
      return;
    }
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className={"centeredElement"}>
      <h1>Reset Password</h1>
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
          placeholder="New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          id="verify-password"
          name="verify-password"
          placeholder="Verify New Password"
          required
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
        />
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

export { ResetPassword };
