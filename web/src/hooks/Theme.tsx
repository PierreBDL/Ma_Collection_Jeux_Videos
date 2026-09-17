import {createContext, useContext, useState, type ReactNode} from 'react'

type themeType = 'light' | "dark"

interface themeValue {
    theme: themeType,
    ToggleTheme: () => void
}

const themeContext = createContext<themeValue | undefined>(undefined)

/* ---------------------
        Provider
----------------------*/

export function ThemeProvider ({children}: {children: ReactNode}) {
    const [theme, setTheme] = useState<themeType>('light')

    function ToggleTheme () {
        setTheme(theme === "light" ? "dark" : "light")
    }

    return (
        <themeContext.Provider value={{theme, ToggleTheme}}>
            {children}
        </themeContext.Provider>
    )
}

/* ---------------------
        UseTheme
----------------------*/


export function UseTheme () {
  const ctx = useContext(themeContext);
  if (!ctx) {
    throw new Error("Pas de provider pour le theme")
  }
  return ctx
}
