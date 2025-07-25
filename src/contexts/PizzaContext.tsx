
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pizza, PizzaContextType } from '../types';
import { pizzaService } from '../services/api';

const PizzaContext = createContext<PizzaContextType | undefined>(undefined);

export const PizzaProvider = ({ children }: { children: ReactNode }) => {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPizzas = async () => {
    try {
      setIsLoading(true);
      const data = await pizzaService.getAll();
      setPizzas(data);
    } catch (error) {
      console.error('Error al cargar pizzas:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addPizza = async (pizza: Omit<Pizza, 'id'>) => {
    try {
      setIsLoading(true);
      const newPizza = await pizzaService.create(pizza);
      setPizzas(prev => [...prev, newPizza]);
    } catch (error) {
      console.error('Error al agregar pizza:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePizza = async (id: number, pizza: Partial<Pizza>) => {
    try {
      setIsLoading(true);
      const updatedPizza = await pizzaService.update(id, pizza);
      setPizzas(prev => 
        prev.map(p => p.id === id ? updatedPizza : p)
      );
    } catch (error) {
      console.error('Error al actualizar pizza:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePizza = async (id: number) => {
    try {
      setIsLoading(true);
      await pizzaService.delete(id);
      setPizzas(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error al eliminar pizza:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar pizzas al montar el componente
  useEffect(() => {
    loadPizzas().catch(console.error);
  }, []);

  return (
    <PizzaContext.Provider value={{
      pizzas,
      loadPizzas,
      addPizza,
      updatePizza,
      deletePizza,
      isLoading
    }}>
      {children}
    </PizzaContext.Provider>
  );
};

export const usePizza = () => {
  const context = useContext(PizzaContext);
  if (context === undefined) {
    throw new Error('usePizza must be used within a PizzaProvider');
  }
  return context;
};
