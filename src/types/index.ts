export interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  minimo: number;
}

export interface Venta {
  id: string;
  fecha: Date;
  productos: {
    producto: Producto;
    cantidad: number;
  }[];
  total: number;
}