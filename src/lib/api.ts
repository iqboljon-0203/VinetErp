import { supabase } from './supabase';
import type { OrderStatus, PaymentMethod } from './types';

// ==========================================
// DASHBOARD & FINANCE
// ==========================================

export async function getDashboardStats() {
  // We'll calculate some basic stats by fetching data.
  // In a real heavy app, this would be a Postgres RPC (function) or materialized view.
  
  // 1. Get all active orders (not delivered)
  const { count: activeOrdersCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact' })
    .in('status', ['new', 'printing', 'binding', 'ready']);

  // 2. Get today's sales (orders created today)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total_price')
    .gte('created_at', today.toISOString());
    
  const dailySales = todayOrders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

  // 3. Get cash balance (sum of all transactions)
  // Or we can just calculate from transactions table if we want a single cashbox.
  const { data: transactions } = await supabase
    .from('transactions')
    .select('type, amount');
    
  let cashBalance = 0;
  if (transactions) {
    cashBalance = transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  }

  // 4. Low stock items
  const { count: lowStockCount } = await supabase
    .from('items')
    .select('id', { count: 'exact' })
    .lt('stock_level', 10); // Simple condition, ideally compare with min_stock_level

  return {
    dailySales,
    dailySalesChange: 0, // Requires yesterday's data to compare
    activeOrders: activeOrdersCount || 0,
    cashBalance,
    lowStockCount: lowStockCount || 0,
  };
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_price,
      created_at,
      clients ( name )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data?.map(order => ({
    ...order,
    client_name: (order.clients as any)?.name || 'Noma`lum',
    payment_method: 'cash' as PaymentMethod, 
  })) || [];
}

export async function getRecentOrders(limit = 5) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      id,
      order_number,
      status,
      total_price,
      created_at,
      clients ( name )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  
  return data?.map(order => ({
    ...order,
    client_name: (order.clients as any)?.name || 'Noma`lum',
    // Defaulting payment method as we didn't add it to orders schema originally, 
    // but in UI we show it. We can add it or just mock it for now.
    payment_method: 'cash' as PaymentMethod, 
  })) || [];
}

// ==========================================
// CRM (CLIENTS)
// ==========================================

export async function getClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createClient(name: string, phone: string) {
  const { data, error } = await supabase
    .from('clients')
    .insert([{ name, phone, balance: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClientBalance(clientId: string, amount: number) {
  // This is a naive update. In production, use RPC to avoid race conditions.
  const { data: client } = await supabase.from('clients').select('balance').eq('id', clientId).single();
  if (!client) throw new Error('Client not found');

  const { data, error } = await supabase
    .from('clients')
    .update({ balance: client.balance + amount })
    .eq('id', clientId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ==========================================
// WAREHOUSE & INVENTORY
// ==========================================

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  
  return data?.map(item => ({
    ...item,
    category_name: (item.categories as any)?.name || 'Noma`lum'
  })) || [];
}

export async function createItem(item: any) {
  const { data, error } = await supabase
    .from('items')
    .insert([item])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// FINANCE (CASHBOX)
// ==========================================

export async function getTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*, users(name), clients(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;

  return data?.map(t => ({
    ...t,
    user_name: (t.users as any)?.name || 'Tizim',
    client_name: (t.clients as any)?.name
  })) || [];
}

export async function createTransaction(transaction: any) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ==========================================
// PRODUCTION & ORDERS
// ==========================================

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder(orderData: any, itemsData: any[]) {
  // 1. Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();
    
  if (orderError) throw orderError;

  // 2. Insert order items
  const itemsToInsert = itemsData.map(item => ({
    order_id: order.id,
    item_id: item.item_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) throw itemsError;

  // Send Telegram Notification (Fire and forget)
  sendTelegramNotification(
    `🚀 <b>Yangi Buyurtma Yaratildi!</b>\n\n` +
    `🔢 <b>Raqami:</b> #${order.order_number}\n` +
    `💰 <b>Umumiy narxi:</b> ${order.total_price?.toLocaleString()} UZS\n` +
    `💵 <b>To'langan avans:</b> ${order.paid_amount?.toLocaleString()} UZS`
  ).catch(console.error);

  return order;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export async function sendTelegramNotification(message: string) {
  try {
    await fetch('/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error('Failed to notify telegram:', error);
  }
}

// ==========================================
// USERS & STAFF
// ==========================================

export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
