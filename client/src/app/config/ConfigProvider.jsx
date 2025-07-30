import { useState, useEffect } from "react";
import { ConfigContext } from "./ConfigContext";

export const ConfigProvider = ({ children }) => {
    const currentYear = new Date().getFullYear();
    
    // Intentar obtener la configuración guardada
    let savedConfig;
    try {
        savedConfig = JSON.parse(localStorage.getItem("appConfig")) || {
            selectedYear: currentYear,
            theme: "light",
        };
    } catch (error) {
        savedConfig = {
            selectedYear: currentYear,
            theme: "light",
        };
    }
    const [selectedYear, setSelectedYear] = useState(savedConfig.selectedYear);
    const [theme, setTheme] = useState(savedConfig.theme);

    useEffect(() => {
        localStorage.setItem("appConfig", JSON.stringify({ selectedYear, theme }));
        document.body.className = theme;
    }, [selectedYear, theme]);

    return (
        <ConfigContext.Provider value={{ selectedYear, setSelectedYear, theme, setTheme }}>
            {children}
        </ConfigContext.Provider>
    );
};
