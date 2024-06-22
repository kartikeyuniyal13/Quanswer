"use client"
import React, { createContext, useContext, useState, useEffect } from "react"

interface ThemeContextType {
    mode: string;
    setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState('dark');

    useEffect(() => {
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    const handleThemeChange = () => {
        setMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ mode, setMode: handleThemeChange }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeContextProvider');
    }

    return context;
}
