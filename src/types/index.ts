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
  fuelType: string;
  tankId: string; // إضافة معرف الخزان
  buyPrice: number;
  sellPrice: number;
  previousReading: number;
  currentReading: number;
  isActive: boolean;
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
  revenue: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  currentDebt: number;
  createdAt: string;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  type: 'debt' | 'payment';
  amount: number;
  description: string;
  date: string;
  transactionId?: string;
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  position: { ar: string; fr: string };
  salary: number;
  hireDate: string;
  isActive: boolean;
}

export interface SalaryPayment {
  id: string;
  workerId: string;
  amount: number;
  period: string;
  date: string;
  notes?: string;
}

export interface StoreItem {
  id: string;
  name: { ar: string; fr: string };
  price: number;
  stock: number;
  category: string;
}

export interface StoreSale {
  id: string;
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
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
}

export interface DashboardMetrics {
  dailyFuelSales: number;
  dailyRevenue: number;
  dailyProfit: number;
  totalDebts: number;
  dailyStoreSales: number;
  tankLevels: Tank[];
  lowStockAlerts: number;
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
}