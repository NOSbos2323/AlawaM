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

interface GasStationStore {
  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Fuel Management
  fuelTypes: FuelType[];
  pumps: Pump[];
  tanks: Tank[];
  dailyReadings: DailyReading[];
  addDailyReading: (reading: Omit<DailyReading, 'id' | 'createdAt'>) => void;
  updatePumpReading: (pumpId: string, currentReading: number) => void;
  updateTankLevel: (tankId: string, newLevel: number) => void;

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

const initialPumps: Pump[] = Array.from({ length: 7 }, (_, i) => ({
  id: `pump-${i + 1}`,
  number: i + 1,
  fuelType: initialFuelTypes[i % 4].id,
  previousReading: Math.floor(Math.random() * 10000),
  currentReading: Math.floor(Math.random() * 10000) + 10000,
  isActive: true,
}));

const initialTanks: Tank[] = [
  { id: 'tank-1', name: 'A', fuelType: '1', capacity: 20000, currentLevel: 12500, minLevel: 2000, color: '#3b82f6' },
  { id: 'tank-2', name: 'B', fuelType: '2', capacity: 15000, currentLevel: 8000, minLevel: 1500, color: '#10b981' },
  { id: 'tank-3', name: 'C', fuelType: '3', capacity: 10000, currentLevel: 3000, minLevel: 1000, color: '#f59e0b' },
  { id: 'tank-4', name: 'D', fuelType: '4', capacity: 10000, currentLevel: 5000, minLevel: 1000, color: '#6366f1' },
];

const initialStoreItems: StoreItem[] = [
  { id: '1', name: { ar: 'زيت محرك', fr: 'Huile moteur' }, price: 25, stock: 50, category: 'automotive' },
  { id: '2', name: { ar: 'مياه معبأة', fr: 'Eau en bouteille' }, price: 1.5, stock: 200, category: 'beverages' },
  { id: '3', name: { ar: 'غاز الطبخ', fr: 'Gaz de cuisine' }, price: 15, stock: 30, category: 'gas' },
];

export const useGasStationStore = create<GasStationStore>()(
  persist(
    (set, get) => ({
      // Settings
      settings: {
        language: 'ar',
        theme: 'light',
        currency: 'SAR',
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
        set((state) => ({
          pumps: state.pumps.map((pump) =>
            pump.id === pumpId
              ? { ...pump, previousReading: pump.currentReading, currentReading }
              : pump
          ),
        })),

      updateTankLevel: (tankId, newLevel) =>
        set((state) => ({
          tanks: state.tanks.map((tank) =>
            tank.id === tankId ? { ...tank, currentLevel: newLevel } : tank
          ),
        })),

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
              ? { ...customer, currentDebt: customer.currentDebt + amount }
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
        const dailyRevenue = todayReadings.reduce((sum, r) => sum + r.revenue, 0);
        
        const todayStoreSales = state.storeSales.filter(s => s.date === today);
        const dailyStoreSales = todayStoreSales.reduce((sum, s) => sum + s.total, 0);
        
        const totalDebts = state.customers.reduce((sum, c) => sum + c.currentDebt, 0);
        
        return {
          dailyFuelSales,
          dailyRevenue,
          dailyProfit: dailyRevenue * 0.3, // Assuming 30% profit margin
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
    }),
    {
      name: 'gas-station-storage',
    }
  )
);