import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "flowbite-react";

export const LoginButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: location.pathname,
      },
    });
  };

  return (
    <Button className="login" onClick={handleLogin}>
      Log In
    </Button>
  );
};
