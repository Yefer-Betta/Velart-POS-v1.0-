import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [dark, setDark] = useState(() => {
        return localStorage.getItem('velart_theme') === 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('velart_theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('velart_theme', 'light');
        }
    }, [dark]);

    return (
        <ThemeContext.Provider value={{ dark, toggleDark: () => setDark(d => !d) }}>
            {children}
        </ThemeContext.Provider>
    );
};
