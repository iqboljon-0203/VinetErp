-- ==========================================
-- DREAMERP - MOCK DATA SEED SCRIPT
-- ==========================================
-- Ushbu skriptni Supabase SQL Editor da ishga tushiring
-- RLS (Row Level Security) qoidalarini chetlab o'tish uchun bu faqat SQL Editor orqali qilinadi.

-- 1. Create a dummy Auth User (Admin) if you haven't created one.
-- NOTE: We will insert a dummy user into public.users. Since we don't have a real auth.users ID, 
-- we will just use a fake UUID for testing if foreign key checks are disabled, OR
-- better yet, we can create a function that authenticates users manually, but Supabase requires real auth.users.
-- FOR NOW, let's just insert data that doesn't depend on auth.users for UI testing.

-- Disable RLS temporarily to insert seed data
alter table public.users disable row level security;
alter table public.clients disable row level security;
alter table public.suppliers disable row level security;
alter table public.categories disable row level security;
alter table public.items disable row level security;
alter table public.orders disable row level security;
alter table public.order_items disable row level security;
alter table public.transactions disable row level security;
alter table public.inventory_logs disable row level security;
alter table public.bom_recipes disable row level security;

-- Clear existing data
truncate table public.transactions cascade;
truncate table public.inventory_logs cascade;
truncate table public.production_stages cascade;
truncate table public.order_attachments cascade;
truncate table public.order_items cascade;
truncate table public.bom_recipes cascade;
truncate table public.orders cascade;
truncate table public.items cascade;
truncate table public.categories cascade;
truncate table public.suppliers cascade;
truncate table public.clients cascade;

-- Categories
insert into public.categories (id, name, type) values 
  ('c0000000-0000-0000-0000-000000000001', 'Qog''oz', 'raw_material'),
  ('c0000000-0000-0000-0000-000000000002', 'Oyna', 'raw_material'),
  ('c0000000-0000-0000-0000-000000000003', 'Koja', 'raw_material'),
  ('c0000000-0000-0000-0000-000000000004', 'Kley', 'raw_material'),
  ('c0000000-0000-0000-0000-000000000005', 'Fotokitoblar', 'product'),
  ('c0000000-0000-0000-0000-000000000006', 'Vinetkalar', 'product');

-- Items (Raw Materials)
insert into public.items (id, category_id, name, unit, price, stock_level, min_stock_level) values 
  ('10000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Lucky Qog''oz', 'dona', 1200, 1500, 500),
  ('10000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Fujifilm Qog''oz', 'dona', 1500, 800, 300),
  ('10000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'Oyna 9x30', 'dona', 4000, 300, 100),
  ('10000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'Koja Qora (Rulon)', 'metr', 25000, 45, 10),
  ('10000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 'Kley Vishka', 'litr', 18000, 25, 5);

-- Items (Products)
insert into public.items (id, category_id, name, unit, price, stock_level, min_stock_level) values 
  ('20000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Plastik 3 list 30x40', 'dona', 39000, 10, 0),
  ('20000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000005', 'A4 oyna+koja 3 list', 'dona', 74000, 5, 0),
  ('20000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000005', 'Twix 5 list', 'dona', 145000, 2, 0);

-- BOM Recipes (Twix 5 list needs 5 paper, 2 mirror, 0.5m koja)
insert into public.bom_recipes (product_id, raw_material_id, quantity_needed) values 
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 5),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 2),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 0.5);

-- Clients
insert into public.clients (id, name, phone, balance) values 
  ('30000000-0000-0000-0000-000000000001', 'Studio X Manufacturing', '+998 90 111 22 33', -1245000),
  ('30000000-0000-0000-0000-000000000002', 'Fayz Photo Studio', '+998 99 222 33 44', 500000);

-- Suppliers
insert into public.suppliers (id, name, phone, balance) values 
  ('40000000-0000-0000-0000-000000000001', 'Alpha Paper Co', '+1 (555) 019-2831', -450000),
  ('40000000-0000-0000-0000-000000000002', 'Woodland Timber', '+1 (555) 442-9902', 0);

-- Orders
insert into public.orders (id, order_number, client_id, status, total_price) values 
  ('50000000-0000-0000-0000-000000000001', 'ORD-9021', '30000000-0000-0000-0000-000000000001', 'printing', 1450000),
  ('50000000-0000-0000-0000-000000000002', 'ORD-8842', '30000000-0000-0000-0000-000000000002', 'delivered', 390000);

-- Order Items
insert into public.order_items (order_id, product_id, quantity) values 
  ('50000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 10),
  ('50000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 10);

-- Re-enable RLS
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.suppliers enable row level security;
alter table public.categories enable row level security;
alter table public.items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.transactions enable row level security;
alter table public.inventory_logs enable row level security;
alter table public.bom_recipes enable row level security;
