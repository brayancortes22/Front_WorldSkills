
import React, { useState } from 'react';
import { usePizza } from '../contexts/PizzaContext';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Plus, Package, Phone, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const AssistantDashboard = () => {
  const { pizzas } = usePizza();
  const { orders, addOrder, updateOrderStatus } = useOrder();
  const { user } = useAuth();
  
  const [selectedPizzaId, setSelectedPizzaId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPizzaId || !customerName || !customerPhone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const pizza = pizzas.find(p => p.id === selectedPizzaId);
    if (!pizza) {
      toast.error('Pizza seleccionada no válida');
      return;
    }

    const orderQuantity = parseInt(quantity);
    if (orderQuantity <= 0) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    addOrder({
      pizzaId: selectedPizzaId,
      pizzaName: pizza.name,
      quantity: orderQuantity,
      customerName,
      customerPhone,
      total: pizza.price * orderQuantity,
      status: 'pendiente',
      createdBy: user?.username || 'unknown',
    });

    // Reset form
    setSelectedPizzaId('');
    setQuantity('1');
    setCustomerName('');
    setCustomerPhone('');
    toast.success('Pedido registrado exitosamente');
  };

  const handleUpdateStatus = (orderId: string) => {
    updateOrderStatus(orderId, 'entregado');
    toast.success('Pedido marcado como entregado');
  };

  const getOrderStatusBadge = (status: string) => {
    return status === 'pendiente' 
      ? <Badge variant="destructive">Pendiente</Badge>
      : <Badge variant="default" className="bg-pizza-green">Entregado</Badge>;
  };

  const pendingOrders = orders.filter(order => order.status === 'pendiente');

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pizza-red">{pendingOrders.length}</div>
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
      </div>

      <Tabs defaultValue="new-order" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-order">🛒 Nuevo Pedido</TabsTrigger>
          <TabsTrigger value="orders-list">📋 Lista de Pedidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-order" className="space-y-4">
          <Card className="pizza-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Registrar Nuevo Pedido
              </CardTitle>
              <CardDescription>
                Crea un nuevo pedido para un cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pizzas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No hay pizzas disponibles para crear pedidos.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    El administrador debe registrar pizzas primero.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddOrder} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pizza-select">Seleccionar Pizza</Label>
                      <Select value={selectedPizzaId} onValueChange={setSelectedPizzaId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Elige una pizza" />
                        </SelectTrigger>
                        <SelectContent>
                          {pizzas.map((pizza) => (
                            <SelectItem key={pizza.id} value={pizza.id}>
                              {pizza.name} - ${pizza.price.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Cantidad</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Nombre del Cliente</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="customerName"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Nombre completo"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Teléfono</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="customerPhone"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="Número de teléfono"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {selectedPizzaId && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Resumen del Pedido:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pizzas.find(p => p.id === selectedPizzaId)?.name} x {quantity} = 
                        <span className="font-semibold text-pizza-green ml-1">
                          ${((pizzas.find(p => p.id === selectedPizzaId)?.price || 0) * parseInt(quantity || '1')).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  <Button type="submit" className="pizza-gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar Pedido
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders-list" className="space-y-4">
          <Card className="pizza-card">
            <CardHeader>
              <CardTitle>Lista de Pedidos</CardTitle>
              <CardDescription>
                Gestiona y actualiza el estado de los pedidos
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
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">#{order.id.slice(-6)}</TableCell>
                        <TableCell className="font-medium">{order.pizzaName}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell className="font-semibold text-pizza-green">
                          ${order.total.toFixed(2)}
                        </TableCell>
                        <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {order.status === 'pendiente' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id)}
                              className="bg-pizza-green hover:bg-pizza-green/90"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Entregar
                            </Button>
                          )}
                        </TableCell>
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

export default AssistantDashboard;
