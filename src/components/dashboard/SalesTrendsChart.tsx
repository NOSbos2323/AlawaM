import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface SalesTrendsChartProps {
  language?: 'ar' | 'fr';
  dailyData?: Array<{
    date: string;
    sales: number;
    profit: number;
  }>;
  weeklyData?: Array<{
    week: string;
    sales: number;
    profit: number;
  }>;
  monthlyData?: Array<{
    month: string;
    sales: number;
    profit: number;
  }>;
  storeData?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const defaultDailyData = [
  { date: "01/05", sales: 400, profit: 240 },
  { date: "02/05", sales: 300, profit: 180 },
  { date: "03/05", sales: 500, profit: 300 },
  { date: "04/05", sales: 280, profit: 168 },
  { date: "05/05", sales: 590, profit: 354 },
  { date: "06/05", sales: 320, profit: 192 },
  { date: "07/05", sales: 350, profit: 210 },
];

const defaultWeeklyData = [
  { week: "W1", sales: 2400, profit: 1440 },
  { week: "W2", sales: 1980, profit: 1188 },
  { week: "W3", sales: 2800, profit: 1680 },
  { week: "W4", sales: 3200, profit: 1920 },
];

const defaultMonthlyData = [
  { month: "Jan", sales: 9800, profit: 5880 },
  { month: "Feb", sales: 8900, profit: 5340 },
  { month: "Mar", sales: 10200, profit: 6120 },
  { month: "Apr", sales: 9100, profit: 5460 },
  { month: "May", sales: 9600, profit: 5760 },
  { month: "Jun", sales: 8800, profit: 5280 },
];

const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({
  language = 'ar',
  dailyData = defaultDailyData,
  weeklyData = defaultWeeklyData,
  monthlyData = defaultMonthlyData,
  storeData,
}) => {
  const [timeRange, setTimeRange] = useState("daily");
  const [chartType, setChartType] = useState("sales");

  const texts = {
    ar: {
      salesTrends: "اتجاهات المبيعات",
      daily: "يومي",
      weekly: "أسبوعي", 
      monthly: "شهري",
      sales: "المبيعات",
      profit: "الربح",
      storeSales: "مبيعات المتجر",
      carOil: "زيت السيارات",
      waterBottles: "زجاجات المياه",
      methaneGas: "غاز الميثان",
    },
    fr: {
      salesTrends: "Tendances des ventes",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel", 
      sales: "Ventes",
      profit: "Bénéfice",
      storeSales: "Ventes du magasin",
      carOil: "Huile de voiture",
      waterBottles: "Bouteilles d'eau",
      methaneGas: "Gaz méthane",
    },
  };

  const t = texts[language];

  const defaultStoreData = [
    { name: t.carOil, value: 45, color: "#0088FE" },
    { name: t.waterBottles, value: 30, color: "#00C49F" },
    { name: t.methaneGas, value: 25, color: "#FFBB28" },
  ];

  const finalStoreData = storeData || defaultStoreData;

  const getActiveData = () => {
    switch (timeRange) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const getXAxisKey = () => {
    switch (timeRange) {
      case "daily":
        return "date";
      case "weekly":
        return "week";
      case "monthly":
        return "month";
      default:
        return "date";
    }
  };

  return (
    <Card className="w-full bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">{t.salesTrends}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sales">{t.sales}</SelectItem>
              <SelectItem value="profit">{t.profit}</SelectItem>
              <SelectItem value="store">{t.storeSales}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {chartType === "store" ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalStoreData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {finalStoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <>
            <Tabs
              value={timeRange}
              onValueChange={setTimeRange}
              className="mb-4"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">{t.daily}</TabsTrigger>
                <TabsTrigger value="weekly">{t.weekly}</TabsTrigger>
                <TabsTrigger value="monthly">{t.monthly}</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getActiveData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getXAxisKey()} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey={chartType}
                    stroke="#2563EB"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTrendsChart;