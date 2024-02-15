import { AppProvider } from "@/providers/app.tsx";
import { AppRoutes } from "@/routes";
import { Auth0Provider } from "@auth0/auth0-react";

const App = () => {
  return (
    <AppProvider>
      <Auth0Provider
         useRefreshTokens
         cacheLocation="localstorage"
         domain="dev-njtak837ng1u41nc.us.auth0.com"
         clientId="C2UCnUwHJvf1DIbyZHjMGqNyyo56oKS5"
         authorizationParams={{
            redirect_uri: window.location.origin,
         }}
        >
        <AppRoutes />
      </Auth0Provider>
    </AppProvider>
  );
};

export default App;
