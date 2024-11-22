import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './lib/supabase';

// Inicializar base de datos
initializeDatabase()
  .then(() => console.log('Database initialization complete'))
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    // Mostrar un mensaje de error al usuario si es necesario
  });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);