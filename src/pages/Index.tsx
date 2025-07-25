
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Login';
import Header from '../components/Header';
import AdminDashboard from '../components/AdminDashboard';
import AssistantDashboard from '../components/AssistantDashboard';
import PizzeroDashboard from '../components/PizzeroDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'asistente':
        return <AssistantDashboard />;
      case 'pizzero':
        return <PizzeroDashboard />;
      default:
        return <div>Rol no reconocido</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <main>
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Index;
