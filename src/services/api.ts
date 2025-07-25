// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7063/api';

// Tipos para las respuestas del backend
export interface LoginRequest {
  nombreUsuario: string;
  contraseña: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  usuarioId: number;
  nombreUsuario: string;
  rol: string;
  token: string;
  expiracion: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Usuario {
  id: number;
  nombreUsuario: string;
  rol: string;
  email: string;
  activo: boolean;
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

export interface Pedido {
  id: number;
  clienteId: number;
  pizzaId: number;
  cantidad: number;
  precioTotal: number;
  fechaPedido: string;
  estado: string;
  observaciones: string;
  cliente?: Cliente;
  pizza?: Pizza;
}

// Función helper para hacer peticiones HTTP
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Agregar token de autorización si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': token,
    };
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${url}:`, error);
    throw error;
  }
}

// Servicios de Autenticación
export const authService = {
  async login(nombreUsuario: string, contraseña: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { nombreUsuario, contraseña };
    
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    });
    
    // Guardar token en localStorage si el login es exitoso
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.usuarioId.toString(),
        username: response.nombreUsuario,
        role: response.rol.toLowerCase(),
      }));
    }
    
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      // Limpiar datos locales independientemente de la respuesta del servidor
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  async validateToken(): Promise<{ valid: boolean; userId?: string; username?: string; role?: string }> {
    return await apiRequest('/auth/validate');
  }
};

// Servicios de Pizza
export const pizzaService = {
  async getAll(): Promise<Pizza[]> {
    const response = await apiRequest<ApiResponse<Pizza[]>>('/pizza');
    return response.data || [];
  },

  async getDisponibles(): Promise<Pizza[]> {
    const response = await apiRequest<ApiResponse<Pizza[]>>('/pizza/disponibles');
    return response.data || [];
  },

  async getById(id: number): Promise<Pizza> {
    const response = await apiRequest<ApiResponse<Pizza>>(`/pizza/${id}`);
    if (!response.data) throw new Error('Pizza no encontrada');
    return response.data;
  },

  async create(pizza: Omit<Pizza, 'id'>): Promise<Pizza> {
    const response = await apiRequest<ApiResponse<Pizza>>('/pizza', {
      method: 'POST',
      body: JSON.stringify(pizza),
    });
    if (!response.data) throw new Error('Error al crear pizza');
    return response.data;
  },

  async update(id: number, pizza: Partial<Pizza>): Promise<Pizza> {
    const response = await apiRequest<ApiResponse<Pizza>>(`/pizza/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...pizza, id }),
    });
    if (!response.data) throw new Error('Error al actualizar pizza');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/pizza/${id}`, { method: 'DELETE' });
  }
};

// Servicios de Pedido
export const pedidoService = {
  async getAll(): Promise<Pedido[]> {
    const response = await apiRequest<ApiResponse<Pedido[]>>('/pedido');
    return response.data || [];
  },

  async getPendientes(): Promise<Pedido[]> {
    const response = await apiRequest<ApiResponse<Pedido[]>>('/pedido/pendientes');
    return response.data || [];
  },

  async getEntregados(): Promise<Pedido[]> {
    const response = await apiRequest<ApiResponse<Pedido[]>>('/pedido/estado/Entregado');
    return response.data || [];
  },

  async getByEstado(estado: string): Promise<Pedido[]> {
    const response = await apiRequest<ApiResponse<Pedido[]>>(`/pedido/estado/${estado}`);
    return response.data || [];
  },

  async getById(id: number): Promise<Pedido> {
    const response = await apiRequest<ApiResponse<Pedido>>(`/pedido/${id}`);
    if (!response.data) throw new Error('Pedido no encontrado');
    return response.data;
  },

  async create(pedido: Omit<Pedido, 'id' | 'fechaPedido'>): Promise<Pedido> {
    const response = await apiRequest<ApiResponse<Pedido>>('/pedido', {
      method: 'POST',
      body: JSON.stringify(pedido),
    });
    if (!response.data) throw new Error('Error al crear pedido');
    return response.data;
  },

  async updateStatus(id: number, estado: string): Promise<Pedido> {
    const response = await apiRequest<ApiResponse<Pedido>>(`/pedido/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
    if (!response.data) throw new Error('Error al actualizar estado del pedido');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/pedido/${id}`, { method: 'DELETE' });
  }
};

// Servicios de Cliente
export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    const response = await apiRequest<ApiResponse<Cliente[]>>('/cliente');
    return response.data || [];
  },

  async getById(id: number): Promise<Cliente> {
    const response = await apiRequest<ApiResponse<Cliente>>(`/cliente/${id}`);
    if (!response.data) throw new Error('Cliente no encontrado');
    return response.data;
  },

  async create(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    const response = await apiRequest<ApiResponse<Cliente>>('/cliente', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
    if (!response.data) throw new Error('Error al crear cliente');
    return response.data;
  },

  async update(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    const response = await apiRequest<ApiResponse<Cliente>>(`/cliente/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...cliente, id }),
    });
    if (!response.data) throw new Error('Error al actualizar cliente');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/cliente/${id}`, { method: 'DELETE' });
  }
};

// Servicios de Usuario
export const usuarioService = {
  async getAll(): Promise<Usuario[]> {
    const response = await apiRequest<ApiResponse<Usuario[]>>('/usuario');
    return response.data || [];
  },

  async getById(id: number): Promise<Usuario> {
    const response = await apiRequest<ApiResponse<Usuario>>(`/usuario/${id}`);
    if (!response.data) throw new Error('Usuario no encontrado');
    return response.data;
  },

  async create(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await apiRequest<ApiResponse<Usuario>>('/usuario', {
      method: 'POST',
      body: JSON.stringify(usuario),
    });
    if (!response.data) throw new Error('Error al crear usuario');
    return response.data;
  },

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario> {
    const response = await apiRequest<ApiResponse<Usuario>>(`/usuario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...usuario, id }),
    });
    if (!response.data) throw new Error('Error al actualizar usuario');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiRequest(`/usuario/${id}`, { method: 'DELETE' });
  }
};
