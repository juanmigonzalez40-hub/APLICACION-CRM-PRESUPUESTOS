import React, { createContext, useContext, useState } from 'react';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
    const [currentBudget, setCurrentBudget] = useState({
        cliente: null,
        partidas: [],
        estado: 'borrador',
        notas: ''
    });

    const addPartida = (partida) => {
        setCurrentBudget(prev => ({
            ...prev,
            partidas: [...prev.partidas, { ...partida, id: crypto.randomUUID() }]
        }));
    };

    const removePartida = (id) => {
        setCurrentBudget(prev => ({
            ...prev,
            partidas: prev.partidas.filter(p => p.id !== id)
        }));
    };

    const updateBudget = (updates) => {
        setCurrentBudget(prev => ({ ...prev, ...updates }));
    };

    return (
        <BudgetContext.Provider value={{ currentBudget, addPartida, removePartida, updateBudget }}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (!context) throw new Error('useBudget must be used within BudgetProvider');
    return context;
};
