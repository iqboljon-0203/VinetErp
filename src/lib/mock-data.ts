// ============================================
// DREAMERP — Mock Data for Development
// ============================================

import type {
  User, Client, Supplier, Category, Item, BomRecipe, Order, OrderItem,
  OrderAttachment, ProductionStage, InventoryLog, Transaction,
  DashboardStats, SalesDataPoint, TopProduct, KpiSummary, LowStockAlert,
} from './types';

// --- Users ---
export const mockUsers: User[] = [
  { id: 'u1', role: 'admin', name: 'Alisher Karimov', phone: '+998901234567', base_salary: 5_000_000, created_at: '2024-01-01' },
  { id: 'u2', role: 'seller', name: 'Nodira Toshmatova', phone: '+998901234568', base_salary: 3_000_000, created_at: '2024-01-15' },
  { id: 'u3', role: 'warehouse', name: 'Bekzod Raximov', phone: '+998901234569', base_salary: 2_500_000, created_at: '2024-02-01' },
  { id: 'u4', role: 'worker', name: 'Jasur Umarov', phone: '+998901234570', base_salary: 2_000_000, created_at: '2024-02-15' },
  { id: 'u5', role: 'worker', name: 'Sardor Mahmudov', phone: '+998901234571', base_salary: 2_000_000, created_at: '2024-03-01' },
  { id: 'u6', role: 'seller', name: 'Dilnoza Ahmedova', phone: '+998901234572', base_salary: 3_000_000, created_at: '2024-03-15' },
];

// --- Clients ---
export const mockClients: Client[] = [
  { id: 'c1', name: 'Alisher Usmanov', phone: '+998901111111', balance: 0, total_orders: 5, created_at: '2024-01-10' },
  { id: 'c2', name: 'Fotostudiya "Art"', phone: '+998902222222', balance: -150_000, total_orders: 12, created_at: '2024-01-20' },
  { id: 'c3', name: 'Zarina M.', phone: '+998903333333', balance: 50_000, total_orders: 3, created_at: '2024-02-05' },
  { id: 'c4', name: 'Maktab #45 Admin', phone: '+998904444444', balance: -500_000, total_orders: 8, created_at: '2024-02-15' },
  { id: 'c5', name: 'Mustaqil Fotograf', phone: '+998905555555', balance: 0, total_orders: 2, created_at: '2024-03-01' },
  { id: 'c6', name: 'Studio "Panorama"', phone: '+998906666666', balance: 200_000, total_orders: 15, created_at: '2024-01-05' },
  { id: 'c7', name: 'Shaxzod Wedding', phone: '+998907777777', balance: -80_000, total_orders: 6, created_at: '2024-03-10' },
  { id: 'c8', name: 'Dilshod Foto', phone: '+998908888888', balance: 0, total_orders: 4, created_at: '2024-04-01' },
];

// --- Suppliers ---
export const mockSuppliers: Supplier[] = [
  { id: 's1', name: 'Lucky Paper Co.', phone: '+998911111111', balance: 0, last_delivery_date: '2024-08-01', created_at: '2024-01-01' },
  { id: 's2', name: 'Fujifilm Tashkent', phone: '+998912222222', balance: -2_000_000, last_delivery_date: '2024-08-05', created_at: '2024-01-01' },
  { id: 's3', name: 'Glass Import LLC', phone: '+998913333333', balance: 0, last_delivery_date: '2024-07-20', created_at: '2024-02-01' },
  { id: 's4', name: 'Plastik Savdo', phone: '+998914444444', balance: -500_000, last_delivery_date: '2024-08-08', created_at: '2024-02-15' },
  { id: 's5', name: 'Koja Market', phone: '+998915555555', balance: 0, last_delivery_date: '2024-07-28', created_at: '2024-03-01' },
];

// --- Categories ---
export const mockCategories: Category[] = [
  { id: 'cat1', name: "Qog'oz", type: 'raw_material' },
  { id: 'cat2', name: 'Oyna', type: 'raw_material' },
  { id: 'cat3', name: 'Faner', type: 'raw_material' },
  { id: 'cat4', name: 'Plastik', type: 'raw_material' },
  { id: 'cat5', name: 'Koja', type: 'raw_material' },
  { id: 'cat6', name: 'Kley', type: 'raw_material' },
  { id: 'cat7', name: 'Vinetka', type: 'product' },
  { id: 'cat8', name: 'Fotokitob', type: 'product' },
];

// --- Items (Raw Materials) ---
export const mockRawMaterials: Item[] = [
  { id: 'rm1', category_id: 'cat1', category_name: "Qog'oz", name: 'Lucky Crystal Paper', unit: 'dona', price: 800, cost_price: 800, min_stock_level: 500, current_stock: 1250, type: 'raw_material' },
  { id: 'rm2', category_id: 'cat1', category_name: "Qog'oz", name: 'Fujifilm Glossy A4', unit: 'dona', price: 1200, cost_price: 1200, min_stock_level: 300, current_stock: 450, type: 'raw_material' },
  { id: 'rm3', category_id: 'cat1', category_name: "Qog'oz", name: 'Mi Photo Paper', unit: 'dona', price: 600, cost_price: 600, min_stock_level: 200, current_stock: 380, type: 'raw_material' },
  { id: 'rm4', category_id: 'cat2', category_name: 'Oyna', name: 'Oyna 9x30 sm', unit: 'dona', price: 3500, cost_price: 3500, min_stock_level: 100, current_stock: 85, type: 'raw_material', dimensions: '9x30' },
  { id: 'rm5', category_id: 'cat2', category_name: 'Oyna', name: 'Oyna 19x30 sm', unit: 'dona', price: 5000, cost_price: 5000, min_stock_level: 80, current_stock: 120, type: 'raw_material', dimensions: '19x30' },
  { id: 'rm6', category_id: 'cat2', category_name: 'Oyna', name: 'Oyna 12x24 sm', unit: 'dona', price: 4200, cost_price: 4200, min_stock_level: 60, current_stock: 45, type: 'raw_material', dimensions: '12x24' },
  { id: 'rm7', category_id: 'cat2', category_name: 'Oyna', name: 'Oyna 43x30 sm', unit: 'dona', price: 12000, cost_price: 12000, min_stock_level: 40, current_stock: 55, type: 'raw_material', dimensions: '43x30' },
  { id: 'rm8', category_id: 'cat2', category_name: 'Oyna', name: 'Oyna 30x30 sm', unit: 'dona', price: 8000, cost_price: 8000, min_stock_level: 50, current_stock: 72, type: 'raw_material', dimensions: '30x30' },
  { id: 'rm9', category_id: 'cat3', category_name: 'Faner', name: 'Faner 19x30 sm', unit: 'dona', price: 4500, cost_price: 4500, min_stock_level: 50, current_stock: 65, type: 'raw_material', dimensions: '19x30' },
  { id: 'rm10', category_id: 'cat3', category_name: 'Faner', name: 'Faner 29x30 sm', unit: 'dona', price: 6000, cost_price: 6000, min_stock_level: 40, current_stock: 38, type: 'raw_material', dimensions: '29x30' },
  { id: 'rm11', category_id: 'cat3', category_name: 'Faner', name: 'Faner 43x30 sm', unit: 'dona', price: 8500, cost_price: 8500, min_stock_level: 30, current_stock: 42, type: 'raw_material', dimensions: '43x30' },
  { id: 'rm12', category_id: 'cat4', category_name: 'Plastik', name: 'Plastik 45x31', unit: 'dona', price: 2500, cost_price: 2500, min_stock_level: 200, current_stock: 1600, type: 'raw_material', dimensions: '45x31' },
  { id: 'rm13', category_id: 'cat5', category_name: 'Koja', name: 'Koja (rulon)', unit: 'metr', price: 15000, cost_price: 15000, min_stock_level: 50, current_stock: 180, type: 'raw_material' },
  { id: 'rm14', category_id: 'cat6', category_name: 'Kley', name: 'Kley vishka', unit: 'dona', price: 25000, cost_price: 25000, min_stock_level: 10, current_stock: 8, type: 'raw_material' },
  { id: 'rm15', category_id: 'cat6', category_name: 'Kley', name: 'Oyna kley', unit: 'dona', price: 18000, cost_price: 18000, min_stock_level: 15, current_stock: 22, type: 'raw_material' },
];

// --- Items (Products) ---
export const mockProducts: Item[] = [
  { id: 'p1', category_id: 'cat7', category_name: 'Vinetka', name: 'Plastik 3 list 30x40', unit: 'dona', price: 39_000, min_stock_level: 0, current_stock: 25, type: 'product' },
  { id: 'p2', category_id: 'cat7', category_name: 'Vinetka', name: 'A4 oyna+koja 3 list', unit: 'dona', price: 74_000, min_stock_level: 0, current_stock: 12, type: 'product' },
  { id: 'p3', category_id: 'cat7', category_name: 'Vinetka', name: 'A4 panorama 3 list', unit: 'dona', price: 84_000, min_stock_level: 0, current_stock: 8, type: 'product' },
  { id: 'p4', category_id: 'cat7', category_name: 'Vinetka', name: 'Twix 3 list', unit: 'dona', price: 115_000, min_stock_level: 0, current_stock: 15, type: 'product' },
  { id: 'p5', category_id: 'cat7', category_name: 'Vinetka', name: 'Twix 4 list', unit: 'dona', price: 130_000, min_stock_level: 0, current_stock: 10, type: 'product' },
  { id: 'p6', category_id: 'cat7', category_name: 'Vinetka', name: 'Twix 5 list', unit: 'dona', price: 145_000, min_stock_level: 0, current_stock: 7, type: 'product' },
];

// --- BOM Recipes ---
export const mockBomRecipes: BomRecipe[] = [
  // Plastik 3 list 30x40
  { id: 'bom1', product_id: 'p1', product_name: 'Plastik 3 list 30x40', raw_material_id: 'rm2', raw_material_name: 'Fujifilm Glossy A4', raw_material_unit: 'dona', quantity_needed: 3, estimated_cost: 3600 },
  { id: 'bom2', product_id: 'p1', product_name: 'Plastik 3 list 30x40', raw_material_id: 'rm12', raw_material_name: 'Plastik 45x31', raw_material_unit: 'dona', quantity_needed: 1, estimated_cost: 2500 },
  { id: 'bom3', product_id: 'p1', product_name: 'Plastik 3 list 30x40', raw_material_id: 'rm14', raw_material_name: 'Kley vishka', raw_material_unit: 'dona', quantity_needed: 0.05, estimated_cost: 1250 },
  // A4 oyna+koja 3 list
  { id: 'bom4', product_id: 'p2', product_name: 'A4 oyna+koja 3 list', raw_material_id: 'rm2', raw_material_name: 'Fujifilm Glossy A4', raw_material_unit: 'dona', quantity_needed: 3, estimated_cost: 3600 },
  { id: 'bom5', product_id: 'p2', product_name: 'A4 oyna+koja 3 list', raw_material_id: 'rm5', raw_material_name: 'Oyna 19x30 sm', raw_material_unit: 'dona', quantity_needed: 1, estimated_cost: 5000 },
  { id: 'bom6', product_id: 'p2', product_name: 'A4 oyna+koja 3 list', raw_material_id: 'rm13', raw_material_name: 'Koja (rulon)', raw_material_unit: 'metr', quantity_needed: 0.25, estimated_cost: 3750 },
  { id: 'bom7', product_id: 'p2', product_name: 'A4 oyna+koja 3 list', raw_material_id: 'rm15', raw_material_name: 'Oyna kley', raw_material_unit: 'dona', quantity_needed: 0.05, estimated_cost: 900 },
  // A4 panorama 3 list
  { id: 'bom8', product_id: 'p3', product_name: 'A4 panorama 3 list', raw_material_id: 'rm2', raw_material_name: 'Fujifilm Glossy A4', raw_material_unit: 'dona', quantity_needed: 3, estimated_cost: 3600 },
  { id: 'bom9', product_id: 'p3', product_name: 'A4 panorama 3 list', raw_material_id: 'rm7', raw_material_name: 'Oyna 43x30 sm', raw_material_unit: 'dona', quantity_needed: 1, estimated_cost: 12000 },
  { id: 'bom10', product_id: 'p3', product_name: 'A4 panorama 3 list', raw_material_id: 'rm13', raw_material_name: 'Koja (rulon)', raw_material_unit: 'metr', quantity_needed: 0.3, estimated_cost: 4500 },
  { id: 'bom11', product_id: 'p3', product_name: 'A4 panorama 3 list', raw_material_id: 'rm14', raw_material_name: 'Kley vishka', raw_material_unit: 'dona', quantity_needed: 0.05, estimated_cost: 1250 },
  // Twix 5 list
  { id: 'bom12', product_id: 'p6', product_name: 'Twix 5 list', raw_material_id: 'rm1', raw_material_name: 'Lucky Crystal Paper', raw_material_unit: 'dona', quantity_needed: 5, estimated_cost: 4000 },
  { id: 'bom13', product_id: 'p6', product_name: 'Twix 5 list', raw_material_id: 'rm7', raw_material_name: 'Oyna 43x30 sm', raw_material_unit: 'dona', quantity_needed: 2, estimated_cost: 24000 },
  { id: 'bom14', product_id: 'p6', product_name: 'Twix 5 list', raw_material_id: 'rm11', raw_material_name: 'Faner 43x30 sm', raw_material_unit: 'dona', quantity_needed: 1, estimated_cost: 8500 },
  { id: 'bom15', product_id: 'p6', product_name: 'Twix 5 list', raw_material_id: 'rm13', raw_material_name: 'Koja (rulon)', raw_material_unit: 'metr', quantity_needed: 0.5, estimated_cost: 7500 },
  { id: 'bom16', product_id: 'p6', product_name: 'Twix 5 list', raw_material_id: 'rm14', raw_material_name: 'Kley vishka', raw_material_unit: 'dona', quantity_needed: 0.1, estimated_cost: 2500 },
];

// --- Orders ---
export const mockOrders: Order[] = [
  { id: 'o1', order_number: '#ORD-2024-102', client_id: 'c1', client_name: 'Alisher Usmanov', client_phone: '+998901111111', status: 'pending', total_price: 1_250_000, paid_amount: 500_000, payment_method: 'cash', created_at: '2024-08-09T10:30:00', updated_at: '2024-08-09T10:30:00' },
  { id: 'o2', order_number: '#ORD-2024-103', client_id: 'c2', client_name: 'Fotostudiya "Art"', client_phone: '+998902222222', status: 'printing', total_price: 4_500_000, paid_amount: 4_500_000, payment_method: 'transfer', created_at: '2024-08-08T14:00:00', updated_at: '2024-08-09T09:00:00' },
  { id: 'o3', order_number: '#ORD-2024-104', client_id: 'c3', client_name: 'Zarina M.', client_phone: '+998903333333', status: 'cutting', total_price: 850_000, paid_amount: 850_000, payment_method: 'card', created_at: '2024-08-07T16:45:00', updated_at: '2024-08-09T11:00:00' },
  { id: 'o4', order_number: '#ORD-2024-105', client_id: 'c4', client_name: 'Maktab #45 Admin', client_phone: '+998904444444', status: 'ready', total_price: 3_000_000, paid_amount: 2_000_000, payment_method: 'card', created_at: '2024-08-06T09:00:00', updated_at: '2024-08-09T15:00:00' },
  { id: 'o5', order_number: '#ORD-2024-106', client_id: 'c5', client_name: 'Mustaqil Fotograf', client_phone: '+998905555555', status: 'printing', total_price: 950_000, paid_amount: 950_000, payment_method: 'cash', created_at: '2024-08-09T08:00:00', updated_at: '2024-08-09T08:30:00' },
  { id: 'o6', order_number: '#ORD-2024-107', client_id: 'c6', client_name: 'Studio "Panorama"', client_phone: '+998906666666', status: 'gluing', total_price: 2_100_000, paid_amount: 2_100_000, payment_method: 'transfer', created_at: '2024-08-07T11:00:00', updated_at: '2024-08-09T13:00:00' },
  { id: 'o7', order_number: '#ORD-2024-108', client_id: 'c7', client_name: 'Shaxzod Wedding', client_phone: '+998907777777', status: 'packing', total_price: 1_740_000, paid_amount: 1_000_000, payment_method: 'cash', created_at: '2024-08-05T10:00:00', updated_at: '2024-08-09T16:00:00' },
  { id: 'o8', order_number: '#ORD-2024-109', client_id: 'c8', client_name: 'Dilshod Foto', client_phone: '+998908888888', status: 'delivered', total_price: 580_000, paid_amount: 580_000, payment_method: 'card', created_at: '2024-08-04T09:30:00', updated_at: '2024-08-08T17:00:00' },
  { id: 'o9', order_number: '#ORD-2024-110', client_id: 'c1', client_name: 'Alisher Usmanov', client_phone: '+998901111111', status: 'pending', total_price: 435_000, paid_amount: 0, payment_method: 'cash', created_at: '2024-08-09T15:00:00', updated_at: '2024-08-09T15:00:00' },
  { id: 'o10', order_number: '#ORD-2024-111', client_id: 'c6', client_name: 'Studio "Panorama"', client_phone: '+998906666666', status: 'pending', total_price: 870_000, paid_amount: 870_000, payment_method: 'transfer', created_at: '2024-08-09T16:30:00', updated_at: '2024-08-09T16:30:00' },
];

// --- Order Items ---
export const mockOrderItems: OrderItem[] = [
  { id: 'oi1', order_id: 'o1', product_id: 'p6', product_name: 'Twix 5 list - Premium', quantity: 8, unit_price: 145_000, total_price: 1_160_000 },
  { id: 'oi2', order_id: 'o1', product_id: 'p1', product_name: 'Plastik 3 list 30x40', quantity: 2, unit_price: 39_000, total_price: 78_000 },
  { id: 'oi3', order_id: 'o2', product_id: 'p3', product_name: 'A4 panorama 3 list', quantity: 50, unit_price: 84_000, total_price: 4_200_000 },
  { id: 'oi4', order_id: 'o3', product_id: 'p2', product_name: 'A4 oyna+koja 3 list', quantity: 10, unit_price: 74_000, total_price: 740_000 },
  { id: 'oi5', order_id: 'o4', product_id: 'p4', product_name: 'Twix 3 list', quantity: 30, unit_price: 115_000, total_price: 3_450_000 },
  { id: 'oi6', order_id: 'o5', product_id: 'p6', product_name: 'Twix 5 list', quantity: 6, unit_price: 145_000, total_price: 870_000 },
  { id: 'oi7', order_id: 'o6', product_id: 'p5', product_name: 'Twix 4 list', quantity: 15, unit_price: 130_000, total_price: 1_950_000 },
  { id: 'oi8', order_id: 'o7', product_id: 'p4', product_name: 'Twix 3 list', quantity: 12, unit_price: 115_000, total_price: 1_380_000 },
  { id: 'oi9', order_id: 'o8', product_id: 'p1', product_name: 'Plastik 3 list 30x40', quantity: 15, unit_price: 39_000, total_price: 585_000 },
];

// --- Order Attachments ---
export const mockOrderAttachments: OrderAttachment[] = [
  { id: 'oa1', order_id: 'o1', file_url: '/uploads/design_001.jpg', file_name: 'design_001.jpg', file_type: 'image/jpeg', description: 'Asosiy dizayn' },
  { id: 'oa2', order_id: 'o2', file_url: '/uploads/panorama_batch.pdf', file_name: 'panorama_batch.pdf', file_type: 'application/pdf', description: '50 ta panorama uchun PDF' },
  { id: 'oa3', order_id: 'o3', file_url: 'https://drive.google.com/file/d/abc123', file_name: 'Google Drive havola', file_type: 'url', description: 'To\'y rasmlari' },
];

// --- Production Stages ---
export const mockProductionStages: ProductionStage[] = [
  // Order o1 — pending
  { id: 'ps1', order_id: 'o1', order_number: '#ORD-2024-102', stage_name: 'printing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', kpi_amount: 5000, status: 'waiting' },
  // Order o2 — printing
  { id: 'ps2', order_id: 'o2', order_number: '#ORD-2024-103', stage_name: 'printing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-09T09:00:00', kpi_amount: 25000, status: 'in_progress' },
  // Order o3 — cutting
  { id: 'ps3', order_id: 'o3', order_number: '#ORD-2024-104', stage_name: 'printing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-08T10:00:00', completed_at: '2024-08-08T14:00:00', kpi_amount: 5000, status: 'completed' },
  { id: 'ps4', order_id: 'o3', order_number: '#ORD-2024-104', stage_name: 'cutting', assigned_user_id: 'u5', assigned_user_name: 'Sardor Mahmudov', started_at: '2024-08-09T09:00:00', kpi_amount: 4000, status: 'in_progress' },
  // Order o6 — gluing
  { id: 'ps5', order_id: 'o6', order_number: '#ORD-2024-107', stage_name: 'printing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-07T11:00:00', completed_at: '2024-08-07T16:00:00', kpi_amount: 7500, status: 'completed' },
  { id: 'ps6', order_id: 'o6', order_number: '#ORD-2024-107', stage_name: 'cutting', assigned_user_id: 'u5', assigned_user_name: 'Sardor Mahmudov', started_at: '2024-08-08T09:00:00', completed_at: '2024-08-08T13:00:00', kpi_amount: 6000, status: 'completed' },
  { id: 'ps7', order_id: 'o6', order_number: '#ORD-2024-107', stage_name: 'gluing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-09T10:00:00', kpi_amount: 7500, status: 'in_progress' },
  // Order o7 — packing
  { id: 'ps8', order_id: 'o7', order_number: '#ORD-2024-108', stage_name: 'packing', assigned_user_id: 'u5', assigned_user_name: 'Sardor Mahmudov', started_at: '2024-08-09T14:00:00', kpi_amount: 6000, status: 'in_progress' },
  // Order o4 — ready (all done)
  { id: 'ps9', order_id: 'o4', order_number: '#ORD-2024-105', stage_name: 'printing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-06T09:00:00', completed_at: '2024-08-06T16:00:00', kpi_amount: 15000, status: 'completed' },
  { id: 'ps10', order_id: 'o4', order_number: '#ORD-2024-105', stage_name: 'cutting', assigned_user_id: 'u5', assigned_user_name: 'Sardor Mahmudov', started_at: '2024-08-07T09:00:00', completed_at: '2024-08-07T14:00:00', kpi_amount: 12000, status: 'completed' },
  { id: 'ps11', order_id: 'o4', order_number: '#ORD-2024-105', stage_name: 'gluing', assigned_user_id: 'u4', assigned_user_name: 'Jasur Umarov', started_at: '2024-08-08T09:00:00', completed_at: '2024-08-08T15:00:00', kpi_amount: 15000, status: 'completed' },
  { id: 'ps12', order_id: 'o4', order_number: '#ORD-2024-105', stage_name: 'packing', assigned_user_id: 'u5', assigned_user_name: 'Sardor Mahmudov', started_at: '2024-08-09T09:00:00', completed_at: '2024-08-09T11:00:00', kpi_amount: 9000, status: 'completed' },
];

// --- Inventory Logs ---
export const mockInventoryLogs: InventoryLog[] = [
  { id: 'il1', item_id: 'rm1', item_name: 'Lucky Crystal Paper', quantity_change: 500, type: 'in', reference_type: 'purchase', notes: 'Lucky Paper Co. dan kirim', created_by: 'Bekzod Raximov', date: '2024-08-09T08:00:00' },
  { id: 'il2', item_id: 'rm12', item_name: 'Plastik 45x31', quantity_change: 400, type: 'in', reference_type: 'purchase', notes: '1 karobka = 400 dona kirim', created_by: 'Bekzod Raximov', date: '2024-08-08T10:00:00' },
  { id: 'il3', item_id: 'rm2', item_name: 'Fujifilm Glossy A4', quantity_change: -150, type: 'out', reference_id: 'o2', reference_type: 'production', notes: 'Buyurtma #103 uchun sarflandi', created_by: 'System', date: '2024-08-09T09:00:00' },
  { id: 'il4', item_id: 'rm6', item_name: 'Oyna 12x24 sm', quantity_change: -5, type: 'scrap', reference_type: 'scrap', notes: 'Singan — brak akti #B-0012', created_by: 'Bekzod Raximov', date: '2024-08-08T15:00:00' },
  { id: 'il5', item_id: 'rm5', item_name: 'Oyna 19x30 sm', quantity_change: -10, type: 'reserve', reference_id: 'o3', reference_type: 'production', notes: 'Buyurtma #104 uchun zaxira', created_by: 'System', date: '2024-08-07T17:00:00' },
  { id: 'il6', item_id: 'rm13', item_name: 'Koja (rulon)', quantity_change: 100, type: 'in', reference_type: 'purchase', notes: '1 rulon = 100 metr kirim', created_by: 'Bekzod Raximov', date: '2024-08-07T09:00:00' },
  { id: 'il7', item_id: 'rm14', item_name: 'Kley vishka', quantity_change: -2, type: 'scrap', reference_type: 'scrap', notes: 'Muddati o\'tgan — brak akti #B-0013', created_by: 'Bekzod Raximov', date: '2024-08-06T11:00:00' },
  { id: 'il8', item_id: 'rm12', item_name: 'Plastik 45x31', quantity_change: -50, type: 'out', reference_id: 'o4', reference_type: 'production', notes: 'Buyurtma #105 uchun sarflandi', created_by: 'System', date: '2024-08-06T10:00:00' },
];

// --- Transactions ---
export const mockTransactions: Transaction[] = [
  { id: 't1', amount: 500_000, type: 'income', payment_method: 'cash', reference_id: 'o1', reference_type: 'order', description: 'Buyurtma #102 — avans', created_by: 'Nodira Toshmatova', date: '2024-08-09T10:30:00' },
  { id: 't2', amount: 4_500_000, type: 'income', payment_method: 'transfer', reference_id: 'o2', reference_type: 'order', description: 'Buyurtma #103 — to\'liq to\'lov', created_by: 'Nodira Toshmatova', date: '2024-08-08T14:00:00' },
  { id: 't3', amount: 850_000, type: 'income', payment_method: 'card', reference_id: 'o3', reference_type: 'order', description: 'Buyurtma #104 — to\'liq to\'lov', created_by: 'Dilnoza Ahmedova', date: '2024-08-07T16:45:00' },
  { id: 't4', amount: 2_000_000, type: 'income', payment_method: 'card', reference_id: 'o4', reference_type: 'order', description: 'Buyurtma #105 — qisman to\'lov', created_by: 'Nodira Toshmatova', date: '2024-08-06T09:00:00' },
  { id: 't5', amount: 3_500_000, type: 'expense', payment_method: 'transfer', reference_type: 'purchase', description: 'Fujifilm dan xomashyo xaridi', created_by: 'Alisher Karimov', date: '2024-08-08T11:00:00' },
  { id: 't6', amount: 1_200_000, type: 'expense', payment_method: 'cash', reference_type: 'salary', description: 'Xodimlar uchun avans to\'lov', created_by: 'Alisher Karimov', date: '2024-08-07T17:00:00' },
  { id: 't7', amount: 210_000, type: 'expense', payment_method: 'cash', reference_type: 'scrap', description: 'Brak zarari — Oyna sinishi', created_by: 'System', date: '2024-08-08T15:00:00' },
  { id: 't8', amount: 580_000, type: 'income', payment_method: 'card', reference_id: 'o8', reference_type: 'order', description: 'Buyurtma #109 — to\'liq to\'lov', created_by: 'Dilnoza Ahmedova', date: '2024-08-04T09:30:00' },
  { id: 't9', amount: 950_000, type: 'income', payment_method: 'cash', reference_id: 'o5', reference_type: 'order', description: 'Buyurtma #106 — to\'liq to\'lov', created_by: 'Nodira Toshmatova', date: '2024-08-09T08:00:00' },
  { id: 't10', amount: 800_000, type: 'expense', payment_method: 'transfer', reference_type: 'purchase', description: 'Plastik 45x31 — 2 karobka xaridi', created_by: 'Alisher Karimov', date: '2024-08-08T09:00:00' },
];

// --- Dashboard Stats ---
export const mockDashboardStats: DashboardStats = {
  daily_sales: 45_250_000,
  daily_sales_change: 12,
  active_orders: 142,
  orders_in_production: 87,
  cash_balance: 128_400_000,
  low_stock_count: 8,
};

// --- Sales Data (Last 7 Days) ---
export const mockSalesData: SalesDataPoint[] = [
  { day: 'Dush', amount: 38_000_000 },
  { day: 'Sesh', amount: 42_000_000 },
  { day: 'Chor', amount: 35_000_000 },
  { day: 'Pay', amount: 48_000_000 },
  { day: 'Jum', amount: 52_000_000 },
  { day: 'Shan', amount: 45_000_000 },
  { day: 'Yak', amount: 45_250_000 },
];

// --- Top Products ---
export const mockTopProducts: TopProduct[] = [
  { name: 'Twix 5 list', percentage: 45, color: '#2563EB' },
  { name: 'A4 Panorama', percentage: 30, color: '#1E293B' },
  { name: 'Plastik 3 list', percentage: 25, color: '#D97706' },
];

// --- Low Stock Alerts ---
export const mockLowStockAlerts: LowStockAlert[] = [
  { item_id: 'rm4', item_name: 'Oyna 9x30 sm', current_stock: 85, min_stock_level: 100, unit: 'dona' },
  { item_id: 'rm6', item_name: 'Oyna 12x24 sm', current_stock: 45, min_stock_level: 60, unit: 'dona' },
  { item_id: 'rm10', item_name: 'Faner 29x30 sm', current_stock: 38, min_stock_level: 40, unit: 'dona' },
  { item_id: 'rm14', item_name: 'Kley vishka', current_stock: 8, min_stock_level: 10, unit: 'dona' },
];

// --- KPI Summaries ---
export const mockKpiSummaries: KpiSummary[] = [
  { user_id: 'u4', user_name: 'Jasur Umarov', role: 'worker', base_salary: 2_000_000, total_kpi: 75_000, completed_stages: 15, period: '2024-08' },
  { user_id: 'u5', user_name: 'Sardor Mahmudov', role: 'worker', base_salary: 2_000_000, total_kpi: 37_000, completed_stages: 8, period: '2024-08' },
];
