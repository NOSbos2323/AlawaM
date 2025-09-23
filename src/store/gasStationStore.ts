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
  FinancialReport,
  PumpStatistics,
  InventoryReport,
  Bill,
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
  addCustomer: (customer: Omit<Customer, 'createdAt'> & { id?: string }) => void;
  addCreditTransaction: (transaction: Omit<CreditTransaction, 'createdAt'> & { id?: string }) => void;
  updateCustomerDebt: (customerId: string, amount: number) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  deleteCustomer: (customerId: string) => void;

  // Worker Management
  workers: Worker[];
  salaryPayments: SalaryPayment[];
  addWorker: (worker: Omit<Worker, 'id'>) => void;
  addSalaryPayment: (payment: Omit<SalaryPayment, 'id'>) => void;
  updateWorker: (workerId: string, updates: Partial<Worker>) => void;
  deleteWorker: (workerId: string) => void;

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
  deleteTaxRecord: (recordId: string) => void;

  // Bill Management
  bills: Bill[];
  addBill: (bill: Omit<Bill, 'id'>) => void;
  updateBill: (billId: string, updates: Partial<Bill>) => void;
  deleteBill: (billId: string) => void;
  payBill: (billId: string, paymentMethod: string, notes?: string) => void;

  // Reports
  financialReports: FinancialReport[];
  generateFinancialReport: (type: 'daily' | 'weekly' | 'monthly' | 'yearly', period: string) => FinancialReport;
  getPumpStatistics: (pumpId: string, period: string) => PumpStatistics;
  getInventoryReport: () => InventoryReport;

  // Utility functions
  getDashboardMetrics: () => any;
  exportData: () => string;
  importData: (data: string) => void;
  resetData: () => void;
  backupData: () => void;
  restoreData: (backupData: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// البيانات الأولية المحدثة
// تصفير جميع البيانات التجريبية
const initialFuelTypes: FuelType[] = [];

const initialTanks: Tank[] = [];

const initialPumps: Pump[] = [];

const initialStoreItems: StoreItem[] = [];

// عينة من العملاء -> الآن فارغة
const initialCustomers: Customer[] = [];

// عينة من العمال -> الآن فارغة
const initialWorkers: Worker[] = [];

export const useGasStationStore = create<GasStationState>()(
  persist(
    (set, get) => ({
      // Settings
      settings: {
        language: 'ar',
        theme: 'light',
        currency: 'DZD',
        taxRate: 19,
        zakatRate: 2.5,
        backupFrequency: 'daily',
        stationName: 'محطة الوقود النموذجية',
        stationAddress: 'الجزائر العاصمة، الجزائر',
        ownerName: 'محمد أحمد',
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
      customers: initialCustomers,
      creditTransactions: [],
      workers: initialWorkers,
      salaryPayments: [],
      storeItems: initialStoreItems,
      storeSales: [],
      taxRecords: [],
      bills: [],
      financialReports: [],

      // Fuel Management Functions
      addFuelType: (fuelType) =>
        set((state) => ({
          fuelTypes: [
            ...state.fuelTypes,
            {
              ...fuelType,
              id: `fuel-${Date.now()}`,
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
              id: `pump-${Date.now()}`,
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

      addTank: (tank) => {
        const newTank: Tank = {
          ...tank,
          id: `tank-${Date.now()}`,
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

          const updatedTanks = state.tanks.map((tank) =>
            tank.id === pump.tankId
              ? { ...tank, currentLevel: Math.max(0, tank.currentLevel - liters) }
              : tank
          );

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
              id: customer.id || generateId(),
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
              id: transaction.id || generateId(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateCustomerDebt: (customerId, amount) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? { 
                  ...customer, 
                  currentDebt: customer.currentDebt + amount,
                  totalDebt: customer.totalDebt + amount
                }
              : customer
          ),
        })),

      updateCustomer: (customerId, updates) =>
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId ? { ...customer, ...updates } : customer
          ),
        })),

      deleteCustomer: (customerId) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== customerId),
          // حذف جميع معاملات العميل أيضاً
          creditTransactions: state.creditTransactions.filter((transaction) => transaction.customerId !== customerId),
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

      deleteWorker: (workerId) =>
        set((state) => ({
          workers: state.workers.filter((worker) => worker.id !== workerId),
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

      deleteTaxRecord: (recordId) =>
        set((state) => ({
          taxRecords: state.taxRecords.filter((record) => record.id !== recordId),
        })),

      // Bill Management
      addBill: (bill) =>
        set((state) => ({
          bills: [
            ...state.bills,
            {
              ...bill,
              id: generateId(),
            },
          ],
        })),

      updateBill: (billId, updates) =>
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === billId ? { ...bill, ...updates } : bill
          ),
        })),

      deleteBill: (billId) =>
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== billId),
        })),

      payBill: (billId, paymentMethod, notes) =>
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === billId
              ? {
                  ...bill,
                  status: 'paid' as const,
                  paymentDate: new Date().toISOString().split('T')[0],
                  paymentMethod: paymentMethod as any,
                  notes: notes || '',
                }
              : bill
          ),
        })),

      // Reports
      generateFinancialReport: (type, period) => {
        const state = get();
        const report: FinancialReport = {
          id: generateId(),
          type,
          period,
          fuelSales: {
            totalLiters: 0,
            totalRevenue: 0,
            totalProfit: 0,
            byFuelType: [],
          },
          storeSales: {
            totalRevenue: 0,
            totalProfit: 0,
            itemsSold: 0,
          },
          expenses: {
            salaries: 0,
            taxes: 0,
            other: 0,
            total: 0,
          },
          netProfit: 0,
          createdAt: new Date().toISOString(),
        };

        // حساب مبيعات الوقود
        const relevantReadings = state.dailyReadings.filter(r => r.date.includes(period));
        report.fuelSales.totalLiters = relevantReadings.reduce((sum, r) => sum + r.litersSold, 0);
        report.fuelSales.totalRevenue = relevantReadings.reduce((sum, r) => sum + r.amount, 0);

        // حساب الربح من الوقود
        relevantReadings.forEach(reading => {
          const pump = state.pumps.find(p => p.id === reading.pumpId);
          if (pump) {
            const profit = reading.litersSold * (pump.sellPrice - pump.buyPrice);
            report.fuelSales.totalProfit += profit;
          }
        });

        // حساب مبيعات المتجر
        const relevantStoreSales = state.storeSales.filter(s => s.date.includes(period));
        report.storeSales.totalRevenue = relevantStoreSales.reduce((sum, s) => sum + s.total, 0);

        // حساب الربح الصافي
        report.netProfit = report.fuelSales.totalProfit + report.storeSales.totalProfit - report.expenses.total;

        set((state) => ({
          financialReports: [...state.financialReports, report],
        }));

        return report;
      },

      getPumpStatistics: (pumpId, period) => {
        const state = get();
        const pump = state.pumps.find(p => p.id === pumpId);
        const readings = state.dailyReadings.filter(r => r.pumpId === pumpId && r.date.includes(period));
        
        const totalLiters = readings.reduce((sum, r) => sum + r.litersSold, 0);
        const totalRevenue = readings.reduce((sum, r) => sum + r.amount, 0);
        const totalProfit = pump ? totalLiters * (pump.sellPrice - pump.buyPrice) : 0;

        return {
          pumpId,
          period,
          totalLiters,
          totalRevenue,
          totalProfit,
          averageDaily: totalLiters / Math.max(readings.length, 1),
          efficiency: pump?.isActive ? 85 : 0,
        };
      },

      getInventoryReport: () => {
        const state = get();
        
        return {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          fuelInventory: state.tanks.map(tank => {
            const fuelType = state.fuelTypes.find(f => f.id === tank.fuelType);
            const percentage = (tank.currentLevel / tank.capacity) * 100;
            const dailyConsumption = 500; // متوسط الاستهلاك اليومي
            const daysRemaining = Math.floor(tank.currentLevel / dailyConsumption);

            return {
              tankId: tank.id,
              fuelType: fuelType?.name.ar || 'غير محدد',
              currentLevel: tank.currentLevel,
              capacity: tank.capacity,
              percentage,
              daysRemaining,
            };
          }),
          storeInventory: state.storeItems.map(item => ({
            itemId: item.id,
            name: item.name,
            currentStock: item.stock,
            minStock: item.minStock || 10,
            status: item.stock === 0 ? 'out' : item.stock <= (item.minStock || 10) ? 'low' : 'ok',
          })),
        };
      },

      // Utility functions
      getDashboardMetrics: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        
        const todayReadings = state.dailyReadings.filter(r => r.date === today);
        const dailyFuelSales = todayReadings.reduce((sum, r) => sum + r.litersSold, 0);
        const dailyRevenue = todayReadings.reduce((sum, r) => sum + r.amount, 0);
        
        const todayStoreSales = state.storeSales.filter(s => s.date === today);
        const dailyStoreSales = todayStoreSales.reduce((sum, s) => sum + s.total, 0);
        
        const totalDebts = state.customers.reduce((sum, c) => sum + c.currentDebt, 0);
        
        const dailyProfit = todayReadings.reduce((sum, reading) => {
          const pump = state.pumps.find(p => p.id === reading.pumpId);
          const profitPerLiter = (pump?.sellPrice || 0) - (pump?.buyPrice || 0);
          return sum + (reading.litersSold * profitPerLiter);
        }, 0);
        
        return {
          dailyFuelSales,
          dailyRevenue: dailyRevenue + dailyStoreSales,
          dailyProfit,
          totalDebts,
          dailyStoreSales,
          tankLevels: state.tanks,
          lowStockAlerts: state.storeItems.filter(item => item.stock <= (item.minStock || 10)).length,
          monthlyRevenue: 0, // يمكن حسابها لاحقاً
          yearlyRevenue: 0, // يمكن حسابها لاحقاً
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
          financialReports: state.financialReports,
          bills: state.bills,
          exportDate: new Date().toISOString(),
        }, null, 2);
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set(parsed);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      backupData: () => {
        const data = get().exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gas-station-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      restoreData: (backupData) => {
        get().importData(backupData);
      },

      resetData: () =>
        set({
          fuelTypes: [],
          pumps: [],
          tanks: [],
          dailyReadings: [],
          customers: [],
          creditTransactions: [],
          workers: [],
          salaryPayments: [],
          storeItems: [],
          storeSales: [],
          taxRecords: [],
          financialReports: [],
          bills: [],
        }),
    }),
    {
      name: 'gas-station-storage-v2',
      version: 1,
    }
  )
);