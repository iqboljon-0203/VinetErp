-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table public.users (
  id uuid references auth.users not null primary key,
  name text not null,
  role text not null check (role in ('admin', 'seller', 'warehouse', 'production')),
  phone text,
  base_salary numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- CLIENTS & SUPPLIERS
create table public.clients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text,
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.suppliers (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone text,
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY (Categories & Items)
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  type text not null check (type in ('raw_material', 'product')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.items (
  id uuid default uuid_generate_v4() primary key,
  category_id uuid references public.categories(id) not null,
  name text not null,
  unit text not null,
  price numeric default 0,
  stock_level numeric default 0,
  min_stock_level numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BOM (Recipes)
create table public.bom_recipes (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.items(id) not null,
  raw_material_id uuid references public.items(id) not null,
  quantity_needed numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ORDERS
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  client_id uuid references public.clients(id) not null,
  status text not null check (status in ('pending', 'printing', 'cutting', 'gluing', 'packing', 'ready', 'delivered', 'returned')),
  total_price numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.items(id) not null,
  quantity numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.order_attachments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  file_url text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTION STAGES (KPI Tracker)
create table public.production_stages (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) not null,
  stage_name text not null,
  assigned_user_id uuid references public.users(id),
  status text not null default 'pending',
  kpi_amount numeric default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INVENTORY LOGS
create table public.inventory_logs (
  id uuid default uuid_generate_v4() primary key,
  item_id uuid references public.items(id) not null,
  quantity_change numeric not null,
  type text not null check (type in ('in', 'out', 'reserve', 'scrap')),
  reference_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TRANSACTIONS
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  amount numeric not null,
  type text not null check (type in ('income', 'expense', 'refund')),
  payment_method text not null check (payment_method in ('cash', 'card', 'transfer')),
  reference_id text,
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- First, enable RLS on all tables
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.suppliers enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.bom_recipes enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_attachments enable row level security;
alter table public.production_stages enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.transactions enable row level security;

-- Function to get current user role
create or replace function public.get_user_role()
returns text
language sql security definer
as $$
  select role from public.users where id = auth.uid();
$$;

-- 1. Admins see EVERYTHING
create policy "Admins have full access to users" on public.users for all using (get_user_role() = 'admin');
create policy "Admins have full access to clients" on public.clients for all using (get_user_role() = 'admin');
create policy "Admins have full access to suppliers" on public.suppliers for all using (get_user_role() = 'admin');
create policy "Admins have full access to categories" on public.categories for all using (get_user_role() = 'admin');
create policy "Admins have full access to items" on public.items for all using (get_user_role() = 'admin');
create policy "Admins have full access to bom_recipes" on public.bom_recipes for all using (get_user_role() = 'admin');
create policy "Admins have full access to orders" on public.orders for all using (get_user_role() = 'admin');
create policy "Admins have full access to order_items" on public.order_items for all using (get_user_role() = 'admin');
create policy "Admins have full access to order_attachments" on public.order_attachments for all using (get_user_role() = 'admin');
create policy "Admins have full access to production_stages" on public.production_stages for all using (get_user_role() = 'admin');
create policy "Admins have full access to inventory_logs" on public.inventory_logs for all using (get_user_role() = 'admin');
create policy "Admins have full access to transactions" on public.transactions for all using (get_user_role() = 'admin');

-- 2. Sellers (CRM) rules
create policy "Sellers access clients" on public.clients for all using (get_user_role() = 'seller');
create policy "Sellers access orders" on public.orders for all using (get_user_role() = 'seller');
create policy "Sellers access order_items" on public.order_items for all using (get_user_role() = 'seller');
create policy "Sellers access attachments" on public.order_attachments for all using (get_user_role() = 'seller');
create policy "Sellers can view items" on public.items for select using (get_user_role() = 'seller');
create policy "Sellers can view categories" on public.categories for select using (get_user_role() = 'seller');

-- 3. Warehouse (Omborchi) rules
create policy "Warehouse access suppliers" on public.suppliers for all using (get_user_role() = 'warehouse');
create policy "Warehouse access items" on public.items for all using (get_user_role() = 'warehouse');
create policy "Warehouse access categories" on public.categories for all using (get_user_role() = 'warehouse');
create policy "Warehouse access inventory_logs" on public.inventory_logs for all using (get_user_role() = 'warehouse');

-- 4. Production (Ustalar) rules
create policy "Production view assigned stages" on public.production_stages for select using (get_user_role() = 'production' and assigned_user_id = auth.uid());
create policy "Production update assigned stages" on public.production_stages for update using (get_user_role() = 'production' and assigned_user_id = auth.uid());
create policy "Production view orders" on public.orders for select using (get_user_role() = 'production');
create policy "Production view order items" on public.order_items for select using (get_user_role() = 'production');
create policy "Production view attachments" on public.order_attachments for select using (get_user_role() = 'production');
create policy "Production view BOM" on public.bom_recipes for select using (get_user_role() = 'production');

-- Users can always see their own profile
create policy "Users can view own profile" on public.users for select using (id = auth.uid());


-- ==========================================
-- TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger 1: Auto-deduct inventory when order is marked 'ready'
create or replace function public.process_bom_deduction()
returns trigger
language plpgsql
as $$
declare
  order_item record;
  bom_item record;
begin
  -- Only trigger when status changes to 'ready'
  if new.status = 'ready' and old.status != 'ready' then
    
    -- Loop through all products in this order
    for order_item in select product_id, quantity from public.order_items where order_id = new.id loop
      
      -- Loop through the BOM recipe for each product
      for bom_item in select raw_material_id, quantity_needed from public.bom_recipes where product_id = order_item.product_id loop
        
        -- Insert an inventory log to deduct the raw material
        insert into public.inventory_logs (item_id, quantity_change, type, reference_id)
        values (bom_item.raw_material_id, -(bom_item.quantity_needed * order_item.quantity), 'out', 'ORDER-' || new.order_number);
        
        -- Update the actual stock level
        update public.items 
        set stock_level = stock_level - (bom_item.quantity_needed * order_item.quantity)
        where id = bom_item.raw_material_id;
        
      end loop;
      
    end loop;
  end if;
  
  return new;
end;
$$;

create trigger tr_order_ready_deduct_bom
after update on public.orders
for each row execute function public.process_bom_deduction();

-- Trigger 2: Auto-record Scrap financial transaction
create or replace function public.process_scrap_transaction()
returns trigger
language plpgsql
as $$
declare
  item_price numeric;
begin
  if new.type = 'scrap' then
    -- Get the unit price of the scrapped item
    select price into item_price from public.items where id = new.item_id;
    
    -- Create an expense transaction (loss)
    insert into public.transactions (amount, type, payment_method, reference_id)
    values (abs(new.quantity_change) * coalesce(item_price, 0), 'expense', 'transfer', 'SCRAP-' || new.id);
  end if;
  return new;
end;
$$;

create trigger tr_inventory_scrap
after insert on public.inventory_logs
for each row execute function public.process_scrap_transaction();
