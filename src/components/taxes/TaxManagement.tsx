import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGasStationStore } from '@/store/gasStationStore';
import { Calculator, Plus, Receipt, DollarSign, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface TaxManagementProps {
  language?: 'ar' | 'fr';
}

const TaxManagement: React.FC<TaxManagementProps> = ({ language = 'ar' }) => {
  const {
    settings,
    dailyReadings = [],
    storeSales = [],
    taxPayments = [],
    addTaxPayment,
    updateSettings,
  } = useGasStationStore();

  const [newPayment, setNewPayment] = useState({
    type: 'tax' as 'tax' | 'zakat',
    amount: '',
    period: '',
    year: '',
    notes: '',
  });

  const [calculationPeriod, setCalculationPeriod] = useState({
    startDate: '',
    endDate: '',
  });

  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'الضرائب والزكاة',
      taxCalculation: 'حساب الضرائب',
      zakatCalculation: 'حساب الزكاة',
      payments: 'المدفوعات',
      addPayment: 'إضافة دفعة',
      taxRate: 'معدل الضريبة',
      zakatRate: 'معدل الزكاة',
      totalRevenue: 'إجمالي الإيرادات',
      taxableIncome: 'الدخل الخاضع للضريبة',
      taxAmount: 'مبلغ الضريبة',
      zakatAmount: 'مبلغ الزكاة',
      period: 'الفترة',
      year: 'السنة',
      amount: 'المبلغ',
      notes: 'ملاحظات',
      type: 'النوع',
      tax: 'ضريبة',
      zakat: 'زكاة',
      calculate: 'احسب',
      save: 'حفظ',
      cancel: 'إلغاء',
      startDate: 'تاريخ البداية',
      endDate: 'تاريخ النهاية',
      recentPayments: 'المدفوعات الأخيرة',
      totalTaxPaid: 'إجمالي الضرائب المدفوعة',
      totalZakatPaid: 'إجمالي الزكاة المدفوعة',
      pendingTax: 'الضريبة المستحقة',
      pendingZakat: 'الزكاة المستحقة',
      quarterly: 'ربع سنوي',
      annually: 'سنوي',
      monthly: 'شهري',
      noPayments: 'لا توجد مدفوعات',
      calculationResults: 'نتائج الحساب',
      fuelRevenue: 'إيرادات الوقود',
      storeRevenue: 'إيرادات المتجر',
      totalIncome: 'إجمالي الدخل',
      estimatedTax: 'الضريبة المقدرة',
      estimatedZakat: 'الزكاة المقدرة',
    },
    fr: {
      title: 'Taxes et Zakat',
      taxCalculation: 'Calcul des taxes',
      zakatCalculation: 'Calcul du Zakat',
      payments: 'Paiements',
      addPayment: 'Ajouter un paiement',
      taxRate: 'Taux de taxe',
      zakatRate: 'Taux de Zakat',
      totalRevenue: 'Revenus totaux',
      taxableIncome: 'Revenus imposables',
      taxAmount: 'Montant de la taxe',
      zakatAmount: 'Montant du Zakat',
      period: 'Période',
      year: 'Année',
      amount: 'Montant',
      notes: 'Notes',
      type: 'Type',
      tax: 'Taxe',
      zakat: 'Zakat',
      calculate: 'Calculer',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      recentPayments: 'Paiements récents',
      totalTaxPaid: 'Total taxes payées',
      totalZakatPaid: 'Total Zakat payé',
      pendingTax: 'Taxe en attente',
      pendingZakat: 'Zakat en attente',
      quarterly: 'Trimestriel',
      annually: 'Annuel',
      monthly: 'Mensuel',
      noPayments: 'Aucun paiement',
      calculationResults: 'Résultats du calcul',
      fuelRevenue: 'Revenus carburant',
      storeRevenue: 'Revenus magasin',
      totalIncome: 'Revenus totaux',
      estimatedTax: 'Taxe estimée',
      estimatedZakat: 'Zakat estimé',
    },
  };

  const t = texts[language];

  const handleAddPayment = () => {
    if (newPayment.amount && newPayment.period && newPayment.year) {
      const paymentId = Date.now().toString();
      addTaxPayment({
        id: paymentId,
        type: newPayment.type,
        amount: parseFloat(newPayment.amount),
        period: newPayment.period,
        year: parseInt(newPayment.year),
        date: new Date().toISOString().split('T')[0],
        notes: newPayment.notes,
      });
      setNewPayment({ type: 'tax', amount: '', period: '', year: '', notes: '' });
      setShowAddPaymentDialog(false);
    }
  };

  const calculateRevenue = () => {
    const { startDate, endDate } = calculationPeriod;
    
    if (!startDate || !endDate) {
      const currentYear = new Date().getFullYear();
      const start = `${currentYear}-01-01`;
      const end = `${currentYear}-12-31`;
      
      const fuelRevenue = dailyReadings
        .filter(reading => reading.date >= start && reading.date <= end)
        .reduce((sum, reading) => sum + (reading.totalSales || 0), 0);
      
      const storeRevenue = storeSales
        .filter(sale => sale.date >= start && sale.date <= end)
        .reduce((sum, sale) => sum + sale.total, 0);
      
      return { fuelRevenue, storeRevenue, totalRevenue: fuelRevenue + storeRevenue };
    }
    
    const fuelRevenue = dailyReadings
      .filter(reading => reading.date >= startDate && reading.date <= endDate)
      .reduce((sum, reading) => sum + (reading.totalSales || 0), 0);
    
    const storeRevenue = storeSales
      .filter(sale => sale.date >= startDate && sale.date <= endDate)
      .reduce((sum, sale) => sum + sale.total, 0);
    
    return { fuelRevenue, storeRevenue, totalRevenue: fuelRevenue + storeRevenue };
  };

  const { fuelRevenue, storeRevenue, totalRevenue } = calculateRevenue();
  const estimatedTax = totalRevenue * (settings.taxRate / 100);
  const estimatedZakat = totalRevenue * (settings.zakatRate / 100);

  const totalTaxPaid = taxPayments
    .filter(p => p.type === 'tax')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalZakatPaid = taxPayments
    .filter(p => p.type === 'zakat')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingTax = Math.max(0, estimatedTax - totalTaxPaid);
  const pendingZakat = Math.max(0, estimatedZakat - totalZakatPaid);

  const periods = [
    { value: 'Q1', label: isRTL ? 'الربع الأول' : 'Q1' },
    { value: 'Q2', label: isRTL ? 'الربع الثاني' : 'Q2' },
    { value: 'Q3', label: isRTL ? 'الربع الثالث' : 'Q3' },
    { value: 'Q4', label: isRTL ? 'الربع الرابع' : 'Q4' },
    { value: 'annual', label: t.annually },
  ];

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calculator className="h-8 w-8" />
          {t.title}
        </h1>
        <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t.addPayment}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addPayment}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.type}</Label>
                <Select value={newPayment.type} onValueChange={(value: 'tax' | 'zakat') => setNewPayment(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tax">{t.tax}</SelectItem>
                    <SelectItem value="zakat">{t.zakat}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.amount}</Label>
                <Input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>{t.period}</Label>
                <Select value={newPayment.period} onValueChange={(value) => setNewPayment(prev => ({ ...prev, period: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(period => (
                      <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t.year}</Label>
                <Input
                  type="number"
                  value={newPayment.year}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="2024"
                />
              </div>
              <div>
                <Label>{t.notes}</Label>
                <Input
                  value={newPayment.notes}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="ملاحظات إضافية"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPayment}>{t.save}</Button>
                <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>{t.cancel}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalTaxPaid}</p>
                <p className="text-2xl font-bold text-blue-600">{totalTaxPaid.toFixed(2)} دج</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalZakatPaid}</p>
                <p className="text-2xl font-bold text-green-600">{totalZakatPaid.toFixed(2)} دج</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.pendingTax}</p>
                <p className="text-2xl font-bold text-orange-600">{pendingTax.toFixed(2)} دج</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.pendingZakat}</p>
                <p className="text-2xl font-bold text-purple-600">{pendingZakat.toFixed(2)} دج</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculation">{t.calculationResults}</TabsTrigger>
          <TabsTrigger value="payments">{t.recentPayments}</TabsTrigger>
        </TabsList>

        <TabsContent value="calculation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.calculationResults}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t.startDate}</Label>
                  <Input
                    type="date"
                    value={calculationPeriod.startDate}
                    onChange={(e) => setCalculationPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.endDate}</Label>
                  <Input
                    type="date"
                    value={calculationPeriod.endDate}
                    onChange={(e) => setCalculationPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t.fuelRevenue}</p>
                      <p className="text-xl font-bold text-blue-600">{fuelRevenue.toFixed(2)} دج</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t.storeRevenue}</p>
                      <p className="text-xl font-bold text-green-600">{storeRevenue.toFixed(2)} دج</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{t.totalIncome}</p>
                      <p className="text-xl font-bold text-purple-600">{totalRevenue.toFixed(2)} دج</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.taxCalculation}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.taxRate}</span>
                      <span className="font-mono">{settings.taxRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.totalRevenue}</span>
                      <span className="font-mono">{totalRevenue.toFixed(2)} دج</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{t.estimatedTax}</span>
                        <span className="text-blue-600">{estimatedTax.toFixed(2)} دج</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المدفوع</span>
                      <span className="text-green-600">{totalTaxPaid.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>المتبقي</span>
                      <span className="text-red-600">{pendingTax.toFixed(2)} دج</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t.zakatCalculation}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t.zakatRate}</span>
                      <span className="font-mono">{settings.zakatRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.totalRevenue}</span>
                      <span className="font-mono">{totalRevenue.toFixed(2)} دج</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>{t.estimatedZakat}</span>
                        <span className="text-green-600">{estimatedZakat.toFixed(2)} دج</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>المدفوع</span>
                      <span className="text-green-600">{totalZakatPaid.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span>المتبقي</span>
                      <span className="text-red-600">{pendingZakat.toFixed(2)} دج</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {taxPayments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">{t.noPayments}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRTL ? 'لا توجد مدفوعات حتى الآن' : 'Aucun paiement pour le moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {taxPayments.slice(-20).reverse().map((payment) => {
                const periodLabel = periods.find(p => p.value === payment.period)?.label;

                return (
                  <Card key={payment.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={payment.type === 'tax' ? 'default' : 'secondary'}>
                              {payment.type === 'tax' ? t.tax : t.zakat}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {periodLabel} {payment.year}
                            </span>
                          </div>
                          {payment.notes && (
                            <p className="text-sm text-muted-foreground">{payment.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(payment.date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            payment.type === 'tax' ? 'text-blue-600' : 'text-green-600'
                          }`}>
                            {payment.amount.toFixed(2)} دج
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagement;