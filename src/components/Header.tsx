
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Pizza, LogOut, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { user, logout } = useAuth();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: '👨‍💼 Administrador', variant: 'default' as const };
      case 'asistente':
        return { label: '👥 Asistente', variant: 'secondary' as const };
      case 'pizzero':
        return { label: '👨‍🍳 Pizzero', variant: 'outline' as const };
      default:
        return { label: 'Usuario', variant: 'secondary' as const };
    }
  };

  const roleInfo = getRoleLabel(user?.role || '');

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Pizza className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-xl">Pizzería Manager</h1>
            <p className="text-sm text-muted-foreground">Sistema de gestión</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{user?.username}</span>
            <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
