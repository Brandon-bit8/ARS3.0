import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Producto, Venta } from '../types';

export const generateInventoryReport = (productos: Producto[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Reporte de Inventario', 14, 20);
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

  // Tabla de productos
  const tableData = productos.map(producto => [
    producto.nombre,
    producto.categoria,
    `$${producto.precio.toFixed(2)}`,
    producto.stock.toString(),
    producto.minimo.toString(),
    producto.stock <= producto.minimo ? 'Stock Bajo' : 'OK'
  ]);

  autoTable(doc, {
    head: [['Producto', 'Categoría', 'Precio', 'Stock', 'Mínimo', 'Estado']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }
  });

  doc.save('reporte-inventario.pdf');
};

export const generateSalesReport = (ventas: Venta[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Reporte de Ventas', 14, 20);
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

  // Tabla de ventas
  const tableData = ventas.map(venta => [
    new Date(venta.fecha).toLocaleDateString(),
    venta.productos.map(p => `${p.producto.nombre} (${p.cantidad})`).join(', '),
    `$${venta.total.toFixed(2)}`
  ]);

  autoTable(doc, {
    head: [['Fecha', 'Productos', 'Total']],
    body: tableData,
    startY: 40,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] }
  });

  // Resumen
  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const startY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.text(`Total de Ventas: $${totalVentas.toFixed(2)}`, 14, startY);

  doc.save('reporte-ventas.pdf');
};