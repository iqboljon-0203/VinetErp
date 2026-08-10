import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with the Service Role key
// This bypasses RLS and allows Admin operations like creating users.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, role, phone, base_salary } = body;

    // Validate inputs
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Barcha majburiy maydonlarni to`ldiring (Email, Parol, Ism, Rol).' },
        { status: 400 }
      );
    }

    // 1. Create User in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm email
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Foydalanuvchini yaratishda noma`lum xatolik.' }, { status: 500 });
    }

    // 2. Insert into public.users
    const { error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        role,
        phone: phone || null,
        base_salary: base_salary || 0,
      });

    if (dbError) {
      // If DB insert fails, we should ideally delete the Auth user to avoid orphans,
      // but for simplicity, we just return the error.
      return NextResponse.json({ error: `Baza xatoligi: ${dbError.message}` }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: { id: authData.user.id, email, name, role } 
    });

  } catch (error: any) {
    console.error('Create User Error:', error);
    return NextResponse.json(
      { error: 'Ichki server xatosi yuz berdi.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, newPassword } = body;

    if (!userId || !newPassword) {
      return NextResponse.json(
        { error: 'Barcha majburiy maydonlarni to`ldiring (userId, yangi parol).' },
        { status: 400 }
      );
    }

    // Update user password in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Parol muvaffaqiyatli o`zgartirildi' });
  } catch (error: any) {
    console.error('Update User Password Error:', error);
    return NextResponse.json(
      { error: 'Ichki server xatosi yuz berdi.' },
      { status: 500 }
    );
  }
}
