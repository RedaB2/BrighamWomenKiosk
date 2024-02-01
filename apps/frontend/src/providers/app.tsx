import * as React from "react";
import { BrowserRouter as RouterProvider } from "react-router-dom";
import ThemeProvider from "./theme";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <ThemeProvider>
      <RouterProvider>{children}</RouterProvider>
    </ThemeProvider>
  );
};
