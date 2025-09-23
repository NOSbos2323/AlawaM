import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGasStationStore } from '@/store/gasStationStore';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Fuel, 
  Users, 
  AlertTriangle,
  BarChart3,
  ShoppingCart,
  CreditCard,
  Gauge,
  Activity
} from 'lucide-react';

interface DashboardMetricsProps {
  language?: 'ar' | 'fr';
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ language = 'ar' }) => {
  const { 
    getDashboardMetrics, 
    fuelTypes, 
    pumps, 
    tanks, 
    customers, 
    workers,
    dailyReadings,
    storeSales,
    storeItems
  } = useGasStationStore();

  const metrics = getDashboardMetrics();
  const isRTL = language === 'ar';

  const texts = {
    ar: {
      dailyRevenue: 'الإيرادات اليومية',
      dailyFuelSales: 'مبيعات الوقود اليومية',
      dailyProfit: 'الربح اليومي',
      totalDebts: 'إجمالي الديون',
      dailyStoreSales: 'مبيعات المتجر اليومية',
      tankLevels: 'مستويات الخزانات',
      lowStockAlerts: 'تنبيهات المخزون المنخفض',
      activeWorkers: 'العمال النشطون',
      activePumps: 'المضخات النشطة',
      totalCustomers: 'إجمالي العملاء',
      liters: 'لتر',
      dzd: 'دج',
      workers: 'عامل',
      pumps: 'مضخة',
      customers: 'عميل',
      items: 'منتج',
      critical: 'حرج',
      warning: 'تحذير',
      good: 'جيد',
      capacity: 'السعة',
      current: 'الحالي',
      percentage: 'النسبة',
      compared: 'مقارنة بالأمس',
      increase: 'زيادة',
      decrease: 'نقصان',
      transactions: 'معاملة',
      today: 'اليوم',
      total: 'إجمالي',
      from: 'من',
      needsRefill: 'يحتاج إعادة تموين',
    },
    fr: {
      dailyRevenue: 'Revenus Quotidiens',
      dailyFuelSales: 'Ventes de Carburant Quotidiennes',
      dailyProfit: 'Profit Quotidien',
      totalDebts: 'Total des Dettes',
      dailyStoreSales: 'Ventes du Magasin Quotidiennes',
      tankLevels: 'Niveaux des Réservoirs',
      lowStockAlerts: 'Alertes Stock Faible',
      activeWorkers: 'Employés Actifs',
      activePumps: 'Pompes Actives',
      totalCustomers: 'Total Clients',
      liters: 'Litres',
      dzd: 'DZD',
      workers: 'Employé',
      pumps: 'Pompe',
      customers: 'Client',
      items: 'Article',
      critical: 'Critique',
      warning: 'Attention',
      good: 'Bon',
      capacity: 'Capacité',
      current: 'Actuel',
      percentage: 'Pourcentage',
      compared: 'Comparé à hier',
      increase: 'Augmentation',
      decrease: 'Diminution',
      transactions: 'Transaction',
      today: 'Aujourd\'hui',
      total: 'Total',
      from: 'Sur',
      needsRefill: 'Besoin de réapprovisionnement',
    },
  };

  const t = texts[language];

  // حساب إحصائيات إضافية
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const activePumps = pumps.filter(p => p.isActive).length;
  const totalCustomers = customers.length;
  const customersWithDebt = customers.filter(c => c.currentDebt > 0).length;

  // تنسيق الأرقام بالأرقام الإنجليزية دائماً
  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  // حساب نسبة التغيير (محاكاة - يمكن تحسينها لاحقاً)
  const getChangePercentage = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // محاكاة البيانات السابقة للمقارنة
  const previousMetrics = {
    dailyRevenue: metrics.dailyRevenue * 0.85,
    dailyFuelSales: metrics.dailyFuelSales * 0.92,
    dailyProfit: metrics.dailyProfit * 0.88,
  };

  const revenueChange = getChangePercentage(metrics.dailyRevenue, previousMetrics.dailyRevenue);
  const fuelSalesChange = getChangePercentage(metrics.dailyFuelSales, previousMetrics.dailyFuelSales);
  const profitChange = getChangePercentage(metrics.dailyProfit, previousMetrics.dailyProfit);

  // حساب معاملات اليوم
  const todayTransactions = storeSales.filter(s => s.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Daily Revenue */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">{t.dailyRevenue}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.dailyRevenue)}</p>
              <p className="text-blue-100 text-xs">{t.dzd}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
          <div className="flex items-center text-xs text-blue-100 mt-2">
            {revenueChange >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {formatNumber(Math.abs(revenueChange), 1)}% {t.compared}
          </div>
        </CardContent>
      </Card>

      {/* Daily Fuel Sales */}
      <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">{t.dailyFuelSales}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.dailyFuelSales, 0)}</p>
              <p className="text-yellow-100 text-xs">{t.liters}</p>
            </div>
            <Fuel className="w-8 h-8 text-yellow-200" />
          </div>
          <div className="flex items-center text-xs text-yellow-100 mt-2">
            {fuelSalesChange >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {formatNumber(Math.abs(fuelSalesChange), 1)}% {t.compared}
          </div>
        </CardContent>
      </Card>

      {/* Daily Profit */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">{t.dailyProfit}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.dailyProfit)}</p>
              <p className="text-green-100 text-xs">{t.dzd}</p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
          <div className="flex items-center text-xs text-green-100 mt-2">
            {profitChange >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {formatNumber(Math.abs(profitChange), 1)}% {t.compared}
          </div>
        </CardContent>
      </Card>

      {/* Total Debts */}
      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">{t.totalDebts}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.totalDebts)}</p>
              <p className="text-red-100 text-xs">{t.dzd}</p>
            </div>
            <CreditCard className="w-8 h-8 text-red-200" />
          </div>
          <div className="text-xs text-red-100 mt-2">
            {formatNumber(customersWithDebt, 0)} {t.from} {formatNumber(totalCustomers, 0)} {t.customers}
          </div>
        </CardContent>
      </Card>

      {/* Store Sales */}
      <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm font-medium">{t.dailyStoreSales}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.dailyStoreSales)}</p>
              <p className="text-teal-100 text-xs">{t.dzd}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-teal-200" />
          </div>
          <div className="text-xs text-teal-100 mt-2">
            {formatNumber(todayTransactions, 0)} {t.transactions} {t.today}
          </div>
        </CardContent>
      </Card>

      {/* Active Workers */}
      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">{t.activeWorkers}</p>
              <p className="text-3xl font-bold">{formatNumber(activeWorkers, 0)}</p>
              <p className="text-indigo-100 text-xs">{t.workers}</p>
            </div>
            <Users className="w-8 h-8 text-indigo-200" />
          </div>
          <div className="text-xs text-indigo-100 mt-2">
            {t.from} {t.total} {formatNumber(workers.length, 0)} {t.workers}
          </div>
        </CardContent>
      </Card>

      {/* Active Pumps */}
      <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm font-medium">{t.activePumps}</p>
              <p className="text-3xl font-bold">{formatNumber(activePumps, 0)}</p>
              <p className="text-cyan-100 text-xs">{t.pumps}</p>
            </div>
            <Gauge className="w-8 h-8 text-cyan-200" />
          </div>
          <div className="text-xs text-cyan-100 mt-2">
            {t.from} {t.total} {formatNumber(pumps.length, 0)} {t.pumps}
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">{t.lowStockAlerts}</p>
              <p className="text-3xl font-bold">{formatNumber(metrics.lowStockAlerts, 0)}</p>
              <p className="text-orange-100 text-xs">{t.items}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-200" />
          </div>
          <div className="text-xs text-orange-100 mt-2">
            {t.needsRefill}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardMetrics;