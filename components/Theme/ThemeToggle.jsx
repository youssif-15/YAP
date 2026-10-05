"use client";

import {
    Moon,
    Sun
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({showLabel=false,floating=false}){
    const {theme,toggleTheme} = useTheme();
    const isDark = theme === "dark";
    const Icon = isDark ? Sun : Moon;
    const nextTheme = isDark ? "light" : "dark";
    const label = isDark ? "Light" : "Dark";

    return(
        <button
            type="button"
            className={`theme-toggle${floating ? " theme-toggle-floating" : ""}${showLabel ? " theme-toggle-labeled" : ""}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            aria-pressed={isDark}
            title={`Switch to ${nextTheme} mode`}
        >
            <Icon size={18}/>
            {showLabel && <span>{label}</span>}
        </button>
    );
}