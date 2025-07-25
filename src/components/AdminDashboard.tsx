
import React, { useState } from 'react';
import { usePizza } from '../contexts/PizzaContext';
import { useOrder } from '../contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pizza, ShoppingCart, Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { pizzas, addPizza } = usePizza();
  const { orders } = useOrder();
  const [pizzaName, setPizzaName] = useState('');
  const [pizzaPrice, setPizzaPrice] = useState('');

  const handleAddPizza = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pizzaName || !pizzaPrice) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    const price = parseFloat(pizzaPrice);
    if (price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }

    addPizza({ name: pizzaName, price });
    setPizzaName('');
    setPizzaPrice('');
    toast.success('Pizza registrada exitosamente');
  };

  const getOrderStatusBadge = (status: string) => {
    return status === 'pendiente' 
      ? <Badge variant="destructive">Pendiente</Badge>
      : <Badge variant="default" className="bg-pizza-green">Entregado</Badge>;
  };

  const totalRevenue = orders
    .filter(order => order.status === 'entregado')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pizzas</CardTitle>
            <Pizza className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pizzas.length}</div>
          </CardContent>
        </Card>
        
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pizza-green">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pizzas" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pizzas">🍕 Gestión de Pizzas</TabsTrigger>
          <TabsTrigger value="orders">📋 Lista de Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pizzas" className="space-y-4">
          <Card className="pizza-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Registrar Nueva Pizza
              </CardTitle>
              <CardDescription>
                Agrega nuevas pizzas al menú de la pizzería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPizza} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pizzaName">Nombre de la Pizza</Label>
                    <Input
                      id="pizzaName"
                      value={pizzaName}
                      onChange={(e) => setPizzaName(e.target.value)}
                      placeholder="Ej: Margherita, Pepperoni..."
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pizzaPrice">Precio ($)</Label>
                    <Input
                      id="pizzaPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={pizzaPrice}
                      onChange={(e) => setPizzaPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="pizza-gradient">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Pizza
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="pizza-card">
            <CardHeader>
              <CardTitle>Lista de Pizzas</CardTitle>
              <CardDescription>
                Todas las pizzas disponibles en el menú
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pizzas.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No hay pizzas registradas aún. ¡Registra la primera!
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Fecha de Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pizzas.map((pizza) => (
                      <TableRow key={pizza.id}>
                        <TableCell className="font-medium">{pizza.name}</TableCell>
                        <TableCell className="text-pizza-green font-semibold">
                          ${pizza.price.toFixed(2)}
                        </TableCell>
                        <TableCell>{pizza.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card className="pizza-card">
            <CardHeader>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>
                Todos los pedidos realizados en la pizzería
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">
                  No hay pedidos registrados aún.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pizza</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">#{order.id.slice(-6)}</TableCell>
                        <TableCell className="font-medium">{order.pizzaName}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-semibold text-pizza-green">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.createdAt.toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
