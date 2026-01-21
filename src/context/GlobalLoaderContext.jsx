'use client';
import { createContext, useState, useContext, useMemo } from 'react';

const GlobalLoaderContext = createContext(undefined);

export const GlobalLoaderProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const value = useMemo(() => ({ isLoading, setIsLoading }), [isLoading]);

    return (
        <GlobalLoaderContext.Provider value={value}>
            {children}
        </GlobalLoaderContext.Provider>
    );
};

export const useGlobalLoader = () => {
    const context = useContext(GlobalLoaderContext);
    if (context === undefined) {
        throw new Error('useGlobalLoader must be used within a GlobalLoaderProvider');
    }
    return context;
};