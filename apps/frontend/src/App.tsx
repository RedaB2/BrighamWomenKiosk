import { AppProvider } from "@/providers/app.tsx";
import { AppRoutes } from "@/routes";

const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
