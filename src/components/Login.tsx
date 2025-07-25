
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pizza, Lock, User, Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      if (!success) {
        setError('Credenciales incorrectas. Verifique su usuario y contraseña.');
      }
    } catch (error) {
      setError('Error de conexión. Verifique que el servidor esté funcionando.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pizza-orange/10 to-pizza-red/10 p-4">
      <Card className="w-full max-w-md pizza-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center">
            <Pizza className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">🍕 Pizzería Manager</CardTitle>
          <CardDescription>Inicia sesión para gestionar tu pizzería</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isFormDisabled}
                  placeholder="Ingrese su nombre de usuario"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  disabled={isFormDisabled}
                  placeholder="Ingrese su contraseña"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full pizza-gradient" 
              disabled={isFormDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          {/* Panel de información para desarrollo */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">
              Para pruebas, usa estos usuarios de ejemplo:
            </p>
            <div className="space-y-1 text-xs text-gray-500">
              <div>👨‍💼 Admin: admin / admin123</div>
              <div>👥 Asistente: asistente / asistente123</div>
              <div>🍕 Pizzero: pizzero / pizzero123</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
