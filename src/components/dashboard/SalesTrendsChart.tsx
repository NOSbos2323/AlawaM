import React, { useState, useMemo } from "react";
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
  BarChart,
  Bar,
} from "recharts";
import { useGasStationStore } from "@/store/gasStationStore";
import { TrendingUp, BarChart3 } from "lucide-react";

interface SalesTrendsChartProps {
  language?: 'ar' | 'fr';
}

const SalesTrendsChart: React.FC<SalesTrendsChartProps> = ({
  language = 'ar',
}) => {
  const { 
    dailyReadings, 
    storeSales, 
    storeItems, 
    fuelTypes,
    isRTL 
  } = useGasStationStore();
  
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
      fuelSales: "مبيعات الوقود",
      totalRevenue: "إجمالي الإيرادات",
      noData: "لا توجد بيانات متاحة",
      dzd: "دج",
      liters: "لتر",
      overview: "نظرة عامة على اتجاهات المبيعات"
    },
    fr: {
      salesTrends: "Tendances des ventes",
      daily: "Quotidien",
      weekly: "Hebdomadaire",
      monthly: "Mensuel", 
      sales: "Ventes",
      profit: "Bénéfice",
      storeSales: "Ventes du magasin",
      fuelSales: "Ventes de carburant",
      totalRevenue: "Revenus totaux",
      noData: "Aucune donnée disponible",
      dzd: "DZD",
      liters: "Litres",
      overview: "Aperçu des tendances de vente"
    },
  };

  const t = texts[language];

  // معالجة البيانات الحقيقية
  const processedData = useMemo(() => {
    // بيانات المبيعات اليومية من قراءات المضخات
    const dailyFuelData = dailyReadings.map(reading => {
      const date = new Date(reading.date).toLocaleDateString('ar-EG', { 
        month: '2-digit', 
        day: '2-digit' 
      });
      
      const totalSales = reading.totalSales || 0;
      const totalProfit = totalSales * 0.15; // افتراض هامش ربح 15%
      
      return {
        date,
        sales: totalSales,
        profit: totalProfit,
        liters: reading.totalLiters || 0
      };
    }).slice(-7); // آخر 7 أيام

    // بيانات المبيعات الأسبوعية
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = i * 7;
      const weekEnd = weekStart + 7;
      const weekReadings = dailyReadings.slice(weekStart, weekEnd);
      
      const weekSales = weekReadings.reduce((sum, r) => sum + (r.totalSales || 0), 0);
      const weekProfit = weekSales * 0.15;
      
      weeklyData.push({
        week: `الأسبوع ${i + 1}`,
        sales: weekSales,
        profit: weekProfit
      });
    }

    // بيانات المبيعات الشهرية
    const monthlyData = [];
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
    
    for (let i = 0; i < 6; i++) {
      const monthReadings = dailyReadings.filter(r => {
        const readingMonth = new Date(r.date).getMonth();
        return readingMonth === i;
      });
      
      const monthSales = monthReadings.reduce((sum, r) => sum + (r.totalSales || 0), 0);
      const monthProfit = monthSales * 0.15;
      
      monthlyData.push({
        month: months[i],
        sales: monthSales,
        profit: monthProfit
      });
    }

    // بيانات مبيعات المتجر
    const storeData = storeItems.map(item => {
      const itemSales = storeSales
        .filter(sale => sale.items.some(saleItem => saleItem.itemId === item.id))
        .reduce((sum, sale) => {
          const saleItem = sale.items.find(si => si.itemId === item.id);
          return sum + (saleItem ? saleItem.quantity * item.sellPrice : 0);
        }, 0);

      return {
        name: item.name,
        value: itemSales,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).filter(item => item.value > 0).slice(0, 5); // أفضل 5 منتجات

    // بيانات مبيعات الوقود حسب النوع
    const fuelData = fuelTypes.map(fuel => {
      const fuelSales = dailyReadings.reduce((sum, reading) => {
        const fuelReading = reading.readings?.find(r => r.fuelType === fuel.name);
        return sum + (fuelReading ? fuelReading.totalSales || 0 : 0);
      }, 0);

      return {
        name: fuel.name,
        value: fuelSales,
        color: fuel.color || `hsl(${Math.random() * 360}, 70%, 50%)`
      };
    }).filter(fuel => fuel.value > 0);

    return {
      daily: dailyFuelData,
      weekly: weeklyData,
      monthly: monthlyData,
      store: storeData,
      fuel: fuelData
    };
  }, [dailyReadings, storeSales, storeItems, fuelTypes]);

  const getActiveData = () => {
    switch (timeRange) {
      case "daily":
        return processedData.daily;
      case "weekly":
        return processedData.weekly;
      case "monthly":
        return processedData.monthly;
      default:
        return processedData.daily;
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

  const getPieData = () => {
    if (chartType === "store") {
      return processedData.store;
    } else if (chartType === "fuel") {
      return processedData.fuel;
    }
    return [];
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.salesTrends}
            </h1>
            <p className="text-gray-600 mt-1">
              {t.overview}
            </p>
          </div>
        </div>

        {/* Chart Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {t.salesTrends}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="نوع الرسم البياني" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">{t.sales}</SelectItem>
                  <SelectItem value="profit">{t.profit}</SelectItem>
                  <SelectItem value="store">{t.storeSales}</SelectItem>
                  <SelectItem value="fuel">{t.fuelSales}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {chartType === "store" || chartType === "fuel" ? (
              <div className="h-[400px] w-full">
                {getPieData().length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent, value }) =>
                          `${name}: ${formatNumber(value)} ${t.dzd} (${(percent * 100).toFixed(1)}%)`
                        }
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatNumber(value) + ' ' + t.dzd, chartType === "store" ? t.storeSales : t.fuelSales]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {t.noData}
                  </div>
                )}
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
                <div className="h-[400px] w-full">
                  {getActiveData().length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getActiveData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={getXAxisKey()} />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [formatNumber(value) + ' ' + t.dzd, chartType === "sales" ? t.sales : t.profit]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey={chartType}
                          stroke="#2563EB"
                          activeDot={{ r: 8 }}
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      {t.noData}
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">إجمالي مبيعات الوقود</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(processedData.daily.reduce((sum, d) => sum + d.sales, 0))}
                  </p>
                  <p className="text-blue-100 text-xs">{t.dzd}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">إجمالي مبيعات المتجر</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(processedData.store.reduce((sum, s) => sum + s.value, 0))}
                  </p>
                  <p className="text-green-100 text-xs">{t.dzd}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">إجمالي الأرباح</p>
                  <p className="text-3xl font-bold">
                    {formatNumber(processedData.daily.reduce((sum, d) => sum + d.profit, 0))}
                  </p>
                  <p className="text-purple-100 text-xs">{t.dzd}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalesTrendsChart;