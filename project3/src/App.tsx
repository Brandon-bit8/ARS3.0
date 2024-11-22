import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Inventario } from './components/Inventario';
import { Productos } from './components/Productos';
import { Ventas } from './components/Ventas';
import { Reportes } from './components/Reportes';
import { ShareAccess } from './components/ShareAccess';
import { useStore } from './store/useStore';

const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  adminOnly?: boolean;
  clientAllowed?: boolean;
}> = ({ 
  children, 
  adminOnly = false,
  clientAllowed = true
}) => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/productos" />;
  }

  if (!clientAllowed && user.role === 'client') {
    return <Navigate to="/productos" />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/productos" /> : <Login />} 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute adminOnly>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto py-6">
                  <Inventario />
                </main>
                <ShareAccess />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto py-6">
                  <Productos />
                </main>
                <ShareAccess />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ventas"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto py-6">
                  <Ventas />
                </main>
                <ShareAccess />
              </div>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/reportes"
          element={
            <ProtectedRoute adminOnly>
              <div className="min-h-screen bg-gray-100">
                <Navbar />
                <main className="container mx-auto py-6">
                  <Reportes />
                </main>
                <ShareAccess />
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/productos" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;