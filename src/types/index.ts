
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'asistente' | 'pizzero';
}

export interface Pizza {
  id: number;
  tipo: string;
  tamaño: string;
  precio: number;
  ingredientes: string;
  disponible: boolean;
}

export interface Cliente {
  id: number;
  cedula: string;
  email: string;
  telefono: string;
}

export interface Order {
  id: number;
  clienteId: number;
  pizzaId: number;
  cantidad: number;
  precioTotal: number;
  fechaPedido: string;
  estado: 'Pendiente' | 'En_Preparacion' | 'Entregado';
  observaciones: string;
  cliente?: Cliente;
  pizza?: Pizza;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface PizzaContextType {
  pizzas: Pizza[];
  loadPizzas: () => Promise<void>;
  addPizza: (pizza: Omit<Pizza, 'id'>) => Promise<void>;
  updatePizza: (id: number, pizza: Partial<Pizza>) => Promise<void>;
  deletePizza: (id: number) => Promise<void>;
  isLoading: boolean;
}

export interface OrderContextType {
  orders: Order[];
  loadOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'fechaPedido'>) => Promise<void>;
  updateOrderStatus: (orderId: number, status: Order['estado']) => Promise<void>;
  deleteOrder: (orderId: number) => Promise<void>;
  isLoading: boolean;
}
