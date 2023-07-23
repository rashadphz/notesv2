import React from "react";

export type DataTheme = "light" | "dark";

export interface IComponentBaseProps {
  dataTheme?: DataTheme;
}

export interface IThemeContext {
  theme: DataTheme;
  setTheme: (theme: DataTheme) => void;
}

export const ThemeContext = React.createContext<IThemeContext>({
  theme: "light",
  setTheme: () => {},
});
