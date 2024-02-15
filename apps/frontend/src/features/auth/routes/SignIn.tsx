import React, { useEffect } from "react";
import { LoginButton } from "@/features/auth/components/LoginButton.tsx";
import { LogoutButton } from "@/features/auth/components/LogoutButton.tsx";
import { SignupButton } from "@/features/auth/components/SignupButton.tsx";
import { useAuth0 } from "@auth0/auth0-react";
/*import { Label } from "flowbite-react";*/

const SignIn = () => {
  const { loginWithRedirect } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const checkToken = async () => {
      try {
        await getAccessTokenSilently();
      } catch (error) {
        await loginWithRedirect({
          appState: {
            returnTo: location.pathname,
          },
        });
      }
    };

    if (!isLoading && isAuthenticated) {
      checkToken();
    }
  }, [getAccessTokenSilently, isAuthenticated, isLoading, loginWithRedirect]);

  return (
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Sign In Page</h1>
        {!isAuthenticated && <LoginButton />}
        {!isAuthenticated && <SignupButton />}
        {isAuthenticated && <LogoutButton />}
    </div>
  );
};

export { SignIn };
