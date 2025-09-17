import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  CreditCardIcon,
  DollarSignIcon,
  Fuel,
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
  profits = "25,000 SAR",
  debts = "12,500 SAR",
  storeSales = "8,750 SAR",
  fuelTrend = 5,
  profitsTrend = 12,
  debtsTrend = -3,
  storeTrend = 8,
}: DashboardMetricsProps) => {
  const texts = {
    ar: {
      todaysMetrics: "مقاييس اليوم",
      fuelSold: "الوقود المباع",
      totalProfits: "إجمالي الأرباح",
      outstandingDebts: "الديون المستحقة",
      storeSales: "مبيعات المتجر",
    },
    fr: {
      todaysMetrics: "Métriques d'aujourd'hui",
      fuelSold: "Carburant vendu",
      totalProfits: "Bénéfices totaux",
      outstandingDebts: "Dettes en cours",
      storeSales: "Ventes du magasin",
    },
  };

  const t = texts[language];

  return (
    <div className="bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t.todaysMetrics}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={t.fuelSold}
          value={fuelSold}
          trend={fuelTrend}
          icon={<Fuel className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          language={language}
        />
        <MetricCard
          title={t.totalProfits}
          value={profits}
          trend={profitsTrend}
          icon={
            <DollarSignIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          }
          language={language}
        />
        <MetricCard
          title={t.outstandingDebts}
          value={debts}
          trend={debtsTrend}
          icon={
            <CreditCardIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          }
          language={language}
        />
        <MetricCard
          title={t.storeSales}
          value={storeSales}
          trend={storeTrend}
          icon={
            <DollarSignIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          }
          language={language}
        />
      </div>
    </div>
  );
};

export default DashboardMetrics;