import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Producto } from '../types';

export const Inventario: React.FC = () => {
  const { productos, agregarProducto, actualizarProducto } = useStore();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    stock: '',
    minimo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevoProducto = {
      id: productoEditar?.id || crypto.randomUUID(),
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      minimo: Number(formData.minimo)
    };

    if (productoEditar) {
      actualizarProducto(productoEditar.id, nuevoProducto);
    } else {
      agregarProducto(nuevoProducto);
    }

    setMostrarFormulario(false);
    setProductoEditar(null);
    setFormData({ nombre: '', categoria: '', precio: '', stock: '', minimo: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventario</h2>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Nuevo Producto
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{producto.nombre}</h3>
              <button
                onClick={() => {
                  setProductoEditar(producto);
                  setFormData({
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    precio: producto.precio.toString(),
                    stock: producto.stock.toString(),
                    minimo: producto.minimo.toString()
                  });
                  setMostrarFormulario(true);
                }}
                className="text-gray-600 hover:text-blue-600"
              >
                <Edit className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-2">Categoría: {producto.categoria}</p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              ${producto.precio.toFixed(2)}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                Stock: {producto.stock} unidades
              </span>
              {producto.stock <= producto.minimo && (
                <span className="flex items-center gap-1 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  Stock bajo
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg w-full max-w-md"
          >
            <h3 className="text-xl font-bold mb-4">
              {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio
                </label>
                <input
                  type="number"
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  value={formData.minimo}
                  onChange={(e) =>
                    setFormData({ ...formData, minimo: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setProductoEditar(null);
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {productoEditar ? 'Guardar Cambios' : 'Agregar Producto'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};