
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderContextType } from '../types';
import { pedidoService } from '../services/api';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await pedidoService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'fechaPedido'>) => {
    try {
      setIsLoading(true);
      const newOrder = await pedidoService.create(order);
      setOrders(prev => [...prev, newOrder]);
    } catch (error) {
      console.error('Error al agregar pedido:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: Order['estado']) => {
    try {
      setIsLoading(true);
      const updatedOrder = await pedidoService.updateStatus(orderId, status);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      setIsLoading(true);
      await pedidoService.delete(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar pedidos al montar el componente
  useEffect(() => {
    loadOrders().catch(console.error);
  }, []);

  return (
    <OrderContext.Provider value={{
      orders,
      loadOrders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
      isLoading
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
