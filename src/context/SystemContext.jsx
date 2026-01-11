import React, { createContext, useState, useContext, useCallback } from 'react';

const SystemContext = createContext();

export const useSystem = () => useContext(SystemContext);

export const SystemProvider = ({ children }) => {
    const [logs, setLogs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const addLog = useCallback((message) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    }, []);

    return (
        <SystemContext.Provider value={{ logs, addLog, isProcessing, setIsProcessing }}>
            {children}
        </SystemContext.Provider>
    );
};
