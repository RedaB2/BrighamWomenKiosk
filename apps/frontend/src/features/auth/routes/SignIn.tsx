import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton, SignUpButton, ProfileContext } from "../components";

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

  if (!isAuthenticated && isLoading) {
    return;
  }

  return (
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md dark:text-white">
      <h1
        className="text-2xl font-bold"
        style={{ display: "flex", justifyContent: "center" }}
      >
        Sign In Page
      </h1>
      <ProfileContext />
      <LoginButton />
      <SignUpButton />
    </div>
  );
};

export { SignIn };
