import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FuelType,
  Pump,
  Tank,
  DailyReading,
  Customer,
  CreditTransaction,
  Worker,
  SalaryPayment,
  StoreItem,
  StoreSale,
  TaxRecord,
  AppSettings,
} from '../types';

interface GasStationState {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Fuel Management
  fuelTypes: FuelType[];
  pumps: Pump[];
  tanks: Tank[];
  dailyReadings: DailyReading[];
  addFuelType: (fuelType: Omit<FuelType, 'id'>) => void;
  updateFuelType: (id: string, updates: Partial<FuelType>) => void;
  deleteFuelType: (id: string) => void;
  addPump: (pump: Omit<Pump, 'id'>) => void;
  updatePump: (id: string, updates: Partial<Pump>) => void;
  deletePump: (id: string) => void;
  addTank: (tank: Omit<Tank, 'id'>) => void;
  updateTank: (id: string, updates: Partial<Tank>) => void;
  deleteTank: (id: string) => void;
  addDailyReading: (reading: Omit<DailyReading, 'id' | 'createdAt'>) => void;
  updatePumpReading: (pumpId: string, currentReading: number) => void;
  updateTankLevel: (tankId: string, newLevel: number) => void;
  refillTank: (tankId: string, amount: number) => void;
  recordSale: (pumpId: string, liters: number, amount: number) => void;

  // Customer Management
  customers: Customer[];
  creditTransactions: CreditTransaction[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  addCreditTransaction: (transaction: Omit<CreditTransaction, 'id' | 'createdAt'>) => void;
  updateCustomerDebt: (customerId: string, amount: number) => void;

  // Worker Management
  workers: Worker[];
  salaryPayments: SalaryPayment[];
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  addSalaryPayment: (payment: Omit<SalaryPayment, 'id'>) => void;
  updateWorker: (workerId: string, updates: Partial<Worker>) => void;

  // Store Management
  storeItems: StoreItem[];
  storeSales: StoreSale[];
  addStoreItem: (item: Omit<StoreItem, 'id'>) => void;
  addStoreSale: (sale: Omit<StoreSale, 'id'>) => void;
  updateStoreItem: (itemId: string, updates: Partial<StoreItem>) => void;
  deleteStoreItem: (itemId: string) => void;

  // Tax Management
  taxRecords: TaxRecord[];
  addTaxRecord: (record: Omit<TaxRecord, 'id'>) => void;
  updateTaxRecord: (recordId: string, updates: Partial<TaxRecord>) => void;

  // Utility functions
  getDashboardMetrics: () => any;
  exportData: () => string;
  importData: (data: string) => void;
  resetData: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialFuelTypes: FuelType[] = [
  { id: '1', name: { ar: 'بنزين 91', fr: 'Essence 91' }, pricePerLiter: 2.5, color: '#3b82f6' },
  { id: '2', name: { ar: 'بنزين 95', fr: 'Essence 95' }, pricePerLiter: 2.8, color: '#10b981' },
  { id: '3', name: { ar: 'ديزل', fr: 'Diesel' }, pricePerLiter: 2.2, color: '#f59e0b' },
  { id: '4', name: { ar: 'كيروسين', fr: 'Kérosène' }, pricePerLiter: 1.8, color: '#6366f1' },
];

const initialPumps: Pump[] = [
  { id: 'pump-1', number: 1, name: 'مضخة 1', fuelType: '1', tankId: 'tank-1', previousReading: 5000, currentReading: 5250, buyPrice: 45.50, sellPrice: 48.00, isActive: true, dailySales: { liters: 250, amount: 12000 } },
  { id: 'pump-2', number: 2, name: 'مضخة 2', fuelType: '2', tankId: 'tank-2', previousReading: 4800, currentReading: 5100, buyPrice: 47.50, sellPrice: 50.00, isActive: true, dailySales: { liters: 300, amount: 15000 } },
  { id: 'pump-3', number: 3, name: 'مضخة 3', fuelType: '3', tankId: 'tank-3', previousReading: 6200, currentReading: 6450, buyPrice: 42.00, sellPrice: 44.50, isActive: true, dailySales: { liters: 250, amount: 11125 } },
  { id: 'pump-4', number: 4, name: 'مضخة 4', fuelType: '1', tankId: 'tank-1', previousReading: 5500, currentReading: 5750, buyPrice: 45.50, sellPrice: 48.00, isActive: true, dailySales: { liters: 250, amount: 12000 } },
  { id: 'pump-5', number: 5, name: 'مضخة 5', fuelType: '2', tankId: 'tank-2', previousReading: 4900, currentReading: 5200, buyPrice: 47.50, sellPrice: 50.00, isActive: true, dailySales: { liters: 300, amount: 15000 } },
  { id: 'pump-6', number: 6, name: 'مضخة 6', fuelType: '3', tankId: 'tank-3', previousReading: 6000, currentReading: 6300, buyPrice: 42.00, sellPrice: 44.50, isActive: true, dailySales: { liters: 300, amount: 13350 } },
  { id: 'pump-7', number: 7, name: 'مضخة 7', fuelType: '4', tankId: 'tank-4', previousReading: 3800, currentReading: 4100, buyPrice: 38.00, sellPrice: 40.50, isActive: true, dailySales: { liters: 300, amount: 12150 } },
];

const initialTanks: Tank[] = [
  {
    id: 'tank-1',
    name: 'خزان البنزين 91',
    capacity: 10000,
    currentLevel: 7500,
    fuelType: '1', // تطابق مع معرف نوع الوقود
    minLevel: 1000,
    isActive: true,
    lastRefill: new Date(),
  },
  {
    id: 'tank-2', 
    name: 'خزان البنزين 95',
    capacity: 8000,
    currentLevel: 5200,
    fuelType: '2', // تطابق مع معرف نوع الوقود
    minLevel: 800,
    isActive: true,
    lastRefill: new Date(),
  },
  {
    id: 'tank-3',
    name: 'خزان الديزل',
    capacity: 12000,
    currentLevel: 3500,
    fuelType: '3', // تطابق مع معرف نوع الوقود
    minLevel: 1200,
    isActive: true,
    lastRefill: new Date(),
  },
  {
    id: 'tank-4',
    name: 'خزان الكيروسين',
    capacity: 6000,
    currentLevel: 4800,
    fuelType: '4', // تطابق مع معرف نوع الوقود
    minLevel: 600,
    isActive: true,
    lastRefill: new Date(),
  },
];

const initialStoreItems: StoreItem[] = [
  { id: '1', name: { ar: 'زيت محرك', fr: 'Huile moteur' }, price: 25, stock: 50, category: 'automotive' },
  { id: '2', name: { ar: 'مياه معبأة', fr: 'Eau en bouteille' }, price: 1.5, stock: 200, category: 'beverages' },
  { id: '3', name: { ar: 'غاز الطهي', fr: 'Gaz de cuisine' }, price: 15, stock: 30, category: 'gas' },
];

export const useGasStationStore = create<GasStationState>((set, get) => ({
  // Settings
  settings: {
    language: 'ar',
    theme: 'light',
    currency: 'DZD',
    taxRate: 15,
    zakatRate: 2.5,
    backupFrequency: 'daily',
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  // Initial data
  fuelTypes: initialFuelTypes,
  pumps: initialPumps,
  tanks: initialTanks,
  dailyReadings: [],
  customers: [],
  creditTransactions: [],
  workers: [],
  salaryPayments: [],
  storeItems: initialStoreItems,
  storeSales: [],
  taxRecords: [],

  // Fuel Management Functions
  addFuelType: (fuelType) =>
    set((state) => ({
      fuelTypes: [
        ...state.fuelTypes,
        {
          ...fuelType,
          id: fuelType.id || `fuel-${Date.now()}`,
        },
      ],
    })),

  updateFuelType: (id, updates) =>
    set((state) => ({
      fuelTypes: state.fuelTypes.map((fuelType) =>
        fuelType.id === id ? { ...fuelType, ...updates } : fuelType
      ),
    })),

  deleteFuelType: (id) =>
    set((state) => ({
      fuelTypes: state.fuelTypes.filter((fuelType) => fuelType.id !== id),
    })),

  addPump: (pump) =>
    set((state) => ({
      pumps: [
        ...state.pumps,
        {
          ...pump,
          id: pump.id || `pump-${Date.now()}`,
        },
      ],
    })),

  updatePump: (id, updates) =>
    set((state) => ({
      pumps: state.pumps.map((pump) =>
        pump.id === id ? { ...pump, ...updates } : pump
      ),
    })),

  deletePump: (id) =>
    set((state) => ({
      pumps: state.pumps.filter((pump) => pump.id !== id),
    })),

  // إدارة الخزانات
  addTank: (tank) => {
    const newTank: Tank = {
      ...tank,
      id: tank.id || `tank-${Date.now()}`,
    };
    set((state) => ({
      tanks: [...state.tanks, newTank],
    }));
  },

  updateTank: (id, updates) => {
    set((state) => ({
      tanks: state.tanks.map((tank) =>
        tank.id === id ? { ...tank, ...updates } : tank
      ),
    }));
  },

  deleteTank: (id) => {
    set((state) => ({
      tanks: state.tanks.filter((tank) => tank.id !== id),
    }));
  },

  updateTankLevel: (tankId, newLevel) => {
    set((state) => ({
      tanks: state.tanks.map((tank) =>
        tank.id === tankId ? { ...tank, currentLevel: newLevel } : tank
      ),
    }));
  },

  refillTank: (tankId, amount) => {
    set((state) => ({
      tanks: state.tanks.map((tank) =>
        tank.id === tankId 
          ? { 
              ...tank, 
              currentLevel: Math.min(tank.currentLevel + amount, tank.capacity),
              lastRefill: new Date()
            } 
          : tank
      ),
    }));
  },

  // Fuel Management
  addDailyReading: (reading) =>
    set((state) => ({
      dailyReadings: [
        ...state.dailyReadings,
        {
          ...reading,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updatePumpReading: (pumpId, currentReading) =>
    set((state) => {
      const pump = state.pumps.find(p => p.id === pumpId);
      if (!pump) return state;
      
      const litersSold = currentReading - pump.currentReading;
      
      // تحديث مستوى الخزان المرتبط بالمضخة
      const updatedTanks = state.tanks.map((tank) =>
        tank.id === pump.tankId
          ? { ...tank, currentLevel: Math.max(0, tank.currentLevel - litersSold) }
          : tank
      );
      
      return {
        pumps: state.pumps.map((p) =>
          p.id === pumpId
            ? { ...p, previousReading: p.currentReading, currentReading }
            : p
        ),
        tanks: updatedTanks,
      };
    }),

  recordSale: (pumpId, liters, amount) =>
    set((state) => {
      const pump = state.pumps.find(p => p.id === pumpId);
      if (!pump) return state;

      // تحديث إحصائيات المضخة اليومية
      const updatedPumps = state.pumps.map((p) =>
        p.id === pumpId
          ? {
              ...p,
              dailySales: {
                liters: (p.dailySales?.liters || 0) + liters,
                amount: (p.dailySales?.amount || 0) + amount,
              },
            }
          : p
      );

      // تحديث مستوى الخزان
      const updatedTanks = state.tanks.map((tank) =>
        tank.id === pump.tankId
          ? { ...tank, currentLevel: Math.max(0, tank.currentLevel - liters) }
          : tank
      );

      // إضافة قراءة يومية
      const newReading: DailyReading = {
        id: generateId(),
        pumpId,
        date: new Date().toISOString().split('T')[0],
        previousReading: pump.currentReading || 0,
        currentReading: (pump.currentReading || 0) + liters,
        litersSold: liters,
        amount,
        createdAt: new Date().toISOString(),
      };

      return {
        pumps: updatedPumps,
        tanks: updatedTanks,
        dailyReadings: [...state.dailyReadings, newReading],
      };
    }),

  // Customer Management
  addCustomer: (customer) =>
    set((state) => ({
      customers: [
        ...state.customers,
        {
          ...customer,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  addCreditTransaction: (transaction) =>
    set((state) => ({
      creditTransactions: [
        ...state.creditTransactions,
        {
          ...transaction,
          id: generateId(),
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateCustomerDebt: (customerId, amount) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, totalDebt: (customer.totalDebt || 0) + amount }
          : customer
      ),
    })),

  // Worker Management
  addWorker: (worker) =>
    set((state) => ({
      workers: [
        ...state.workers,
        {
          ...worker,
          id: generateId(),
        },
      ],
    })),

  addSalaryPayment: (payment) =>
    set((state) => ({
      salaryPayments: [
        ...state.salaryPayments,
        {
          ...payment,
          id: generateId(),
        },
      ],
    })),

  updateWorker: (workerId, updates) =>
    set((state) => ({
      workers: state.workers.map((worker) =>
        worker.id === workerId ? { ...worker, ...updates } : worker
      ),
    })),

  // Store Management
  addStoreItem: (item) =>
    set((state) => ({
      storeItems: [
        ...state.storeItems,
        {
          ...item,
          id: generateId(),
        },
      ],
    })),

  addStoreSale: (sale) =>
    set((state) => ({
      storeSales: [
        ...state.storeSales,
        {
          ...sale,
          id: generateId(),
        },
      ],
    })),

  updateStoreItem: (itemId, updates) =>
    set((state) => ({
      storeItems: state.storeItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    })),

  deleteStoreItem: (itemId) =>
    set((state) => ({
      storeItems: state.storeItems.filter((item) => item.id !== itemId),
    })),

  // Tax Management
  addTaxRecord: (record) =>
    set((state) => ({
      taxRecords: [
        ...state.taxRecords,
        {
          ...record,
          id: generateId(),
        },
      ],
    })),

  updateTaxRecord: (recordId, updates) =>
    set((state) => ({
      taxRecords: state.taxRecords.map((record) =>
        record.id === recordId ? { ...record, ...updates } : record
      ),
    })),

  // Utility functions
  getDashboardMetrics: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    
    const todayReadings = state.dailyReadings.filter(r => r.date === today);
    const dailyFuelSales = todayReadings.reduce((sum, r) => sum + r.litersSold, 0);
    
    // Calculate revenue using pump's sell price instead of fuel type price
    const dailyRevenue = todayReadings.reduce((sum, reading) => {
      const pump = state.pumps.find(p => p.id === reading.pumpId);
      return sum + (reading.litersSold * (pump?.sellPrice || 0));
    }, 0);
    
    const todayStoreSales = state.storeSales.filter(s => s.date === today);
    const dailyStoreSales = todayStoreSales.reduce((sum, s) => sum + s.total, 0);
    
    const totalDebts = state.customers.reduce((sum, c) => sum + c.currentDebt, 0);
    
    // Calculate profit using buy/sell price difference
    const dailyProfit = todayReadings.reduce((sum, reading) => {
      const pump = state.pumps.find(p => p.id === reading.pumpId);
      const profitPerLiter = (pump?.sellPrice || 0) - (pump?.buyPrice || 0);
      return sum + (reading.litersSold * profitPerLiter);
    }, 0);
    
    return {
      dailyFuelSales,
      dailyRevenue,
      dailyProfit,
      totalDebts,
      dailyStoreSales,
      tankLevels: state.tanks,
      lowStockAlerts: state.storeItems.filter(item => item.stock < 10).length,
    };
  },

  exportData: () => {
    const state = get();
    return JSON.stringify({
      settings: state.settings,
      fuelTypes: state.fuelTypes,
      pumps: state.pumps,
      tanks: state.tanks,
      dailyReadings: state.dailyReadings,
      customers: state.customers,
      creditTransactions: state.creditTransactions,
      workers: state.workers,
      salaryPayments: state.salaryPayments,
      storeItems: state.storeItems,
      storeSales: state.storeSales,
      taxRecords: state.taxRecords,
      exportDate: new Date().toISOString(),
    });
  },

  importData: (data) => {
    try {
      const parsed = JSON.parse(data);
      set(parsed);
    } catch (error) {
      console.error('Failed to import data:', error);
    }
  },

  resetData: () =>
    set({
      dailyReadings: [],
      customers: [],
      creditTransactions: [],
      workers: [],
      salaryPayments: [],
      storeSales: [],
      taxRecords: [],
      pumps: initialPumps,
      tanks: initialTanks,
      storeItems: initialStoreItems,
    }),
}));

// ... keep existing persist configuration ...