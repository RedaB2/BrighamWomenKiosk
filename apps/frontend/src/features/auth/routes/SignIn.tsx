import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Card } from "flowbite-react";
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
    <div className="mx-auto py-8 flex flex-col space-y-4 max-w-md">
      <Card className="shadow-[0_0px_25px_0px_rgba(45,105,135,.5)]">
        <h1
          className="text-2xl font-bold"
          style={{ display: "flex", justifyContent: "center" }}
        >
          Sign In Page
        </h1>
      </Card>
      <ProfileContext />
      <LoginButton />
      <SignUpButton />
    </div>
  );
};

export { SignIn };
