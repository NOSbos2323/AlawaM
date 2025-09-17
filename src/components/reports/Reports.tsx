import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGasStationStore } from '@/store/gasStationStore';
import { FileText, Download, Calendar, TrendingUp, DollarSign, Users, Fuel } from 'lucide-react';

interface ReportsProps {
  language?: 'ar' | 'fr';
}

const Reports: React.FC<ReportsProps> = ({ language = 'ar' }) => {
  const {
    dailyReadings,
    storeSales,
    creditTransactions,
    salaryPayments,
    taxRecords,
    customers,
    workers,
    fuelTypes,
    pumps,
  } = useGasStationStore();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const [reportType, setReportType] = useState('daily');

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'التقارير',
      dailyReport: 'التقرير اليومي',
      weeklyReport: 'التقرير الأسبوعي',
      monthlyReport: 'التقرير الشهري',
      customReport: 'تقرير مخصص',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      generateReport: 'إنشاء التقرير',
      exportReport: 'تصدير التقرير',
      fuelSales: 'مبيعات الوقود',
      storeSales: 'مبيعات المتجر',
      totalRevenue: 'إجمالي الإيراد',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      customerDebts: 'ديون العملاء',
      workerSalaries: 'رواتب العمال',
      taxesAndZakat: 'الضرائب والزكاة',
      summary: 'الملخص',
      details: 'التفاصيل',
      period: 'الفترة',
      amount: 'المبلغ',
      date: 'التاريخ',
      description: 'الوصف',
      noData: 'لا توجد بيانات للفترة المحددة',
      litersSold: 'لتر مباع',
      averageDaily: 'المتوسط اليومي',
      topCustomers: 'أفضل العملاء',
      topProducts: 'أفضل المنتجات',
      pumpPerformance: 'أداء المضخات',
    },
    fr: {
      title: 'Rapports',
      dailyReport: 'Rapport quotidien',
      weeklyReport: 'Rapport hebdomadaire',
      monthlyReport: 'Rapport mensuel',
      customReport: 'Rapport personnalisé',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      generateReport: 'Générer le rapport',
      exportReport: 'Exporter le rapport',
      fuelSales: 'Ventes de carburant',
      storeSales: 'Ventes du magasin',
      totalRevenue: 'Revenus totaux',
      totalExpenses: 'Dépenses totales',
      netProfit: 'Bénéfice net',
      customerDebts: 'Dettes clients',
      workerSalaries: 'Salaires des employés',
      taxesAndZakat: 'Taxes et Zakat',
      summary: 'Résumé',
      details: 'Détails',
      period: 'Période',
      amount: 'Montant',
      date: 'Date',
      description: 'Description',
      noData: 'Aucune donnée pour la période sélectionnée',
      litersSold: 'Litres vendus',
      averageDaily: 'Moyenne quotidienne',
      topCustomers: 'Meilleurs clients',
      topProducts: 'Meilleurs produits',
      pumpPerformance: 'Performance des pompes',
    },
  };

  const t = texts[language];

  const filterDataByDateRange = (data: any[], dateField: string) => {
    return data.filter(item => {
      const itemDate = new Date(item[dateField]);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return itemDate >= start && itemDate <= end;
    });
  };

  const generateReportData = () => {
    const filteredReadings = filterDataByDateRange(dailyReadings, 'date');
    const filteredStoreSales = filterDataByDateRange(storeSales, 'date');
    const filteredCreditTransactions = filterDataByDateRange(creditTransactions, 'date');
    const filteredSalaryPayments = filterDataByDateRange(salaryPayments, 'date');
    const filteredTaxRecords = filterDataByDateRange(taxRecords, 'dueDate');

    // Calculate totals
    const fuelRevenue = filteredReadings.reduce((sum, reading) => sum + reading.revenue, 0);
    const fuelLiters = filteredReadings.reduce((sum, reading) => sum + reading.litersSold, 0);
    const storeRevenue = filteredStoreSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalRevenue = fuelRevenue + storeRevenue;

    const salaryExpenses = filteredSalaryPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const taxExpenses = filteredTaxRecords.filter(r => r.status === 'paid').reduce((sum, tax) => sum + tax.amount, 0);
    const totalExpenses = salaryExpenses + taxExpenses;

    const netProfit = totalRevenue - totalExpenses;

    const customerDebts = customers.reduce((sum, customer) => sum + customer.currentDebt, 0);

    // Calculate days in range
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

    // Pump performance
    const pumpPerformance = pumps.map(pump => {
      const pumpReadings = filteredReadings.filter(r => r.pumpId === pump.id);
      const pumpRevenue = pumpReadings.reduce((sum, r) => sum + r.revenue, 0);
      const pumpLiters = pumpReadings.reduce((sum, r) => sum + r.litersSold, 0);
      const fuelType = fuelTypes.find(ft => ft.id === pump.fuelType);
      
      return {
        pumpNumber: pump.number,
        fuelType: fuelType?.name[language] || '',
        revenue: pumpRevenue,
        liters: pumpLiters,
        transactions: pumpReadings.length,
      };
    });

    // Top customers by debt
    const topCustomers = customers
      .filter(c => c.currentDebt > 0)
      .sort((a, b) => b.currentDebt - a.currentDebt)
      .slice(0, 5);

    return {
      summary: {
        fuelRevenue,
        fuelLiters,
        storeRevenue,
        totalRevenue,
        totalExpenses,
        netProfit,
        customerDebts,
        averageDailyRevenue: totalRevenue / daysDiff,
        averageDailyLiters: fuelLiters / daysDiff,
      },
      details: {
        fuelSales: filteredReadings,
        storeSales: filteredStoreSales,
        creditTransactions: filteredCreditTransactions,
        salaryPayments: filteredSalaryPayments,
        taxRecords: filteredTaxRecords,
      },
      analytics: {
        pumpPerformance,
        topCustomers,
        daysDiff,
      },
    };
  };

  const exportReport = () => {
    const reportData = generateReportData();
    const reportContent = {
      period: `${dateRange.startDate} to ${dateRange.endDate}`,
      summary: reportData.summary,
      details: reportData.details,
      analytics: reportData.analytics,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(reportContent, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gas-station-report-${dateRange.startDate}-${dateRange.endDate}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const reportData = generateReportData();

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          {t.title}
        </h1>
        <Button onClick={exportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {t.exportReport}
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t.period}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t.startDate}</Label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>{t.endDate}</Label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={() => generateReportData()} className="w-full">
                {t.generateReport}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">{t.summary}</TabsTrigger>
          <TabsTrigger value="details">{t.details}</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.totalRevenue}</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.summary.totalRevenue.toFixed(2)} SAR</p>
                    <p className="text-xs text-muted-foreground">
                      {t.averageDaily}: {reportData.summary.averageDailyRevenue.toFixed(2)} SAR
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.fuelSales}</p>
                    <p className="text-2xl font-bold text-blue-600">{reportData.summary.fuelRevenue.toFixed(2)} SAR</p>
                    <p className="text-xs text-muted-foreground">
                      {reportData.summary.fuelLiters.toLocaleString()} {t.litersSold}
                    </p>
                  </div>
                  <Fuel className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.storeSales}</p>
                    <p className="text-2xl font-bold text-purple-600">{reportData.summary.storeRevenue.toFixed(2)} SAR</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.netProfit}</p>
                    <p className={`text-2xl font-bold ${reportData.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {reportData.summary.netProfit.toFixed(2)} SAR
                    </p>
                  </div>
                  <DollarSign className={`h-8 w-8 ${reportData.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.totalExpenses}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t.workerSalaries}</span>
                    <span className="font-mono">{reportData.summary.totalExpenses.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.taxesAndZakat}</span>
                    <span className="font-mono">
                      {reportData.details.taxRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0).toFixed(2)} SAR
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.customerDebts}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>إجمالي الديون</span>
                    <span className="font-mono text-red-600">{reportData.summary.customerDebts.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد العملاء المدينين</span>
                    <span className="font-mono">{customers.filter(c => c.currentDebt > 0).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Tabs defaultValue="fuel" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="fuel">{t.fuelSales}</TabsTrigger>
              <TabsTrigger value="store">{t.storeSales}</TabsTrigger>
              <TabsTrigger value="credits">الائتمان</TabsTrigger>
              <TabsTrigger value="salaries">الرواتب</TabsTrigger>
            </TabsList>

            <TabsContent value="fuel" className="space-y-4">
              {reportData.details.fuelSales.length > 0 ? (
                <div className="space-y-2">
                  {reportData.details.fuelSales.map((reading) => {
                    const pump = pumps.find(p => p.id === reading.pumpId);
                    const fuelType = fuelTypes.find(ft => ft.id === pump?.fuelType);
                    return (
                      <Card key={reading.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">مضخة {pump?.number} - {fuelType?.name[language]}</p>
                              <p className="text-sm text-muted-foreground">{reading.date}</p>
                              <p className="text-sm">{reading.litersSold.toLocaleString()} لتر</p>
                            </div>
                            <p className="font-bold text-lg">{reading.revenue.toFixed(2)} SAR</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">{t.noData}</p>
              )}
            </TabsContent>

            <TabsContent value="store" className="space-y-4">
              {reportData.details.storeSales.length > 0 ? (
                <div className="space-y-2">
                  {reportData.details.storeSales.map((sale) => (
                    <Card key={sale.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{sale.items.length} منتج</p>
                            <p className="text-sm text-muted-foreground">{sale.date}</p>
                            <p className="text-sm">{sale.paymentMethod === 'cash' ? 'نقدي' : 'آجل'}</p>
                          </div>
                          <p className="font-bold text-lg">{sale.total.toFixed(2)} SAR</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">{t.noData}</p>
              )}
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              {reportData.details.creditTransactions.length > 0 ? (
                <div className="space-y-2">
                  {reportData.details.creditTransactions.map((transaction) => {
                    const customer = customers.find(c => c.id === transaction.customerId);
                    return (
                      <Card key={transaction.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{customer?.name}</p>
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                              <p className="text-sm">{transaction.date}</p>
                            </div>
                            <p className={`font-bold text-lg ${transaction.type === 'credit' ? 'text-red-600' : 'text-green-600'}`}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)} SAR
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">{t.noData}</p>
              )}
            </TabsContent>

            <TabsContent value="salaries" className="space-y-4">
              {reportData.details.salaryPayments.length > 0 ? (
                <div className="space-y-2">
                  {reportData.details.salaryPayments.map((payment) => {
                    const worker = workers.find(w => w.id === payment.workerId);
                    return (
                      <Card key={payment.id} className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{worker?.name}</p>
                              <p className="text-sm text-muted-foreground">{payment.period}</p>
                              <p className="text-sm">{payment.date}</p>
                            </div>
                            <p className="font-bold text-lg text-red-600">{payment.amount.toFixed(2)} SAR</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">{t.noData}</p>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.pumpPerformance}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.analytics.pumpPerformance.map((pump) => (
                    <div key={pump.pumpNumber} className="flex justify-between items-center p-3 bg-muted rounded">
                      <div>
                        <p className="font-medium">مضخة {pump.pumpNumber}</p>
                        <p className="text-sm text-muted-foreground">{pump.fuelType}</p>
                        <p className="text-sm">{pump.liters.toLocaleString()} لتر</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{pump.revenue.toFixed(2)} SAR</p>
                        <p className="text-sm text-muted-foreground">{pump.transactions} معاملة</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.topCustomers}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.analytics.topCustomers.map((customer, index) => (
                    <div key={customer.id} className="flex justify-between items-center p-3 bg-muted rounded">
                      <div>
                        <p className="font-medium">#{index + 1} {customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          حد الائتمان: {customer.creditLimit.toFixed(2)} SAR
                        </p>
                      </div>
                      <p className="font-bold text-red-600">{customer.currentDebt.toFixed(2)} SAR</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;