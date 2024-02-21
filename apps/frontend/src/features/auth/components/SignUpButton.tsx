import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "flowbite-react";

export const SignUpButton: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: location.pathname,
      },
      authorizationParams: {
        prompt: "login",
        screen_hint: "signup",
      },
    });
  };

  return (
    <Button className="signup" onClick={handleSignUp}>
      Sign Up
    </Button>
  );
};
