"use client";

import {
    createContext,
    useContext,
    useState
} from "react";

const ThemeContext = createContext(null);

export function useTheme(){
    const context = useContext(ThemeContext);

    if(!context){
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}

export default function ThemeProvider({initialTheme="light",children}){
    const [theme,setTheme] = useState(
        initialTheme === "dark" ? "dark" : "light"
    );

    function setColorTheme(nextTheme){
        document.documentElement.dataset.theme = nextTheme;

        const secure = window.location.protocol === "https:" ? "; Secure" : "";

        document.cookie =
            `theme=${nextTheme}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;

        setTheme(nextTheme);

        window.dispatchEvent(
            new CustomEvent("theme-change",{detail:nextTheme})
        );
    }

    function toggleTheme(){
        setColorTheme(theme === "dark" ? "light" : "dark");
    }

    return(
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}