import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useGasStationStore } from "@/store/gasStationStore";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  CreditCardIcon,
  DollarSignIcon,
  Fuel,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Store,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
  icon: React.ReactNode;
  language?: 'ar' | 'fr';
}

const MetricCard = ({
  title,
  value,
  trend,
  icon,
  language = 'ar'
}: MetricCardProps) => {
  const isPositive = trend >= 0;

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
            {icon}
          </div>
          {trend !== 0 && (
            <div
              className={`flex items-center text-xs font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface DashboardMetricsProps {
  language?: 'ar' | 'fr';
  fuelSold?: string;
  profits?: string;
  debts?: string;
  storeSales?: string;
  fuelTrend?: number;
  profitsTrend?: number;
  debtsTrend?: number;
  storeTrend?: number;
}

const DashboardMetrics = ({
  language = 'ar',
  fuelSold = "1,250 L",
  profits = "25,000 دج",
  debts = "12,500 دج",
  storeSales = "8,750 دج",
  fuelTrend = 5,
  profitsTrend = 12,
  debtsTrend = -3,
  storeTrend = 8,
}: DashboardMetricsProps) => {
  const { 
    dailyReadings = [], 
    customers = [], 
    storeSales: storeTransactions = [],
    creditTransactions = []
  } = useGasStationStore();

  const texts = {
    ar: {
      todaysMetrics: "مقاييس اليوم",
      dailyRevenue: "الإيرادات اليومية",
      dailyProfit: "الأرباح اليومية", 
      totalDebts: "إجمالي الديون",
      storeRevenue: "إيرادات المتجر",
      fuelSold: "الوقود المباع",
      totalProfits: "إجمالي الأرباح",
      outstandingDebts: "الديون المستحقة",
      storeSales: "مبيعات المتجر",
    },
    fr: {
      todaysMetrics: "Métriques d'aujourd'hui",
      dailyRevenue: "Revenus quotidiens",
      dailyProfit: "Bénéfices quotidiens",
      totalDebts: "Total des dettes", 
      storeRevenue: "Revenus du magasin",
      fuelSold: "Carburant vendu",
      totalProfits: "Bénéfices totaux",
      outstandingDebts: "Dettes en cours",
      storeSales: "Ventes du magasin",
    },
  };

  const t = texts[language];

  // Calculate metrics from store data
  const today = new Date().toISOString().split('T')[0];
  const todayReadings = dailyReadings.filter(reading => reading.date === today);
  const todayStoreTransactions = storeTransactions.filter(transaction => transaction.date === today);
  
  const dailyRevenue = todayReadings.reduce((sum, reading) => sum + (reading.totalSales || 0), 0) +
                     todayStoreTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const dailyProfit = dailyRevenue * 0.15; // Assuming 15% profit margin
  const totalDebts = customers.reduce((sum, customer) => sum + (customer.currentDebt || 0), 0);
  const dailyStoreSales = todayStoreTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const metrics = {
    dailyRevenue,
    dailyProfit,
    totalDebts,
    dailyStoreSales
  };

  return (
    <div className="bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t.todaysMetrics}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.dailyRevenue}</p>
                <p className="text-2xl font-bold text-green-600">{metrics.dailyRevenue.toFixed(2)} دج</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.dailyProfit}</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.dailyProfit.toFixed(2)} دج</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalDebts}</p>
                <p className="text-2xl font-bold text-red-600">{metrics.totalDebts.toFixed(2)} دج</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.storeRevenue}</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.dailyStoreSales.toFixed(2)} دج</p>
              </div>
              <Store className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;