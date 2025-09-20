import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGasStationStore } from '@/store/gasStationStore';
import { FileText, Download, Calendar, BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface ReportsProps {
  language?: 'ar' | 'fr';
}

const Reports: React.FC<ReportsProps> = ({ language = 'ar' }) => {
  const {
    dailyReadings = [],
    storeSales = [],
    customers = [],
    workers = [],
    salaryPayments = [],
    taxPayments = [],
    creditTransactions = [],
  } = useGasStationStore();

  const [reportPeriod, setReportPeriod] = useState({
    startDate: '',
    endDate: '',
    type: 'daily' as 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom',
  });

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'التقارير',
      dailyReport: 'تقرير يومي',
      weeklyReport: 'تقرير أسبوعي',
      monthlyReport: 'تقرير شهري',
      yearlyReport: 'تقرير سنوي',
      customReport: 'تقرير مخصص',
      generateReport: 'إنشاء تقرير',
      exportReport: 'تصدير التقرير',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      reportType: 'نوع التقرير',
      summary: 'الملخص',
      fuelSales: 'مبيعات الوقود',
      storeSales: 'مبيعات المتجر',
      totalRevenue: 'إجمالي الإيرادات',
      totalExpenses: 'إجمالي المصروفات',
      netProfit: 'صافي الربح',
      customerDebts: 'ديون العملاء',
      workerSalaries: 'رواتب العمال',
      taxesPaid: 'الضرائب المدفوعة',
      zakatPaid: 'الزكاة المدفوعة',
      fuelRevenue: 'إيرادات الوقود',
      storeRevenue: 'إيرادات المتجر',
      totalCustomers: 'إجمالي العملاء',
      activeWorkers: 'العمال النشطون',
      averageDailySales: 'متوسط المبيعات اليومية',
      topSellingItems: 'المنتجات الأكثر مبيعاً',
      customerPayments: 'مدفوعات العملاء',
      period: 'الفترة',
      amount: 'المبلغ',
      date: 'التاريخ',
      noDataAvailable: 'لا توجد بيانات متاحة',
      reportGenerated: 'تم إنشاء التقرير',
      selectPeriod: 'اختر الفترة',
    },
    fr: {
      title: 'Rapports',
      dailyReport: 'Rapport quotidien',
      weeklyReport: 'Rapport hebdomadaire',
      monthlyReport: 'Rapport mensuel',
      yearlyReport: 'Rapport annuel',
      customReport: 'Rapport personnalisé',
      generateReport: 'Générer un rapport',
      exportReport: 'Exporter le rapport',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      reportType: 'Type de rapport',
      summary: 'Résumé',
      fuelSales: 'Ventes de carburant',
      storeSales: 'Ventes du magasin',
      totalRevenue: 'Revenus totaux',
      totalExpenses: 'Dépenses totales',
      netProfit: 'Bénéfice net',
      customerDebts: 'Dettes clients',
      workerSalaries: 'Salaires des employés',
      taxesPaid: 'Taxes payées',
      zakatPaid: 'Zakat payé',
      fuelRevenue: 'Revenus carburant',
      storeRevenue: 'Revenus magasin',
      totalCustomers: 'Total clients',
      activeWorkers: 'Employés actifs',
      averageDailySales: 'Ventes quotidiennes moyennes',
      topSellingItems: 'Articles les plus vendus',
      customerPayments: 'Paiements clients',
      period: 'Période',
      amount: 'Montant',
      date: 'Date',
      noDataAvailable: 'Aucune donnée disponible',
      reportGenerated: 'Rapport généré',
      selectPeriod: 'Sélectionner la période',
    },
  };

  const t = texts[language];

  const getDateRange = () => {
    const today = new Date();
    let startDate: string, endDate: string;

    switch (reportPeriod.type) {
      case 'daily':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'monthly':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;
      case 'yearly':
        startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;
      case 'custom':
        startDate = reportPeriod.startDate;
        endDate = reportPeriod.endDate;
        break;
      default:
        startDate = endDate = today.toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  const generateReportData = () => {
    const { startDate, endDate } = getDateRange();

    if (!startDate || !endDate) {
      return null;
    }

    // Filter data by date range
    const periodReadings = dailyReadings.filter(
      reading => reading.date >= startDate && reading.date <= endDate
    );
    
    const periodStoreSales = storeSales.filter(
      sale => sale.date >= startDate && sale.date <= endDate
    );
    
    const periodSalaryPayments = salaryPayments.filter(
      payment => payment.date >= startDate && payment.date <= endDate
    );
    
    const periodTaxPayments = taxPayments.filter(
      payment => payment.date >= startDate && payment.date <= endDate
    );
    
    const periodCreditTransactions = creditTransactions.filter(
      transaction => transaction.date >= startDate && transaction.date <= endDate
    );

    // Calculate metrics
    const fuelRevenue = periodReadings.reduce((sum, reading) => sum + (reading.totalSales || 0), 0);
    const storeRevenue = periodStoreSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalRevenue = fuelRevenue + storeRevenue;
    
    const salaryExpenses = periodSalaryPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const taxExpenses = periodTaxPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalExpenses = salaryExpenses + taxExpenses;
    
    const netProfit = totalRevenue - totalExpenses;
    
    const customerDebts = customers.reduce((sum, customer) => sum + (customer.currentDebt || 0), 0);
    const customerPayments = periodCreditTransactions
      .filter(t => t.type === 'payment')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const days = Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const averageDailySales = totalRevenue / days;

    return {
      period: { startDate, endDate },
      revenue: {
        fuel: fuelRevenue,
        store: storeRevenue,
        total: totalRevenue,
      },
      expenses: {
        salaries: salaryExpenses,
        taxes: taxExpenses,
        total: totalExpenses,
      },
      profit: netProfit,
      customers: {
        total: customers.length,
        debts: customerDebts,
        payments: customerPayments,
      },
      workers: {
        active: workers.filter(w => w.status === 'active').length,
        salariesPaid: salaryExpenses,
      },
      averageDailySales,
      transactionCounts: {
        fuelSales: periodReadings.length,
        storeSales: periodStoreSales.length,
        salaryPayments: periodSalaryPayments.length,
        taxPayments: periodTaxPayments.length,
      },
    };
  };

  const reportData = generateReportData();

  const exportReport = () => {
    if (!reportData) return;

    const reportContent = {
      title: `${t.title} - ${reportPeriod.type}`,
      period: `${reportData.period.startDate} إلى ${reportData.period.endDate}`,
      data: reportData,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gas-station-report-${reportData.period.startDate}-${reportData.period.endDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reportTypes = [
    { value: 'daily', label: t.dailyReport },
    { value: 'weekly', label: t.weeklyReport },
    { value: 'monthly', label: t.monthlyReport },
    { value: 'yearly', label: t.yearlyReport },
    { value: 'custom', label: t.customReport },
  ];

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-8 w-8" />
          {t.title}
        </h1>
        {reportData && (
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t.exportReport}
          </Button>
        )}
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t.generateReport}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>{t.reportType}</Label>
              <Select
                value={reportPeriod.type}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom') =>
                  setReportPeriod(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {reportPeriod.type === 'custom' && (
              <>
                <div>
                  <Label>{t.startDate}</Label>
                  <Input
                    type="date"
                    value={reportPeriod.startDate}
                    onChange={(e) => setReportPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.endDate}</Label>
                  <Input
                    type="date"
                    value={reportPeriod.endDate}
                    onChange={(e) => setReportPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Results */}
      {reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.totalRevenue}</p>
                    <p className="text-2xl font-bold text-green-600">{reportData.revenue.total.toFixed(2)} دج</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.totalExpenses}</p>
                    <p className="text-2xl font-bold text-red-600">{reportData.expenses.total.toFixed(2)} دج</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.netProfit}</p>
                    <p className={`text-2xl font-bold ${reportData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {reportData.profit.toFixed(2)} دج
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t.averageDailySales}</p>
                    <p className="text-2xl font-bold text-purple-600">{reportData.averageDailySales.toFixed(2)} دج</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Report */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">{t.summary}</TabsTrigger>
              <TabsTrigger value="revenue">الإيرادات</TabsTrigger>
              <TabsTrigger value="expenses">المصروفات</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ملخص الإيرادات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.fuelRevenue}</span>
                      <span className="font-bold">{reportData.revenue.fuel.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.storeRevenue}</span>
                      <span className="font-bold">{reportData.revenue.store.toFixed(2)} دج</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t.totalRevenue}</span>
                        <span className="text-green-600">{reportData.revenue.total.toFixed(2)} دج</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>ملخص المصروفات</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.workerSalaries}</span>
                      <span className="font-bold">{reportData.expenses.salaries.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الضرائب والزكاة</span>
                      <span className="font-bold">{reportData.expenses.taxes.toFixed(2)} دج</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>{t.totalExpenses}</span>
                        <span className="text-red-600">{reportData.expenses.total.toFixed(2)} دج</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>معلومات العملاء</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.totalCustomers}</span>
                      <span className="font-bold">{reportData.customers.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.customerDebts}</span>
                      <span className="font-bold text-red-600">{reportData.customers.debts.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.customerPayments}</span>
                      <span className="font-bold text-green-600">{reportData.customers.payments.toFixed(2)} دج</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>معلومات العمال</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.activeWorkers}</span>
                      <span className="font-bold">{reportData.workers.active}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الرواتب المدفوعة</span>
                      <span className="font-bold">{reportData.workers.salariesPaid.toFixed(2)} دج</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الإيرادات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">مبيعات الوقود</h4>
                        <p className="text-2xl font-bold text-blue-600">{reportData.revenue.fuel.toFixed(2)} دج</p>
                        <p className="text-sm text-muted-foreground">
                          {reportData.transactionCounts.fuelSales} معاملة
                        </p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">مبيعات المتجر</h4>
                        <p className="text-2xl font-bold text-green-600">{reportData.revenue.store.toFixed(2)} دج</p>
                        <p className="text-sm text-muted-foreground">
                          {reportData.transactionCounts.storeSales} معاملة
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل المصروفات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">رواتب العمال</h4>
                        <p className="text-2xl font-bold text-orange-600">{reportData.expenses.salaries.toFixed(2)} دج</p>
                        <p className="text-sm text-muted-foreground">
                          {reportData.transactionCounts.salaryPayments} دفعة
                        </p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-medium mb-2">الضرائب والزكاة</h4>
                        <p className="text-2xl font-bold text-red-600">{reportData.expenses.taxes.toFixed(2)} دج</p>
                        <p className="text-sm text-muted-foreground">
                          {reportData.transactionCounts.taxPayments} دفعة
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">{t.noDataAvailable}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {isRTL ? 'اختر فترة زمنية لإنشاء التقرير' : 'Sélectionnez une période pour générer le rapport'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;