// Core data types for the gas station management system

export interface FuelType {
  id: string;
  name: { ar: string; fr: string };
  pricePerLiter: number;
  color: string;
}

export interface Pump {
  id: string;
  name: string;
  number: number;
  fuelType: string; // معرف نوع الوقود
  tankId: string; // معرف الخزان المرتبط
  buyPrice: number; // سعر الشراء
  sellPrice: number; // سعر البيع
  previousReading: number;
  currentReading: number;
  isActive: boolean;
  dailySales?: {
    liters: number;
    amount: number;
  };
}

export interface Tank {
  id: string;
  name: string;
  capacity: number; // السعة الكاملة باللتر
  currentLevel: number; // المستوى الحالي باللتر
  fuelType: string; // معرف نوع الوقود
  minLevel: number; // الحد الأدنى للتنبيه
  isActive: boolean;
  lastRefill?: Date;
}

export interface DailyReading {
  id: string;
  date: string;
  pumpId: string;
  previousReading: number;
  currentReading: number;
  litersSold: number;
  amount: number; // المبلغ الإجمالي
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  currentDebt: number;
  totalDebt: number; // إجمالي الديون
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  type: 'debt' | 'payment';
  amount: number;
  description: string;
  date: string;
  // إضافة طريقة الدفع لتحديد إن كانت نقداً أو شيك/تحويل
  paymentMethod?: 'cash' | 'cheque' | 'bank_transfer';
  transactionId?: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  position: string;
  salary: number;
  phone?: string;
  address?: string;
  hireDate: string;
  status: 'active' | 'inactive';
}

export interface SalaryPayment {
  id: string;
  workerId: string;
  amount: number;
  month: string; // رقم الشهر أو 'advance' للمصاريف المسبقة
  year: number;
  date: string;
  notes?: string;
}

export interface StoreItem {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  unit: 'unit' | 'liter' | 'kg';
  category?: string;
  minStock?: number;
}

export interface StoreSale {
  id: string;
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  total: number;
  date: string;
  paymentMethod: 'cash' | 'credit';
  customerId?: string;
  transactionId?: string;
}

export interface TaxRecord {
  id: string;
  type: 'tax' | 'zakat';
  amount: number;
  period: string;
  dueDate: string;
  paidDate?: string;
  status: 'pending' | 'paid';
  description?: string;
}

export interface DashboardMetrics {
  dailyFuelSales: number;
  dailyRevenue: number;
  dailyProfit: number;
  totalDebts: number;
  dailyStoreSales: number;
  tankLevels: Tank[];
  lowStockAlerts: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export interface Language {
  code: 'ar' | 'fr';
  name: string;
  direction: 'rtl' | 'ltr';
}

export interface AppSettings {
  language: 'ar' | 'fr';
  theme: 'light' | 'dark';
  currency: string;
  taxRate: number;
  zakatRate: number;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  stationName?: string;
  stationAddress?: string;
  ownerName?: string;
}

export interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'internet' | 'phone' | 'insurance' | 'rent' | 'fuel' | 'other';
  provider: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
  paymentDate?: string;
  paymentMethod?: 'cash' | 'card' | 'bank_transfer';
  notes?: string;
}

// تقارير مالية
export interface FinancialReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  period: string;
  fuelSales: {
    totalLiters: number;
    totalRevenue: number;
    totalProfit: number;
    byFuelType: Array<{
      fuelTypeId: string;
      liters: number;
      revenue: number;
      profit: number;
    }>;
  };
  storeSales: {
    totalRevenue: number;
    totalProfit: number;
    itemsSold: number;
  };
  expenses: {
    salaries: number;
    taxes: number;
    other: number;
    total: number;
  };
  netProfit: number;
  createdAt: string;
}

// إحصائيات المضخات
export interface PumpStatistics {
  pumpId: string;
  period: string;
  totalLiters: number;
  totalRevenue: number;
  totalProfit: number;
  averageDaily: number;
  efficiency: number; // نسبة الاستخدام
}

// تقرير المخزون
export interface InventoryReport {
  id: string;
  date: string;
  fuelInventory: Array<{
    tankId: string;
    fuelType: string;
    currentLevel: number;
    capacity: number;
    percentage: number;
    daysRemaining: number;
  }>;
  storeInventory: Array<{
    itemId: string;
    name: string;
    currentStock: number;
    minStock: number;
    status: 'ok' | 'low' | 'out';
  }>;
}