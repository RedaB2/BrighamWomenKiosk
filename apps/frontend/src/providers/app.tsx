import * as React from "react";
import { BrowserRouter as RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import ThemeProvider from "./theme";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <RouterProvider>
        <Auth0Provider
          useRefreshTokens
          cacheLocation="localstorage"
          domain="dev-njtak837ng1u41nc.us.auth0.com"
          clientId="C2UCnUwHJvf1DIbyZHjMGqNyyo56oKS5"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          {children}
        </Auth0Provider>
      </RouterProvider>
    </ThemeProvider>
  );
};
