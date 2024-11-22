import React, { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Producto } from '../types';

export const Ventas: React.FC = () => {
  const { productos, registrarVenta } = useStore();
  const [carrito, setCarrito] = useState<{ producto: Producto; cantidad: number }[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState('');

  const agregarAlCarrito = () => {
    const producto = productos.find((p) => p.id === productoSeleccionado);
    if (!producto || cantidad <= 0) return;

    // Verificar si hay suficiente stock
    if (cantidad > producto.stock) {
      setError(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`);
      return;
    }

    // Verificar si ya existe en el carrito y si la suma total no excede el stock
    const itemExistente = carrito.find((item) => item.producto.id === producto.id);
    if (itemExistente) {
      if (itemExistente.cantidad + cantidad > producto.stock) {
        setError(`Stock insuficiente. Solo hay ${producto.stock} unidades disponibles.`);
        return;
      }
      setCarrito(
        carrito.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { producto, cantidad }]);
    }

    setError('');
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const eliminarDelCarrito = (productoId: string) => {
    setCarrito(carrito.filter((item) => item.producto.id !== productoId));
    setError('');
  };

  const total = carrito.reduce(
    (sum, item) => sum + item.producto.precio * item.cantidad,
    0
  );

  const realizarVenta = () => {
    if (carrito.length === 0) return;

    registrarVenta({
      id: crypto.randomUUID(),
      fecha: new Date(),
      productos: carrito,
      total,
    });

    setCarrito([]);
    setError('');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Nueva Venta</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Agregar Productos</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Producto
              </label>
              <select
                value={productoSeleccionado}
                onChange={(e) => setProductoSeleccionado(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - ${producto.precio} (Stock: {producto.stock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {error && (
              <div className="text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            <button
              onClick={agregarAlCarrito}
              disabled={!productoSeleccionado}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Plus className="h-5 w-5" />
              Agregar al Carrito
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Carrito</h3>
          <div className="space-y-4">
            {carrito.map((item) => (
              <div
                key={item.producto.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{item.producto.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {item.cantidad} x ${item.producto.precio}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold">
                    ${(item.cantidad * item.producto.precio).toFixed(2)}
                  </p>
                  <button
                    onClick={() => eliminarDelCarrito(item.producto.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            {carrito.length === 0 && (
              <p className="text-center text-gray-500">
                No hay productos en el carrito
              </p>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={realizarVenta}
                disabled={carrito.length === 0}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Completar Venta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};