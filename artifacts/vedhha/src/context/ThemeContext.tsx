import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type VedhhaTheme = "genz" | "gentleman";

interface ThemeContextType {
  theme: VedhhaTheme;
  setTheme: (t: VedhhaTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "genz",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<VedhhaTheme>("genz");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "gentleman") {
      root.classList.add("gentleman");
      root.classList.remove("genz");
    } else {
      root.classList.add("genz");
      root.classList.remove("gentleman");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useVedhhaTheme() {
  return useContext(ThemeContext);
}
