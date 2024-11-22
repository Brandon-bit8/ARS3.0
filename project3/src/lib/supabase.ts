import { createClient } from '@supabase/supabase-js';

// Default values for development - replace with your actual Supabase credentials
const supabaseUrl = 'https://ydjnahhzdhmbanqipmop.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkam5haGh6ZGhtYmFucWlwbW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNDY1MTIsImV4cCI6MjA0NzcyMjUxMn0.l3PTsMM3roHJ_iVUnNv29KsFzYr_f-pZSf-awDlBUlI';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// SQL para crear las tablas
const createTables = async () => {
  try {
    // Crear tabla de usuarios si no existe
    const { error: usersError } = await supabase.from('users').select().limit(1);
    if (usersError && usersError.message.includes('does not exist')) {
      await supabase.rpc('create_users_table');
    }

    // Crear tabla de productos si no existe
    const { error: productsError } = await supabase.from('productos').select().limit(1);
    if (productsError && productsError.message.includes('does not exist')) {
      await supabase.rpc('create_products_table');
    }

    // Crear tabla de ventas si no existe
    const { error: salesError } = await supabase.from('ventas').select().limit(1);
    if (salesError && salesError.message.includes('does not exist')) {
      await supabase.rpc('create_sales_table');
    }

    // Insertar usuario admin por defecto
    const { error: adminError } = await supabase
      .from('users')
      .upsert([
        {
          id: '00000000-0000-0000-0000-000000000000',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          name: 'Administrador'
        }
      ], {
        onConflict: 'username'
      });

    if (adminError) {
      console.error('Error creating admin user:', adminError);
    }

    // Insertar productos de ejemplo
    const { error: productsInsertError } = await supabase
      .from('productos')
      .upsert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          nombre: 'Martillo',
          categoria: 'Herramientas',
          precio: 15.99,
          stock: 50,
          minimo: 10
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          nombre: 'Destornillador Phillips',
          categoria: 'Herramientas',
          precio: 8.99,
          stock: 75,
          minimo: 15
        }
      ], {
        onConflict: 'id'
      });

    if (productsInsertError) {
      console.error('Error inserting sample products:', productsInsertError);
    }

  } catch (error) {
    console.error('Error in createTables:', error);
    throw error;
  }
};

export const initializeDatabase = async () => {
  try {
    await createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};