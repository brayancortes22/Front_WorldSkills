
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario guardado al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('authToken');
        
        if (savedUser && savedToken) {
          // Validar el token con el servidor
          try {
            const validation = await authService.validateToken();
            if (validation.valid) {
              setUser(JSON.parse(savedUser));
            } else {
              // Token inválido, limpiar datos
              localStorage.removeItem('user');
              localStorage.removeItem('authToken');
            }
          } catch (error) {
            // Error al validar token, limpiar datos
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(username, password);
      
      if (response.success) {
        const userData: User = {
          id: response.usuarioId.toString(),
          username: response.nombreUsuario,
          role: response.rol.toLowerCase() as 'admin' | 'asistente' | 'pizzero',
        };
        
        setUser(userData);
        return true;
      } else {
        console.error('Error en login:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
