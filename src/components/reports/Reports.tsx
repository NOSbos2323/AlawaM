import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGasStationStore } from "@/store/gasStationStore";
import * as XLSX from "xlsx";
import {
  FileText,
  TrendingUp,
  DollarSign,
  BarChart3,
  Calendar,
  Download,
  Printer,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ReportsProps {
  language?: "ar" | "fr";
}

const Reports: React.FC<ReportsProps> = ({ language = "ar" }) => {
  const {
    dailyReadings,
    pumps,
    tanks,
    customers,
    workers,
    salaryPayments,
    storeItems,
    storeSales,
    taxRecords,
    fuelTypes,
    generateFinancialReport,
    getPumpStatistics,
    getInventoryReport,
    getDashboardMetrics,
    exportData,
    creditTransactions,
  } = useGasStationStore();

  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedReportType, setSelectedReportType] = useState("financial");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const isRTL = language === "ar";

  const texts = {
    ar: {
      title: "التقارير والإحصائيات",
      financialReports: "التقارير المالية",
      inventoryReports: "تقارير المخزون",
      salesReports: "تقارير المبيعات",
      workerReports: "تقارير العمال",
      taxReports: "التقارير الضريبية",
      generateReport: "إنشاء تقرير",
      exportData: "تصدير البيانات",
      printReport: "طباعة التقرير",
      period: "الفترة",
      today: "اليوم",
      thisWeek: "هذا الأسبوع",
      thisMonth: "هذا الشهر",
      thisYear: "هذا العام",
      custom: "مخصص",
      from: "من",
      to: "إلى",
      totalRevenue: "إجمالي الإيرادات",
      totalProfit: "إجمالي الربح",
      totalSales: "إجمالي المبيعات",
      fuelSales: "مبيعات الوقود",
      storeSales: "مبيعات المتجر",
      expenses: "المصروفات",
      netProfit: "الربح الصافي",
      dailyAverage: "المتوسط اليومي",
      monthlyAverage: "المتوسط الشهري",
      topSellingFuel: "أكثر أنواع الوقود مبيعاً",
      topSellingItem: "أكثر المنتجات مبيعاً",
      customerDebts: "ديون العملاء",
      workerSalaries: "رواتب العمال",
      tankLevels: "مستويات الخزانات",
      lowStock: "مخزون منخفض",
      outOfStock: "نفد المخزون",
      pumpPerformance: "أداء المضخات",
      efficiency: "الكفاءة",
      liters: "لتر",
      amount: "المبلغ",
      percentage: "النسبة",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      good: "جيد",
      warning: "تحذير",
      critical: "حرج",
      refresh: "تحديث",
      filter: "تصفية",
      noData: "لا توجد بيانات",
      loading: "جاري التحميل...",
      liquidity: "السيولة",
    },
    fr: {
      title: "Rapports et Statistiques",
      financialReports: "Rapports Financiers",
      inventoryReports: "Rapports d'Inventaire",
      salesReports: "Rapports de Ventes",
      workerReports: "Rapports du Personnel",
      taxReports: "Rapports Fiscaux",
      generateReport: "Générer un Rapport",
      exportData: "Exporter les Données",
      printReport: "Imprimer le Rapport",
      period: "Période",
      today: "Aujourd'hui",
      thisWeek: "Cette Semaine",
      thisMonth: "Ce Mois",
      thisYear: "Cette Année",
      custom: "Personnalisé",
      from: "De",
      to: "À",
      totalRevenue: "Revenus Totaux",
      totalProfit: "Profit Total",
      totalSales: "Ventes Totales",
      fuelSales: "Ventes de Carburant",
      storeSales: "Ventes du Magasin",
      expenses: "Dépenses",
      netProfit: "Profit Net",
      dailyAverage: "Moyenne Quotidienne",
      monthlyAverage: "Moyenne Mensuelle",
      topSellingFuel: "Carburant le Plus Vendu",
      topSellingItem: "Article le Plus Vendu",
      customerDebts: "Dettes Clients",
      workerSalaries: "Salaires du Personnel",
      tankLevels: "Niveaux des Réservoirs",
      lowStock: "Stock Faible",
      outOfStock: "Rupture de Stock",
      pumpPerformance: "Performance des Pompes",
      efficiency: "Efficacité",
      liters: "Litres",
      amount: "Montant",
      percentage: "Pourcentage",
      status: "Statut",
      active: "Actif",
      inactive: "Inactif",
      good: "Bon",
      warning: "Attention",
      critical: "Critique",
      refresh: "Actualiser",
      filter: "Filtrer",
      noData: "Aucune donnée",
      loading: "Chargement...",
      liquidity: "Liquidité",
    },
  };

  const t = texts[language];

  // حساب الإحصائيات
  const metrics = getDashboardMetrics();
  const inventoryReport = getInventoryReport();

  // تصفية البيانات حسب الفترة المحددة
  const getFilteredData = () => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (selectedPeriod) {
      case "today":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        );
        endDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
        );
        break;
      case "thisWeek":
        const weekStart = today.getDate() - today.getDay();
        startDate = new Date(today.getFullYear(), today.getMonth(), weekStart);
        endDate = new Date();
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date();
        break;
      case "custom":
        if (dateFrom && dateTo) {
          startDate = new Date(dateFrom);
          endDate = new Date(dateTo);
        }
        break;
    }

    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    return {
      readings: dailyReadings.filter(
        (r) => r.date >= startDateStr && r.date <= endDateStr,
      ),
      sales: storeSales.filter(
        (s) => s.date >= startDateStr && s.date <= endDateStr,
      ),
      payments: salaryPayments.filter(
        (p) => p.date >= startDateStr && p.date <= endDateStr,
      ),
    };
  };

  const filteredData = getFilteredData();

  // قيم مالية مشتقة
  const totalRevenueValue =
    filteredData.readings.reduce((sum, r) => sum + r.amount, 0) +
    filteredData.sales.reduce((sum, s) => sum + s.total, 0);
  const totalDebtsValue = customers.reduce((sum, c) => sum + c.currentDebt, 0);
  const nonCashPaymentsTotal = (creditTransactions || [])
    .filter(
      (t) =>
        t.type === "payment" && t.paymentMethod && t.paymentMethod !== "cash",
    )
    .reduce((sum, t) => sum + t.amount, 0);
  const liquidityValue =
    totalRevenueValue - totalDebtsValue - nonCashPaymentsTotal;

  // حساب إحصائيات الوقود
  const fuelStats = fuelTypes
    .map((fuel) => {
      const fuelReadings = filteredData.readings.filter((r) => {
        const pump = pumps.find((p) => p.id === r.pumpId);
        return pump?.fuelType === fuel.id;
      });

      const totalLiters = fuelReadings.reduce(
        (sum, r) => sum + r.litersSold,
        0,
      );
      const totalRevenue = fuelReadings.reduce((sum, r) => sum + r.amount, 0);

      return {
        ...fuel,
        totalLiters,
        totalRevenue,
        percentage:
          totalLiters > 0
            ? (totalLiters /
                filteredData.readings.reduce(
                  (sum, r) => sum + r.litersSold,
                  0,
                )) *
              100
            : 0,
      };
    })
    .sort((a, b) => b.totalLiters - a.totalLiters);

  // حساب أداء المضخات
  const pumpStats = pumps
    .map((pump) => {
      const pumpReadings = filteredData.readings.filter(
        (r) => r.pumpId === pump.id,
      );
      const totalLiters = pumpReadings.reduce(
        (sum, r) => sum + r.litersSold,
        0,
      );
      const totalRevenue = pumpReadings.reduce((sum, r) => sum + r.amount, 0);
      const profit = totalLiters * (pump.sellPrice - pump.buyPrice);

      return {
        ...pump,
        totalLiters,
        totalRevenue,
        profit,
        efficiency: pump.isActive
          ? Math.min(100, (totalLiters / 1000) * 100)
          : 0,
      };
    })
    .sort((a, b) => b.totalLiters - a.totalLiters);

  const handleExportData = () => {
    // إنشاء كتاب عمل Excel جديد
    const workbook = XLSX.utils.book_new();

    // ورقة التقرير المالي
    const financialData = [
      ["التقرير المالي", "", "", ""],
      [
        "الفترة:",
        selectedPeriod === "custom"
          ? `${dateFrom} إلى ${dateTo}`
          : t[selectedPeriod],
        "",
        "",
      ],
      ["", "", "", ""],
      ["البيان", "القيمة", "العملة", "النسبة"],
      [
        "إجمالي الإيرادات",
        (
          filteredData.readings.reduce((sum, r) => sum + r.amount, 0) +
          filteredData.sales.reduce((sum, s) => sum + s.total, 0)
        ).toFixed(2),
        "دج",
        "100%",
      ],
      [
        "مبيعات الوقود",
        filteredData.readings.reduce((sum, r) => sum + r.amount, 0).toFixed(2),
        "دج",
        (
          (filteredData.readings.reduce((sum, r) => sum + r.amount, 0) /
            (filteredData.readings.reduce((sum, r) => sum + r.amount, 0) +
              filteredData.sales.reduce((sum, s) => sum + s.total, 0))) *
          100
        ).toFixed(1) + "%",
      ],
      [
        "مبيعات المتجر",
        filteredData.sales.reduce((sum, s) => sum + s.total, 0).toFixed(2),
        "دج",
        (
          (filteredData.sales.reduce((sum, s) => sum + s.total, 0) /
            (filteredData.readings.reduce((sum, r) => sum + r.amount, 0) +
              filteredData.sales.reduce((sum, s) => sum + s.total, 0))) *
          100
        ).toFixed(1) + "%",
      ],
      [
        "ديون العملاء",
        customers.reduce((sum, c) => sum + c.currentDebt, 0).toFixed(2),
        "دج",
        "",
      ],
      ["", "", "", ""],
      ["تفصيل مبيعات الوقود حسب النوع", "", "", ""],
      ["نوع الوقود", "الكمية (لتر)", "الإيرادات (دج)", "النسبة"],
      ...fuelStats.map((fuel) => [
        fuel.name.ar,
        fuel.totalLiters.toFixed(0),
        fuel.totalRevenue.toFixed(2),
        fuel.percentage.toFixed(1) + "%",
      ]),
    ];

    const financialSheet = XLSX.utils.aoa_to_sheet(financialData);
    XLSX.utils.book_append_sheet(workbook, financialSheet, "التقرير المالي");

    // ورقة أداء المضخات
    const pumpData = [
      ["أداء المضخات", "", "", "", ""],
      ["", "", "", "", ""],
      ["اسم المضخة", "الحالة", "الكمية (لتر)", "الإيرادات (دج)", "الكفاءة"],
      ...pumpStats.map((pump) => [
        pump.name,
        pump.isActive ? "نشط" : "غير نشط",
        pump.totalLiters.toFixed(0),
        pump.totalRevenue.toFixed(2),
        pump.efficiency.toFixed(0) + "%",
      ]),
    ];

    const pumpSheet = XLSX.utils.aoa_to_sheet(pumpData);
    XLSX.utils.book_append_sheet(workbook, pumpSheet, "أداء المضخات");

    // ورقة مستويات الخزانات
    const tankData = [
      ["مستويات الخزانات", "", "", "", ""],
      ["", "", "", "", ""],
      [
        "نوع الوقود",
        "المستوى الحالي",
        "السعة الكاملة",
        "النسبة",
        "الأيام المتبقية",
      ],
      ...inventoryReport.fuelInventory.map((tank) => [
        tank.fuelType,
        tank.currentLevel.toFixed(0) + " لتر",
        tank.capacity.toFixed(0) + " لتر",
        tank.percentage.toFixed(1) + "%",
        tank.daysRemaining + " يوم",
      ]),
    ];

    const tankSheet = XLSX.utils.aoa_to_sheet(tankData);
    XLSX.utils.book_append_sheet(workbook, tankSheet, "مستويات الخزانات");

    // ورقة مخزون المتجر
    const storeData = [
      ["مخزون المتجر", "", "", ""],
      ["", "", "", ""],
      ["اسم المنتج", "المخزون الحالي", "الحد الأدنى", "الحالة"],
      ...inventoryReport.storeInventory.map((item) => [
        item.name,
        item.currentStock,
        item.minStock,
        item.status === "ok" ? "جيد" : item.status === "low" ? "منخفض" : "نفد",
      ]),
    ];

    const storeSheet = XLSX.utils.aoa_to_sheet(storeData);
    XLSX.utils.book_append_sheet(workbook, storeSheet, "مخزون المتجر");

    // ورقة رواتب العمال
    const workerData = [
      ["رواتب العمال", "", "", "", ""],
      ["", "", "", "", ""],
      [
        "اسم العامل",
        "المنصب",
        "الراتب الشهري",
        "إجمالي المدفوع",
        "المصاريف المسبقة",
      ],
      ...workers.map((worker) => {
        const workerPayments = salaryPayments.filter(
          (p) => p.workerId === worker.id,
        );
        const totalPaid = workerPayments.reduce((sum, p) => sum + p.amount, 0);
        const advancePayments = workerPayments.filter(
          (p) => p.month === "advance",
        );
        const totalAdvances = advancePayments.reduce(
          (sum, p) => sum + p.amount,
          0,
        );

        return [
          worker.name,
          worker.position,
          worker.salary.toFixed(2) + " دج",
          totalPaid.toFixed(2) + " دج",
          totalAdvances.toFixed(2) + " دج",
        ];
      }),
    ];

    const workerSheet = XLSX.utils.aoa_to_sheet(workerData);
    XLSX.utils.book_append_sheet(workbook, workerSheet, "رواتب العمال");

    // ورقة التقارير الضريبية
    if (taxRecords.length > 0) {
      const taxData = [
        ["التقارير الضريبية", "", "", ""],
        ["", "", "", ""],
        ["النوع", "الفترة", "المبلغ", "الحالة", "تاريخ الاستحقاق"],
        ...taxRecords.map((record) => [
          record.type === "tax" ? "ضريبة" : "زكاة",
          record.period,
          record.amount.toFixed(2) + " دج",
          record.status === "paid" ? "مدفوع" : "معلق",
          new Date(record.dueDate).toLocaleDateString("ar-SA"),
        ]),
      ];

      const taxSheet = XLSX.utils.aoa_to_sheet(taxData);
      XLSX.utils.book_append_sheet(workbook, taxSheet, "التقارير الضريبية");
    }

    // حفظ الملف
    const fileName = `تقرير-محطة-الوقود-${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              {t.exportData}
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              {t.printReport}
            </Button>
          </div>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="financial">{t.financialReports}</TabsTrigger>
            <TabsTrigger value="sales">{t.salesReports}</TabsTrigger>
            <TabsTrigger value="inventory">{t.inventoryReports}</TabsTrigger>
            <TabsTrigger value="workers">{t.workerReports}</TabsTrigger>
            <TabsTrigger value="taxes">{t.taxReports}</TabsTrigger>
          </TabsList>

          {/* Financial Reports */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">
                    {t.totalRevenue}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(
                      filteredData.readings.reduce(
                        (sum, r) => sum + r.amount,
                        0,
                      ) +
                      filteredData.sales.reduce((sum, s) => sum + s.total, 0)
                    ).toFixed(2)}{" "}
                    دج
                  </div>
                  <div className="flex items-center text-xs text-green-100 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% من الشهر الماضي
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">
                    {t.fuelSales}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredData.readings
                      .reduce((sum, r) => sum + r.litersSold, 0)
                      .toFixed(0)}{" "}
                    {t.liters}
                  </div>
                  <div className="text-sm text-blue-100">
                    {filteredData.readings
                      .reduce((sum, r) => sum + r.amount, 0)
                      .toFixed(2)}{" "}
                    دج
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">
                    {t.storeSales}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredData.sales
                      .reduce((sum, s) => sum + s.total, 0)
                      .toFixed(2)}{" "}
                    دج
                  </div>
                  <div className="text-sm text-purple-100">
                    {filteredData.sales.length} معاملة
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-orange-100">
                    {t.customerDebts}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {customers
                      .reduce((sum, c) => sum + c.currentDebt, 0)
                      .toFixed(2)}{" "}
                    دج
                  </div>
                  <div className="text-sm text-orange-100">
                    {customers.filter((c) => c.currentDebt > 0).length} عميل
                  </div>
                </CardContent>
              </Card>

              {/* Liquidity Card */}
              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-teal-100">
                    {t.liquidity}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {liquidityValue.toFixed(2)} دج
                  </div>
                  <div className="text-xs text-teal-100 mt-1">
                    بعد خصم ديون العملاء
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fuel Sales Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>{t.fuelSales} - تفصيل حسب النوع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fuelStats.map((fuel) => (
                    <div
                      key={fuel.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: fuel.color }}
                        />
                        <div>
                          <div className="font-medium">{fuel.name.ar}</div>
                          <div className="text-sm text-muted-foreground">
                            {fuel.totalLiters.toFixed(0)} {t.liters}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {fuel.totalRevenue.toFixed(2)} دج
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {fuel.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Reports */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.pumpPerformance}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pumpStats.map((pump) => (
                    <div
                      key={pump.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{pump.name}</div>
                        <Badge
                          variant={pump.isActive ? "default" : "secondary"}
                        >
                          {pump.isActive ? t.active : t.inactive}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold">
                            {pump.totalLiters.toFixed(0)}
                          </div>
                          <div className="text-muted-foreground">
                            {t.liters}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {pump.totalRevenue.toFixed(2)}
                          </div>
                          <div className="text-muted-foreground">دج</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold">
                            {pump.efficiency.toFixed(0)}%
                          </div>
                          <div className="text-muted-foreground">
                            {t.efficiency}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Reports */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tank Levels */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.tankLevels}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryReport.fuelInventory.map((tank) => {
                      const status =
                        tank.percentage > 50
                          ? "good"
                          : tank.percentage > 20
                            ? "warning"
                            : "critical";
                      const statusColor =
                        status === "good"
                          ? "text-green-600"
                          : status === "warning"
                            ? "text-yellow-600"
                            : "text-red-600";
                      const StatusIcon =
                        status === "good"
                          ? CheckCircle
                          : status === "warning"
                            ? AlertTriangle
                            : XCircle;

                      return (
                        <div
                          key={tank.tankId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                            <div>
                              <div className="font-medium">{tank.fuelType}</div>
                              <div className="text-sm text-muted-foreground">
                                {tank.currentLevel.toFixed(0)} /{" "}
                                {tank.capacity.toFixed(0)} {t.liters}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${statusColor}`}>
                              {tank.percentage.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {tank.daysRemaining} أيام متبقية
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Store Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>مخزون المتجر</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryReport.storeInventory.map((item) => {
                      const statusColor =
                        item.status === "ok"
                          ? "text-green-600"
                          : item.status === "low"
                            ? "text-yellow-600"
                            : "text-red-600";
                      const StatusIcon =
                        item.status === "ok"
                          ? CheckCircle
                          : item.status === "low"
                            ? AlertTriangle
                            : XCircle;

                      return (
                        <div
                          key={item.itemId}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">
                                الحد الأدنى: {item.minStock}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${statusColor}`}>
                              {item.currentStock}
                            </div>
                            <Badge
                              variant={
                                item.status === "ok"
                                  ? "default"
                                  : item.status === "low"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {item.status === "ok"
                                ? t.good
                                : item.status === "low"
                                  ? t.warning
                                  : t.critical}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Worker Reports */}
          <TabsContent value="workers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.workerSalaries}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workers.map((worker) => {
                    const workerPayments = salaryPayments.filter(
                      (p) => p.workerId === worker.id,
                    );
                    const totalPaid = workerPayments.reduce(
                      (sum, p) => sum + p.amount,
                      0,
                    );
                    const advancePayments = workerPayments.filter(
                      (p) => p.month === "advance",
                    );
                    const totalAdvances = advancePayments.reduce(
                      (sum, p) => sum + p.amount,
                      0,
                    );

                    return (
                      <div
                        key={worker.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {worker.position}
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div className="font-bold">
                              {worker.salary.toFixed(2)}
                            </div>
                            <div className="text-muted-foreground">
                              راتب شهري
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">
                              {totalPaid.toFixed(2)}
                            </div>
                            <div className="text-muted-foreground">
                              إجمالي المدفوع
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-orange-600">
                              {totalAdvances.toFixed(2)}
                            </div>
                            <div className="text-muted-foreground">
                              مصاريف مسبقة
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Reports */}
          <TabsContent value="taxes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.taxReports}</CardTitle>
              </CardHeader>
              <CardContent>
                {taxRecords.length > 0 ? (
                  <div className="space-y-4">
                    {taxRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">
                            {record.type === "tax" ? "ضريبة" : "زكاة"} -{" "}
                            {record.period}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            تاريخ الاستحقاق:{" "}
                            {new Date(record.dueDate).toLocaleDateString(
                              "en-US",
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {record.amount.toFixed(2)} دج
                          </div>
                          <Badge
                            variant={
                              record.status === "paid"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {record.status === "paid" ? "مدفوع" : "معلق"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t.noData}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;