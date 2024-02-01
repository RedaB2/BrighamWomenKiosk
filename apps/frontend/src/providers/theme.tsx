import type { CustomFlowbiteTheme } from "flowbite-react";
import { Flowbite } from "flowbite-react";

// https://www.flowbite-react.com/docs/customize/theme
const customTheme: CustomFlowbiteTheme = {};

type ThemeProviderProps = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return <Flowbite theme={{ theme: customTheme }}>{children}</Flowbite>;
}
