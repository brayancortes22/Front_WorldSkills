
import React from 'react';
import { useOrder } from '../contexts/OrderContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, AlertCircle } from 'lucide-react';

const PizzeroDashboard = () => {
  const { orders } = useOrder();
  
  const pendingOrders = orders.filter(order => order.status === 'pendiente');
  const completedOrders = orders.filter(order => order.status === 'entregado');

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-pizza-red" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pizza-red">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Por preparar
            </p>
          </CardContent>
        </Card>
        
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <Package className="h-4 w-4 text-pizza-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pizza-green">{completedOrders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pedidos entregados
            </p>
          </CardContent>
        </Card>
        
        <Card className="pizza-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total del Día</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pedidos totales
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="pizza-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-pizza-red" />
            Pedidos Pendientes - ¡A Cocinar! 👨‍🍳
          </CardTitle>
          <CardDescription>
            Lista de pedidos que necesitan ser preparados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">¡Excelente trabajo! 🎉</p>
              <p className="text-muted-foreground">
                No hay pedidos pendientes en este momento.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-pizza-red/10 border border-pizza-red/20 rounded-lg p-4">
                <p className="text-sm font-medium text-pizza-red mb-1">
                  ⚠️ Atención: Hay {pendingOrders.length} pedido{pendingOrders.length !== 1 ? 's' : ''} esperando
                </p>
                <p className="text-sm text-muted-foreground">
                  Revisa los detalles abajo y comienza a preparar las pizzas.
                </p>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Pizza</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Tiempo</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingOrders.map((order) => {
                    const timeElapsed = Math.floor((Date.now() - order.createdAt.getTime()) / (1000 * 60));
                    const isUrgent = timeElapsed > 15;
                    
                    return (
                      <TableRow key={order.id} className={isUrgent ? 'bg-red-50' : ''}>
                        <TableCell className="font-mono text-sm font-medium">
                          #{order.id.slice(-6)}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-lg">🍕 {order.pizzaName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-lg px-3 py-1">
                            {order.quantity}x
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{order.customerName}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          📞 {order.customerPhone}
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm ${isUrgent ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                            {isUrgent && '⚠️ '}
                            {timeElapsed < 1 ? 'Recién ordenado' : `${timeElapsed} min`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="animate-pulse">
                            🔥 Preparar
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">💡 Recordatorio:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Los pedidos marcados en rojo llevan más de 15 minutos</li>
                  <li>• El asistente se encarga de marcar como "Entregado"</li>
                  <li>• Contacta al asistente si hay algún problema con el pedido</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PizzeroDashboard;
