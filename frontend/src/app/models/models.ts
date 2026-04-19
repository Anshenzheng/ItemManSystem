export interface Product {
  id?: number;
  productCode: string;
  name: string;
  category?: string;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  stock?: number;
  lowStockThreshold?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id?: number;
  orderId?: number;
  product: Product;
  productCode?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  createdAt?: string;
}

export interface Order {
  id?: number;
  orderNo?: string;
  customerName?: string;
  customerPhone?: string;
  totalAmount?: number;
  orderDate?: string;
  status?: string;
  remark?: string;
  orderItems: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStockCount: number;
  totalInventoryValue: number;
}

export interface DashboardData {
  totalProducts: number;
  todayOrders: number;
  todaySales: number;
  lowStockCount: number;
  inventorySummary: InventorySummary;
}

export interface Notification {
  hasLowStock: boolean;
  lowStockCount: number;
}
