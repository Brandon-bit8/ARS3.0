import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Producto, Venta } from '../types';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'client';
  name: string;
  shareCode?: string;
}

interface Estado {
  user: User | null;
  productos: Producto[];
  ventas: Venta[];
  isLoading: boolean;
  error: string | null;
  
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithCode: (code: string) => Promise<void>;
  generateShareCode: () => Promise<string>;
  loadData: () => Promise<void>;
  agregarProducto: (producto: Omit<Producto, 'id'>) => Promise<void>;
  actualizarProducto: (id: string, producto: Producto) => Promise<void>;
  registrarVenta: (venta: Omit<Venta, 'id'>) => Promise<void>;
  obtenerEstadisticas: () => { fecha: string; ventas: number; }[];
}

export const useStore = create<Estado>((set, get) => ({
  user: null,
  productos: [],
  ventas: [],
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        throw new Error('Usuario o contraseña incorrectos');
      }

      if (!data) {
        throw new Error('Usuario no encontrado');
      }

      set({
        user: {
          id: data.id,
          username: data.username,
          role: data.role,
          name: data.name,
          shareCode: data.share_code
        },
        isLoading: false
      });

      await get().loadData();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (username: string, password: string, name: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('El nombre de usuario ya está en uso');
      }

      const newUser = {
        id: crypto.randomUUID(),
        username,
        password,
        role: 'client',
        name
      };

      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        console.error('Error de registro:', error);
        throw new Error('Error al registrar usuario');
      }

      if (!data) {
        throw new Error('Error al crear usuario');
      }

      set({
        user: {
          id: data.id,
          username: data.username,
          role: 'client',
          name: data.name
        },
        isLoading: false
      });

      await get().loadData();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ user: null, productos: [], ventas: [], isLoading: false, error: null });
  },

  loginWithCode: async (code: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('share_code', code)
        .single();

      if (userError || !userData) {
        throw new Error('Código de acceso inválido');
      }

      set({
        user: {
          id: userData.id,
          username: userData.username,
          role: userData.role,
          name: userData.name,
          shareCode: userData.share_code
        },
        isLoading: false
      });

      await get().loadData();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  generateShareCode: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const shareCode = crypto.randomUUID().split('-')[0];
      const { user } = get();

      if (!user) throw new Error('Usuario no autenticado');

      const { error } = await supabase
        .from('users')
        .update({ share_code: shareCode })
        .eq('id', user.id);

      if (error) throw error;

      set(state => ({
        user: state.user ? { ...state.user, shareCode } : null,
        isLoading: false
      }));

      return shareCode;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  loadData: async () => {
    try {
      const { data: productos, error: productosError } = await supabase
        .from('productos')
        .select('*');

      if (productosError) {
        console.error('Error loading products:', productosError);
        return;
      }

      const { data: ventas, error: ventasError } = await supabase
        .from('ventas')
        .select('*');

      if (ventasError) {
        console.error('Error loading sales:', ventasError);
        return;
      }

      set({ 
        productos: productos || [], 
        ventas: ventas || [] 
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  },

  agregarProducto: async (producto) => {
    try {
      const productoConId = {
        ...producto,
        id: crypto.randomUUID()
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([productoConId])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        productos: [...state.productos, data]
      }));
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  actualizarProducto: async (id, producto) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update(producto)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        productos: state.productos.map(p => p.id === id ? producto : p)
      }));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  registrarVenta: async (venta) => {
    try {
      const ventaConId = {
        ...venta,
        id: crypto.randomUUID()
      };

      const { data, error } = await supabase
        .from('ventas')
        .insert([ventaConId])
        .select()
        .single();

      if (error) throw error;

      // Actualizar stock
      for (const item of venta.productos) {
        const producto = item.producto;
        await supabase
          .from('productos')
          .update({ stock: producto.stock - item.cantidad })
          .eq('id', producto.id);
      }

      set(state => ({
        ventas: [...state.ventas, data],
        productos: state.productos.map(producto => {
          const ventaItem = venta.productos.find(item => item.producto.id === producto.id);
          if (ventaItem) {
            return {
              ...producto,
              stock: producto.stock - ventaItem.cantidad
            };
          }
          return producto;
        })
      }));
    } catch (error) {
      console.error('Error registering sale:', error);
      throw error;
    }
  },

  obtenerEstadisticas: () => {
    const { ventas } = get();
    return ventas.reduce((acc: { fecha: string; ventas: number; }[], venta) => {
      const fecha = new Date(venta.fecha).toLocaleDateString();
      const existente = acc.find((item) => item.fecha === fecha);
      
      if (existente) {
        existente.ventas += venta.total;
      } else {
        acc.push({ fecha, ventas: venta.total });
      }
      
      return acc;
    }, []);
  },
}));