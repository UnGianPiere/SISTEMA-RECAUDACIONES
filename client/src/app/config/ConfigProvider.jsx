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
        applyTheme(theme);
    }, [selectedYear, theme]);

    const applyTheme = (selectedTheme) => {
        const root = document.documentElement;
        
        // Remover clases de tema anteriores
        root.classList.remove('light', 'dark');
        
        // Aplicar el tema seleccionado
        root.classList.add(selectedTheme);
        
        // Aplicar clases al body también para compatibilidad
        document.body.className = selectedTheme;
    };

    return (
        <ConfigContext.Provider value={{ selectedYear, setSelectedYear, theme, setTheme }}>
            {children}
        </ConfigContext.Provider>
    );
};
