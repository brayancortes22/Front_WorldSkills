import { useState } from 'react';

export interface ErrorInfo {
  message: string;
  code?: string;
  timestamp: Date;
}

export const useErrorHandler = () => {
  const [error, setError] = useState<ErrorInfo | null>(null);

  const handleError = (error: unknown, context?: string) => {
    console.error(`Error${context ? ` en ${context}` : ''}:`, error);
    
    let message = 'Ha ocurrido un error inesperado';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    setError({
      message,
      timestamp: new Date(),
    });
  };

  const clearError = () => {
    setError(null);
  };

  return {
    error,
    handleError,
    clearError,
  };
};
