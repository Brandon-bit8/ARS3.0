import React from 'react';
import { Package } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Productos: React.FC = () => {
  const { productos } = useStore();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Catálogo de Productos</h2>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-blue-600" />
              <h3 className="font-semibold text-lg">{producto.nombre}</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">Categoría: {producto.categoria}</p>
              <p className="text-lg font-semibold text-blue-600">
                ${producto.precio.toFixed(2)}
              </p>
              <p className="text-gray-600">
                Disponibilidad: {producto.stock > 0 ? 'En stock' : 'Agotado'}
              </p>
            </div>
          </div>
        ))}

        {productos.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No hay productos disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  );
};