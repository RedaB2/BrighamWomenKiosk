import { useEffect } from "react";
import { LoginButton, LogoutButton, SignupButton } from "../components";
import { useAuth0 } from "@auth0/auth0-react";

const SignIn = () => {
  const {
    loginWithRedirect,
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
  } = useAuth0();

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
