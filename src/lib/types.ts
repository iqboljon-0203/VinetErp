// ============================================
// DREAMERP — TypeScript Type Definitions
// ============================================

// --- Roles ---
export type UserRole = 'admin' | 'seller' | 'warehouse' | 'worker';

// --- Users ---
export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  base_salary: number;
  avatar?: string;
  created_at: string;
}

// --- Clients ---
export interface Client {
  id: string;
  name: string;
  phone: string;
  balance: number;
  total_orders: number;
  created_at: string;
}

// --- Suppliers ---
export interface Supplier {
  id: string;
  name: string;
  phone: string;
  balance: number;
  last_delivery_date?: string;
  created_at: string;
}

// --- Categories ---
export type CategoryType = 'raw_material' | 'product';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

// --- Items (Raw Materials & Products) ---
export type ItemUnit = 'dona' | 'metr' | 'sm' | 'litr' | 'gramm' | 'karobka' | 'rulon' | 'list';

export interface Item {
  id: string;
  category_id: string;
  category_name?: string;
  name: string;
  unit: ItemUnit;
  price: number;
  cost_price?: number;
  min_stock_level: number;
  current_stock: number;
  type: CategoryType;
  dimensions?: string;
}

// --- BOM Recipes ---
export interface BomRecipe {
  id: string;
  product_id: string;
  product_name?: string;
  raw_material_id: string;
  raw_material_name?: string;
  raw_material_unit?: ItemUnit;
  quantity_needed: number;
  estimated_cost?: number;
}

// --- Order Status ---
export type OrderStatus = 
  | 'pending' 
  | 'printing' 
  | 'cutting' 
  | 'gluing' 
  | 'packing' 
  | 'ready' 
  | 'delivered' 
  | 'returned';

// --- Orders ---
export interface Order {
  id: string;
  order_number: string;
  client_id: string;
  client_name?: string;
  client_phone?: string;
  status: OrderStatus;
  total_price: number;
  paid_amount: number;
  payment_method: PaymentMethod;
  notes?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

// --- Order Items ---
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// --- Order Attachments ---
export interface OrderAttachment {
  id: string;
  order_id: string;
  file_url: string;
  file_name: string;
  file_type: string;
  description?: string;
}

// --- Production Stages ---
export type StageName = 'printing' | 'cutting' | 'gluing' | 'packing';

export interface ProductionStage {
  id: string;
  order_id: string;
  order_number?: string;
  stage_name: StageName;
  assigned_user_id?: string;
  assigned_user_name?: string;
  started_at?: string;
  completed_at?: string;
  kpi_amount: number;
  status: 'waiting' | 'in_progress' | 'completed';
}

// --- Inventory Logs ---
export type InventoryLogType = 'in' | 'out' | 'reserve' | 'scrap';

export interface InventoryLog {
  id: string;
  item_id: string;
  item_name?: string;
  quantity_change: number;
  type: InventoryLogType;
  reference_id?: string;
  reference_type?: string;
  notes?: string;
  created_by?: string;
  date: string;
}

// --- Transactions ---
export type TransactionType = 'income' | 'expense' | 'refund';
export type PaymentMethod = 'cash' | 'card' | 'transfer';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  payment_method: PaymentMethod;
  reference_id?: string;
  reference_type?: string;
  description: string;
  created_by: string;
  date: string;
}

// --- Dashboard Stats ---
export interface DashboardStats {
  daily_sales: number;
  daily_sales_change: number;
  active_orders: number;
  orders_in_production: number;
  cash_balance: number;
  low_stock_count: number;
}

export interface SalesDataPoint {
  day: string;
  amount: number;
}

export interface TopProduct {
  name: string;
  percentage: number;
  color: string;
}

// --- KPI Summary ---
export interface KpiSummary {
  user_id: string;
  user_name: string;
  role: UserRole;
  base_salary: number;
  total_kpi: number;
  completed_stages: number;
  period: string;
}

// --- Low Stock Alert ---
export interface LowStockAlert {
  item_id: string;
  item_name: string;
  current_stock: number;
  min_stock_level: number;
  unit: ItemUnit;
}

// --- Scrap Report ---
export interface ScrapReport {
  id: string;
  item_id: string;
  item_name: string;
  quantity: number;
  reason: string;
  document_number: string;
  financial_loss: number;
  created_by: string;
  date: string;
}

// --- Navigation ---
export interface NavItem {
  title: string;
  titleRu: string;
  href: string;
  icon: string;
  roles: UserRole[];
  badge?: number;
}

// --- Language ---
export type Language = 'uz' | 'ru';
