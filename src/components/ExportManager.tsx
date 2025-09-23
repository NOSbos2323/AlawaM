import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGasStationStore } from '@/store/gasStationStore';
import { Download, FileSpreadsheet, Calendar, Users, Fuel, ShoppingBag, DollarSign, Receipt, Building2, FileCheck, Gauge, Droplets } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExportManagerProps {
  language?: 'ar' | 'fr';
}

export const ExportManager: React.FC<ExportManagerProps> = ({ language = 'ar' }) => {
  const store = useGasStationStore();
  
  // Safe destructuring with default values
  const {
    customers = [],
    creditTransactions = [],
    workers = [],
    salaryPayments = [],
    storeItems = [],
    storeSales = [],
    fuelTypes = [],
    pumps = [],
    tanks = [],
    dailyReadings = [],
    taxRecords = [],
    bills = [],
    financialReports = [],
    settings = {
      stationName: 'محطة الوقود',
      language: 'ar',
      currency: 'DZD'
    }
  } = store || {};

  const [exportType, setExportType] = useState<'all' | 'customers' | 'transactions' | 'workers' | 'store' | 'fuel' | 'taxes' | 'reports'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [showExportDialog, setShowExportDialog] = useState(false);

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'تصدير البيانات الشامل',
      exportData: 'تصدير البيانات',
      exportType: 'نوع التصدير',
      dateRange: 'النطاق الزمني',
      allData: 'جميع البيانات',
      customers: 'العملاء',
      transactions: 'المعاملات',
      workers: 'العمال',
      store: 'المتجر',
      fuel: 'الوقود',
      taxes: 'الضرائب والفواتير',
      reports: 'التقارير',
      all: 'الكل',
      today: 'اليوم',
      week: 'هذا الأسبوع',
      month: 'هذا الشهر',
      year: 'هذا العام',
      export: 'تصدير',
      cancel: 'إلغاء',
      exportSuccess: 'تم تصدير البيانات بنجاح',
      noData: 'لا توجد بيانات للتصدير',
    },
    fr: {
      title: 'Export complet des données',
      exportData: 'Exporter les données',
      exportType: 'Type d\'export',
      dateRange: 'Période',
      allData: 'Toutes les données',
      customers: 'Clients',
      transactions: 'Transactions',
      workers: 'Employés',
      store: 'Magasin',
      fuel: 'Carburant',
      taxes: 'Taxes et factures',
      reports: 'Rapports',
      all: 'Tout',
      today: 'Aujourd\'hui',
      week: 'Cette semaine',
      month: 'Ce mois',
      year: 'Cette année',
      export: 'Exporter',
      cancel: 'Annuler',
      exportSuccess: 'Données exportées avec succès',
      noData: 'Aucune donnée à exporter',
    },
  };

  const t = texts[language];

  // Helper functions for date filtering
  const getDateFilter = (dateRange: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        return (date: string) => {
          const itemDate = new Date(date);
          return itemDate >= today;
        };
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return (date: string) => {
          const itemDate = new Date(date);
          return itemDate >= weekAgo;
        };
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return (date: string) => {
          const itemDate = new Date(date);
          return itemDate >= monthAgo;
        };
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        return (date: string) => {
          const itemDate = new Date(date);
          return itemDate >= yearAgo;
        };
      default:
        return () => true;
    }
  };

  // Format Arabic date with time
  const formatArabicDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format Arabic date only
  const formatArabicDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get payment method text in Arabic
  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'cheque': return 'شيك';
      case 'bank_transfer': return 'تحويل بنكي';
      case 'cash':
      default: return 'نقدي';
    }
  };

  // Get unit text in Arabic
  const getUnitText = (unit?: string) => {
    switch (unit) {
      case 'unit': return 'قطعة';
      case 'kg': return 'كيلوغرام';
      case 'liter': return 'لتر';
      case 'box': return 'علبة';
      case 'bottle': return 'زجاجة';
      default: return 'قطعة';
    }
  };

  // Calculate customer balance safely
  const calculateCustomerBalance = (customerId: string) => {
    try {
      const customerTransactions = creditTransactions.filter(t => t.customerId === customerId);
      const totalDebt = customerTransactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + (t.amount || 0), 0);
      const totalPayments = customerTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + (t.amount || 0), 0);
      return totalDebt - totalPayments;
    } catch (error) {
      console.error('Error calculating customer balance:', error);
      return 0;
    }
  };

  // Export customers data
  const exportCustomersData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      
      const customersData = customers.map(customer => {
        const customerTransactions = creditTransactions.filter(t => t.customerId === customer.id);
        const filteredTransactions = dateRange === 'all' ? customerTransactions : customerTransactions.filter(t => dateFilter(t.date));
        
        const totalDebt = filteredTransactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + (t.amount || 0), 0);
        const totalPayments = filteredTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + (t.amount || 0), 0);
        const currentBalance = totalDebt - totalPayments;

        // Payment methods breakdown
        const paymentMethods = filteredTransactions
          .filter(t => t.type === 'payment')
          .reduce((acc, t) => {
            const method = t.paymentMethod || 'cash';
            acc[method] = (acc[method] || 0) + (t.amount || 0);
            return acc;
          }, {} as Record<string, number>);

        // Last transaction
        const lastTransaction = customerTransactions.length > 0 
          ? customerTransactions[customerTransactions.length - 1] 
          : null;

        return {
          'رقم العميل': customer.id || '',
          'اسم العميل': customer.name || '',
          'رقم الهاتف': customer.phone || '',
          'العنوان': customer.address || '',
          'تاريخ التسجيل': formatArabicDateTime(customer.createdAt || new Date().toISOString()),
          'إجمالي الديون': `${totalDebt.toFixed(2)} دج`,
          'إجمالي المدفوعات': `${totalPayments.toFixed(2)} دج`,
          'الرصيد الحالي': `${currentBalance.toFixed(2)} دج`,
          'حالة الحساب': currentBalance > 0 ? 'مدين' : currentBalance < 0 ? 'دائن' : 'متوازن',
          'عدد المعاملات': filteredTransactions.length,
          'المدفوعات النقدية': `${(paymentMethods.cash || 0).toFixed(2)} دج`,
          'المدفوعات بالشيك': `${(paymentMethods.cheque || 0).toFixed(2)} دج`,
          'التحويلات البنكية': `${(paymentMethods.bank_transfer || 0).toFixed(2)} دج`,
          'آخر معاملة': lastTransaction 
            ? formatArabicDateTime(lastTransaction.date || '')
            : 'لا توجد معاملات',
          'نوع آخر معاملة': lastTransaction 
            ? (lastTransaction.type === 'debt' ? 'دين' : 'دفعة')
            : '',
          'مبلغ آخر معاملة': lastTransaction 
            ? `${(lastTransaction.amount || 0).toFixed(2)} دج`
            : ''
        };
      });

      return customersData;
    } catch (error) {
      console.error('Error exporting customers data:', error);
      return [];
    }
  };

  // Export transactions data (aligned with types)
  const exportTransactionsData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredTransactions = creditTransactions.filter(t => dateFilter(t.date));

      const transactionsData = filteredTransactions.map(transaction => {
        const customer = customers.find(c => c.id === transaction.customerId);
        return {
          'رقم المعاملة': transaction.id || '',
          'اسم العميل': customer?.name || 'عميل غير معروف',
          'رقم هاتف العميل': customer?.phone || '',
          'عنوان العميل': customer?.address || '',
          'نوع المعاملة': transaction.type === 'debt' ? 'دين' : 'دفعة',
          'المبلغ': `${(transaction.amount || 0).toFixed(2)} دج`,
          'الوصف': transaction.description || '',
          'تاريخ المعاملة': formatArabicDate(transaction.date || ''),
          'تاريخ الإنشاء': formatArabicDateTime(transaction.createdAt || ''),
          'طريقة الدفع': transaction.type === 'payment' ? getPaymentMethodText(transaction.paymentMethod) : 'غير محدد',
          'معرّف الربط': transaction.transactionId || ''
        };
      });

      return transactionsData;
    } catch (error) {
      console.error('Error exporting transactions data:', error);
      return [];
    }
  };

  // Export workers data (use status)
  const exportWorkersData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);

      const workersData = workers.map(worker => {
        const workerPayments = salaryPayments.filter(p => p.workerId === worker.id);
        const filteredPayments = dateRange === 'all' ? workerPayments : workerPayments.filter(p => dateFilter(p.date));
        const totalPaid = filteredPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const lastPayment = workerPayments.length > 0 ? workerPayments[workerPayments.length - 1] : null;

        return {
          'رقم العامل': worker.id || '',
          'اسم العامل': worker.name || '',
          'رقم الهاتف': worker.phone || '',
          'العنوان': worker.address || '',
          'المنصب': worker.position || '',
          'الراتب الأساسي': `${(worker.salary || 0).toFixed(2)} دج`,
          'تاريخ التوظيف': formatArabicDate(worker.hireDate || ''),
          'الحالة': worker.status === 'active' ? 'نشط' : 'غير نشط',
          'إجمالي المدفوعات': `${totalPaid.toFixed(2)} دج`,
          'عدد المدفوعات': filteredPayments.length,
          'آخر راتب': lastPayment 
            ? formatArabicDate(lastPayment.date || '')
            : 'لم يتم الدفع بعد',
          'مبلغ آخر راتب': lastPayment 
            ? `${(lastPayment.amount || 0).toFixed(2)} دج`
            : '',
          'ملاحظات آخر راتب': lastPayment?.notes || ''
        };
      });

      return workersData;
    } catch (error) {
      console.error('Error exporting workers data:', error);
      return [];
    }
  };

  // Export store items summary (aggregate sales from StoreSale.items)
  const exportStoreData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredSales = storeSales.filter(s => dateFilter(s.date));

      const storeData = storeItems.map(item => {
        const itemSales = filteredSales.flatMap(s => s.items.filter(i => i.itemId === item.id));
        const totalSold = itemSales.reduce((sum, s) => sum + (s.quantity || 0), 0);
        const totalRevenue = itemSales.reduce((sum, s) => sum + (s.total || 0), 0);
        const profitMargin = item.sellPrice && item.buyPrice 
          ? ((item.sellPrice - item.buyPrice) / item.buyPrice * 100)
          : 0;

        return {
          'رقم المنتج': item.id || '',
          'اسم المنتج': item.name || '',
          'الفئة': item.category || '',
          'سعر الشراء': `${(item.buyPrice || 0).toFixed(2)} دج`,
          'سعر البيع': `${(item.sellPrice || 0).toFixed(2)} دج`,
          'هامش الربح': `${profitMargin.toFixed(2)}%`,
          'الربح لكل وحدة': `${((item.sellPrice || 0) - (item.buyPrice || 0)).toFixed(2)} دج`,
          'المخزون الحالي': item.stock || 0,
          'الحد الأدنى للمخزون': item.minStock || 0,
          'حالة المخزون': (item.stock || 0) === 0 ? 'نفد' : (item.stock || 0) <= (item.minStock || 10) ? 'منخفض' : 'متوفر',
          'وحدة القياس': getUnitText(item.unit),
          'الكمية المباعة': totalSold,
          'إجمالي الإيرادات': `${totalRevenue.toFixed(2)} دج`,
          'إجمالي الربح التقريبي': `${(totalSold * ((item.sellPrice || 0) - (item.buyPrice || 0))).toFixed(2)} دج`,
          'عدد عمليات البيع': filteredSales.length,
        };
      });

      return storeData;
    } catch (error) {
      console.error('Error exporting store data:', error);
      return [];
    }
  };

  // Export detailed Store Sales (flatten items per sale)
  const exportStoreSalesData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredSales = storeSales.filter(s => dateFilter(s.date));
      const salesRows = filteredSales.flatMap(sale => {
        const customer = sale.customerId ? customers.find(c => c.id === sale.customerId) : undefined;
        return sale.items.map(it => {
          const item = storeItems.find(si => si.id === it.itemId);
          return {
            'رقم البيع': sale.id || '',
            'تاريخ البيع': formatArabicDateTime(sale.date || ''),
            'طريقة الدفع': sale.paymentMethod === 'cash' ? 'نقدي' : 'آجل',
            'اسم العميل': customer?.name || '',
            'المنتج': item?.name || it.itemId,
            'الكمية': it.quantity,
            'سعر الوحدة': `${(it.price || 0).toFixed(2)} دج`,
            'الإجمالي': `${(it.total || 0).toFixed(2)} دج`,
            'معرّف الربط': sale.transactionId || ''
          };
        });
      });
      return salesRows;
    } catch (error) {
      console.error('Error exporting store sales data:', error);
      return [];
    }
  };

  // Export fuel data (aggregate by fuel type; compute margin from pumps)
  const exportFuelData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredReadings = dailyReadings.filter(r => dateFilter(r.date));

      const fuelData = fuelTypes.map(fuelType => {
        const typeTanks = tanks.filter(t => t.fuelType === fuelType.id);
        const typePumps = pumps.filter(p => p.fuelType === fuelType.id);
        const typeReadings = filteredReadings.filter(r => {
          const pump = pumps.find(p => p.id === r.pumpId);
          return pump?.fuelType === fuelType.id;
        });

        const totalSold = typeReadings.reduce((sum, r) => sum + (r.litersSold || 0), 0);
        const totalRevenue = typeReadings.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalCapacity = typeTanks.reduce((sum, t) => sum + (t.capacity || 0), 0);
        const currentLevel = typeTanks.reduce((sum, t) => sum + (t.currentLevel || 0), 0);

        const avgBuy = typePumps.length > 0 ? typePumps.reduce((s,p)=> s + (p.buyPrice || 0),0)/typePumps.length : 0;
        const avgSell = typePumps.length > 0 ? typePumps.reduce((s,p)=> s + (p.sellPrice || 0),0)/typePumps.length : 0;
        const margin = avgBuy > 0 ? ((avgSell - avgBuy) / avgBuy) * 100 : 0;

        return {
          'رقم نوع الوقود': fuelType.id || '',
          'اسم الوقود (عربي)': fuelType.name?.ar || '',
          'اسم الوقود (فرنسي)': fuelType.name?.fr || '',
          'متوسط سعر الشراء': `${avgBuy.toFixed(2)} دج/لتر`,
          'متوسط سعر البيع': `${avgSell.toFixed(2)} دج/لتر`,
          'هامش الربح المتوسط': `${margin.toFixed(2)}%`,
          'عدد الخزانات': typeTanks.length,
          'السعة الإجمالية': `${totalCapacity.toFixed(2)} لتر`,
          'المستوى الحالي': `${currentLevel.toFixed(2)} لتر`,
          'نسبة الامتلاء': `${totalCapacity > 0 ? ((currentLevel / totalCapacity) * 100).toFixed(2) : 0}%`,
          'عدد المضخات': typePumps.length,
          'المضخات النشطة': typePumps.filter(p => p.isActive).length,
          'الكمية المباعة': `${totalSold.toFixed(2)} لتر`,
          'إجمالي الإيرادات': `${totalRevenue.toFixed(2)} دج`,
          'عدد المبيعات (قراءات)': typeReadings.length,
        };
      });

      return fuelData;
    } catch (error) {
      console.error('Error exporting fuel data:', error);
      return [];
    }
  };

  // Export Pumps
  const exportPumpsData = () => {
    try {
      const pumpsData = pumps.map(p => {
        const fuel = fuelTypes.find(f => f.id === p.fuelType);
        const tank = tanks.find(t => t.id === p.tankId);
        return {
          'رقم المضخة': p.id || '',
          'اسم المضخة': p.name || '',
          'الرقم': p.number,
          'نوع الوقود': fuel?.name?.ar || '',
          'الخزان المرتبط': tank?.name || '',
          'سعر الشراء/لتر': `${(p.buyPrice || 0).toFixed(2)} دج`,
          'سعر البيع/لتر': `${(p.sellPrice || 0).toFixed(2)} دج`,
          'القراءة السابقة': p.previousReading || 0,
          'القراءة الحالية': p.currentReading || 0,
          'الحالة': p.isActive ? 'نشطة' : 'غير نشطة',
        };
      });
      return pumpsData;
    } catch (e) {
      console.error('Error exporting pumps data:', e);
      return [];
    }
  };

  // Export Tanks
  const exportTanksData = () => {
    try {
      const tanksData = tanks.map(t => {
        const fuel = fuelTypes.find(f => f.id === t.fuelType);
        const pct = t.capacity ? (t.currentLevel / t.capacity) * 100 : 0;
        return {
          'رقم الخزان': t.id || '',
          'اسم الخزان': t.name || '',
          'نوع الوقود': fuel?.name?.ar || '',
          'السعة (لتر)': t.capacity || 0,
          'المستوى الحالي (لتر)': t.currentLevel || 0,
          'نسبة الامتلاء': `${pct.toFixed(2)}%`,
          'الحد الأدنى': t.minLevel || 0,
          'الحالة': t.isActive ? 'نشط' : 'غير نشط',
        };
      });
      return tanksData;
    } catch (e) {
      console.error('Error exporting tanks data:', e);
      return [];
    }
  };

  // Export Daily Readings
  const exportDailyReadingsData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filtered = dailyReadings.filter(r => dateFilter(r.date));
      const rows = filtered.map(r => {
        const pump = pumps.find(p => p.id === r.pumpId);
        const fuel = pump ? fuelTypes.find(f => f.id === pump.fuelType) : undefined;
        return {
          'رقم القراءة': r.id || '',
          'التاريخ': formatArabicDate(r.date || ''),
          'اسم المضخة': pump?.name || '',
          'نوع الوقود': fuel?.name?.ar || '',
          'القراءة السابقة': r.previousReading || 0,
          'القراءة الحالية': r.currentReading || 0,
          'الكمية المباعة (لتر)': r.litersSold || 0,
          'المبلغ': `${(r.amount || 0).toFixed(2)} دج`,
          'تاريخ الإنشاء': formatArabicDateTime(r.createdAt || ''),
        };
      });
      return rows;
    } catch (e) {
      console.error('Error exporting daily readings:', e);
      return [];
    }
  };

  // Export taxes and bills data (aligned with types)
  const exportTaxesData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredBills = bills.filter(b => dateFilter(b.dueDate || ''));
      const filteredTaxes = taxRecords.filter(t => dateFilter(t.dueDate || ''));

      const billsData = filteredBills.map(bill => ({
        'رقم الفاتورة': bill.id || '',
        'النوع': bill.type || 'other',
        'المزوّد': bill.provider || '',
        'رقم الحساب': bill.accountNumber || '',
        'المبلغ': `${(bill.amount || 0).toFixed(2)} دج`,
        'تاريخ الاستحقاق': formatArabicDate(bill.dueDate || ''),
        'الحالة': bill.status === 'paid' ? 'مدفوعة' : bill.status === 'overdue' ? 'متأخرة' : 'معلقة',
        'تاريخ الدفع': bill.paymentDate ? formatArabicDate(bill.paymentDate) : '',
        'طريقة الدفع': bill.paymentMethod ? (bill.paymentMethod === 'card' ? 'بطاقة' : bill.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : 'نقدي') : '',
        'الوصف': bill.description || '',
        'ملاحظات': bill.notes || ''
      }));

      const taxesData = filteredTaxes.map(tax => ({
        'رقم السجل': tax.id || '',
        'النوع': tax.type === 'tax' ? 'ضريبة' : 'زكاة',
        'المبلغ': `${(tax.amount || 0).toFixed(2)} دج`,
        'الفترة': tax.period || '',
        'تاريخ الاستحقاق': formatArabicDate(tax.dueDate || ''),
        'تاريخ السداد': tax.paidDate ? formatArabicDate(tax.paidDate) : '',
        'الحالة': tax.status === 'paid' ? 'مدفوعة' : 'معلقة',
        'الوصف': tax.description || ''
      }));

      return { bills: billsData, taxes: taxesData };
    } catch (error) {
      console.error('Error exporting taxes data:', error);
      return { bills: [], taxes: [] };
    }
  };

  // Export salary payments
  const exportSalaryPaymentsData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filtered = salaryPayments.filter(p => dateFilter(p.date));
      const rows = filtered.map(p => {
        const worker = workers.find(w => w.id === p.workerId);
        return {
          'رقم الدفع': p.id || '',
          'اسم العامل': worker?.name || '',
          'الشهر': p.month || '',
          'السنة': p.year || '',
          'المبلغ': `${(p.amount || 0).toFixed(2)} دج`,
          'التاريخ': formatArabicDate(p.date || ''),
          'ملاحظات': p.notes || ''
        };
      });
      return rows;
    } catch (e) {
      console.error('Error exporting salary payments:', e);
      return [];
    }
  };

  // Export reports data
  const exportReportsData = () => {
    try {
      const dateFilter = getDateFilter(dateRange);
      const filteredReports = financialReports.filter(r => dateFilter(r.createdAt || ''));

      const reportsData = filteredReports.map(report => ({
        'رقم التقرير': report.id || '',
        'نوع التقرير': report.type === 'daily' ? 'يومي' : report.type === 'weekly' ? 'أسبوعي' : report.type === 'monthly' ? 'شهري' : 'سنوي',
        'الفترة': report.period || '',
        'إجمالي مبيعات الوقود (لتر)': `${(report.fuelSales?.totalLiters || 0).toFixed(2)} لتر`,
        'إيرادات الوقود': `${(report.fuelSales?.totalRevenue || 0).toFixed(2)} دج`,
        'ربح الوقود': `${(report.fuelSales?.totalProfit || 0).toFixed(2)} دج`,
        'إيرادات المتجر': `${(report.storeSales?.totalRevenue || 0).toFixed(2)} دج`,
        'ربح المتجر': `${(report.storeSales?.totalProfit || 0).toFixed(2)} دج`,
        'مصاريف الرواتب': `${(report.expenses?.salaries || 0).toFixed(2)} دج`,
        'مصاريف الضرائب': `${(report.expenses?.taxes || 0).toFixed(2)} دج`,
        'مصاريف أخرى': `${(report.expenses?.other || 0).toFixed(2)} دج`,
        'إجمالي المصاريف': `${(report.expenses?.total || 0).toFixed(2)} دج`,
        'الربح الصافي': `${(report.netProfit || 0).toFixed(2)} دج`,
        'تاريخ الإنشاء': formatArabicDateTime(report.createdAt || ''),
        'هامش الربح الإجمالي': report.fuelSales?.totalRevenue && report.storeSales?.totalRevenue 
          ? `${(((report.fuelSales.totalProfit || 0) + (report.storeSales.totalProfit || 0)) / ((report.fuelSales.totalRevenue || 0) + (report.storeSales.totalRevenue || 0)) * 100).toFixed(2)}%`
          : '0%'
      }));

      return reportsData;
    } catch (error) {
      console.error('Error exporting reports data:', error);
      return [];
    }
  };

  // Main export function
  const handleExport = () => {
    try {
      const workbook = XLSX.utils.book_new();
      const timestamp = new Date().toISOString().split('T')[0];
      const stationName = settings?.stationName || 'محطة الوقود';

      if (exportType === 'all' || exportType === 'customers') {
        const customersData = exportCustomersData();
        if (customersData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(customersData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'العملاء');
        }
      }

      if (exportType === 'all' || exportType === 'transactions') {
        const transactionsData = exportTransactionsData();
        if (transactionsData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(transactionsData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'المعاملات');
        }
      }

      if (exportType === 'all' || exportType === 'workers') {
        const workersData = exportWorkersData();
        if (workersData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(workersData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'العمال');
        }
        const salaries = exportSalaryPaymentsData();
        if (salaries.length > 0) {
          const ws = XLSX.utils.json_to_sheet(salaries);
          XLSX.utils.book_append_sheet(workbook, ws, 'مدفوعات_الرواتب');
        }
      }

      if (exportType === 'all' || exportType === 'store') {
        const storeData = exportStoreData();
        if (storeData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(storeData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'المتجر');
        }
        const storeSalesRows = exportStoreSalesData();
        if (storeSalesRows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(storeSalesRows);
          XLSX.utils.book_append_sheet(workbook, ws, 'مبيعات_المتجر');
        }
      }

      if (exportType === 'all' || exportType === 'fuel') {
        const fuelData = exportFuelData();
        if (fuelData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(fuelData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'الوقود');
        }
        const pumpsRows = exportPumpsData();
        if (pumpsRows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(pumpsRows);
          XLSX.utils.book_append_sheet(workbook, ws, 'المضخات');
        }
        const tanksRows = exportTanksData();
        if (tanksRows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(tanksRows);
          XLSX.utils.book_append_sheet(workbook, ws, 'الخزانات');
        }
        const readingsRows = exportDailyReadingsData();
        if (readingsRows.length > 0) {
          const ws = XLSX.utils.json_to_sheet(readingsRows);
          XLSX.utils.book_append_sheet(workbook, ws, 'القراءات_اليومية');
        }
      }

      if (exportType === 'all' || exportType === 'taxes') {
        const taxesData = exportTaxesData();
        if (taxesData.bills.length > 0) {
          const billsWorksheet = XLSX.utils.json_to_sheet(taxesData.bills);
          XLSX.utils.book_append_sheet(workbook, billsWorksheet, 'الفواتير');
        }
        if (taxesData.taxes.length > 0) {
          const taxesWorksheet = XLSX.utils.json_to_sheet(taxesData.taxes);
          XLSX.utils.book_append_sheet(workbook, taxesWorksheet, 'السجلات_الضريبية');
        }
      }

      if (exportType === 'all' || exportType === 'reports') {
        const reportsData = exportReportsData();
        if (reportsData.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportsData);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'التقارير');
        }
      }

      // Update summary (fix active workers)
      const summaryData = [{
        'اسم المحطة': stationName,
        'تاريخ التصدير': formatArabicDateTime(new Date().toISOString()),
        'نوع التصدير': exportType === 'all' ? 'جميع البيانات' : t[exportType as keyof typeof t] || exportType,
        'النطاق الزمني': t[dateRange as keyof typeof t] || dateRange,
        'عدد العملاء': customers.length,
        'العملاء المدينون': customers.filter(c => calculateCustomerBalance(c.id) > 0).length,
        'عدد المعاملات': creditTransactions.length,
        'معاملات اليوم': creditTransactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length,
        'عدد العمال': workers.length,
        'العمال النشطون': workers.filter(w => w.status === 'active').length,
        'عدد منتجات المتجر': storeItems.length,
        'منتجات منخفضة المخزون': storeItems.filter(i => (i.stock || 0) <= (i.minStock || 10)).length,
        'عدد أنواع الوقود': fuelTypes.length,
        'عدد المضخات': pumps.length,
        'المضخات النشطة': pumps.filter(p => p.isActive).length,
        'عدد الخزانات': tanks.length,
        'عدد الفواتير': bills.length,
        'الفواتير المدفوعة': bills.filter(b => b.status === 'paid').length,
        'عدد التقارير': financialReports.length,
        'إجمالي الديون': `${creditTransactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} دج`,
        'إجمالي المدفوعات': `${creditTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} دج`,
        'المدفوعات النقدية': `${creditTransactions.filter(t => t.type === 'payment' && t.paymentMethod === 'cash').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} دج`,
        'المدفوعات بالشيك': `${creditTransactions.filter(t => t.type === 'payment' && t.paymentMethod === 'cheque').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} دج`,
        'التحويلات البنكية': `${creditTransactions.filter(t => t.type === 'payment' && t.paymentMethod === 'bank_transfer').reduce((sum, t) => sum + (t.amount || 0), 0).toFixed(2)} دج`,
        'إجمالي مبيعات الوقود (لتر)': `${dailyReadings.reduce((sum, r) => sum + (r.litersSold || 0), 0).toFixed(2)} لتر`,
        'إيرادات الوقود': `${dailyReadings.reduce((sum, r) => sum + (r.amount || 0), 0).toFixed(2)} دج`,
        'إيرادات المتجر': `${storeSales.reduce((sum, s) => sum + (s.total || 0), 0).toFixed(2)} دج`,
        'إجمالي الرواتب المدفوعة': `${salaryPayments.reduce((sum, p) => sum + (p.amount || 0), 0).toFixed(2)} دج`
      }];

      const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'ملخص شامل');

      // Generate filename
      const exportTypeText = exportType === 'all' ? 'جميع_البيانات' : 
                           exportType === 'customers' ? 'العملاء' :
                           exportType === 'transactions' ? 'المعاملات' :
                           exportType === 'workers' ? 'العمال' :
                           exportType === 'store' ? 'المتجر' :
                           exportType === 'fuel' ? 'الوقود' : 
                           exportType === 'reports' ? 'التقارير' : 'الضرائب';

      const filename = `${stationName.replace(/\s+/g, '_')}_${exportTypeText}_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);
      setShowExportDialog(false);
      alert(t.exportSuccess);
    } catch (error) {
      console.error('Export error:', error);
      alert('حدث خطأ أثناء التصدير');
    }
  };

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8" />
          {t.title}
        </h1>
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t.exportData}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.exportData}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t.exportType}</label>
                <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allData}</SelectItem>
                    <SelectItem value="customers">{t.customers}</SelectItem>
                    <SelectItem value="transactions">{t.transactions}</SelectItem>
                    <SelectItem value="workers">{t.workers}</SelectItem>
                    <SelectItem value="store">{t.store}</SelectItem>
                    <SelectItem value="fuel">{t.fuel}</SelectItem>
                    <SelectItem value="taxes">{t.taxes}</SelectItem>
                    <SelectItem value="reports">{t.reports}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">{t.dateRange}</label>
                <Select value={dateRange} onValueChange={(value: any) => setDateRange(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all}</SelectItem>
                    <SelectItem value="today">{t.today}</SelectItem>
                    <SelectItem value="week">{t.week}</SelectItem>
                    <SelectItem value="month">{t.month}</SelectItem>
                    <SelectItem value="year">{t.year}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleExport} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  {t.export}
                </Button>
                <Button variant="outline" onClick={() => setShowExportDialog(false)}>
                  {t.cancel}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Export Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">العملاء</p>
                <p className="text-3xl font-bold">{customers.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="text-xs text-blue-100 mt-2">
              {customers.filter(c => calculateCustomerBalance(c.id) > 0).length} عميل مدين
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">المعاملات</p>
                <p className="text-3xl font-bold">{creditTransactions.length}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
            <div className="text-xs text-green-100 mt-2">
              {creditTransactions.filter(t => t.date === new Date().toISOString().split('T')[0]).length} معاملة اليوم
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">منتجات المتجر</p>
                <p className="text-3xl font-bold">{storeItems.length}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-200" />
            </div>
            <div className="text-xs text-purple-100 mt-2">
              {storeItems.filter(i => (i.stock || 0) <= (i.minStock || 10)).length} منتج منخفض المخزون
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">أنواع الوقود</p>
                <p className="text-3xl font-bold">{fuelTypes.length}</p>
              </div>
              <Fuel className="w-8 h-8 text-orange-200" />
            </div>
            <div className="text-xs text-orange-100 mt-2">
              {pumps.filter(p => p.isActive).length} مضخة نشطة
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('customers');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              تصدير بيانات العملاء الشاملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير جميع بيانات العملاء مع تفاصيل الديون والمدفوعات وطرق الدفع والتواريخ الصحيحة
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{customers.length} عميل</Badge>
              <Badge variant="outline">{creditTransactions.length} معاملة</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('transactions');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              تصدير المعاملات المالية التفصيلية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير جميع المعاملات مع تفاصيل طرق الدفع والتواريخ والأوقات الصحيحة
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{creditTransactions.filter(t => t.type === 'debt').length} دين</Badge>
              <Badge variant="outline">{creditTransactions.filter(t => t.type === 'payment').length} دفعة</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('fuel');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              تصدير بيانات الوقود الكاملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير أنواع الوقود والخزانات والمضخات والمبيعات مع التفاصيل الكاملة
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{fuelTypes.length} نوع</Badge>
              <Badge variant="outline">{dailyReadings.length} قراءة</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('store');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              تصدير بيانات المتجر التفصيلية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير منتجات المتجر مع المخزون والمبيعات وهوامش الربح
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{storeItems.length} منتج</Badge>
              <Badge variant="outline">{storeSales.length} مبيعة</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('workers');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              تصدير بيانات العمال الشاملة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير بيانات العمال مع تفاصيل الرواتب والمدفوعات والحالة
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{workers.length} عامل</Badge>
              <Badge variant="outline">{salaryPayments.length} راتب</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
          setExportType('reports');
          setShowExportDialog(true);
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              تصدير التقارير المالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              تصدير التقارير المالية مع تفاصيل الأرباح والخسائر
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{financialReports.length} تقرير</Badge>
              <Badge variant="outline">تحليل شامل</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportManager;