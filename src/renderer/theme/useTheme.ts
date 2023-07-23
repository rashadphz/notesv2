import { useContext, useEffect } from "react";
import { DataTheme, ThemeContext } from "./ThemeContext";

export const useTheme = (value?: DataTheme) => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    console.log("useeffected");
    if (value && theme !== value) {
      setTheme(value);
      console.log(`Theme changed to ${value}`);
    }
  }, [value]);

  return { theme, setTheme };
};
