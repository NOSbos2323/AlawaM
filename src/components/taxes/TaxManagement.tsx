import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGasStationStore } from '@/store/gasStationStore';
import { Percent, Plus, Calculator, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface TaxManagementProps {
  language?: 'ar' | 'fr';
}

const TaxManagement: React.FC<TaxManagementProps> = ({ language = 'ar' }) => {
  const {
    taxRecords,
    settings,
    addTaxRecord,
    updateTaxRecord,
    getDashboardMetrics,
  } = useGasStationStore();

  const [newTaxRecord, setNewTaxRecord] = useState({
    type: 'tax' as 'tax' | 'zakat',
    amount: '',
    period: '',
    dueDate: '',
  });

  const [calculatorData, setCalculatorData] = useState({
    revenue: '',
    expenses: '',
    period: '',
  });

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'الضرائب والزكاة',
      taxes: 'الضرائب',
      zakat: 'الزكاة',
      calculator: 'حاسبة الضرائب',
      addRecord: 'إضافة سجل',
      type: 'النوع',
      amount: 'المبلغ',
      period: 'الفترة',
      dueDate: 'تاريخ الاستحقاق',
      paidDate: 'تاريخ الدفع',
      status: 'الحالة',
      pending: 'معلق',
      paid: 'مدفوع',
      markAsPaid: 'تحديد كمدفوع',
      save: 'حفظ',
      cancel: 'إلغاء',
      totalTaxes: 'إجمالي الضرائب',
      totalZakat: 'إجمالي الزكاة',
      pendingPayments: 'المدفوعات المعلقة',
      revenue: 'الإيراد',
      expenses: 'المصروفات',
      netIncome: 'صافي الدخل',
      taxRate: 'معدل الضريبة',
      zakatRate: 'معدل الزكاة',
      calculateTax: 'حساب الضريبة',
      calculateZakat: 'حساب الزكاة',
      taxAmount: 'مبلغ الضريبة',
      zakatAmount: 'مبلغ الزكاة',
      overdue: 'متأخر',
      dueSoon: 'مستحق قريباً',
      recentRecords: 'السجلات الأخيرة',
    },
    fr: {
      title: 'Taxes et Zakat',
      taxes: 'Taxes',
      zakat: 'Zakat',
      calculator: 'Calculateur de taxes',
      addRecord: 'Ajouter un enregistrement',
      type: 'Type',
      amount: 'Montant',
      period: 'Période',
      dueDate: 'Date d\'échéance',
      paidDate: 'Date de paiement',
      status: 'Statut',
      pending: 'En attente',
      paid: 'Payé',
      markAsPaid: 'Marquer comme payé',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      totalTaxes: 'Total des taxes',
      totalZakat: 'Total du Zakat',
      pendingPayments: 'Paiements en attente',
      revenue: 'Revenus',
      expenses: 'Dépenses',
      netIncome: 'Revenu net',
      taxRate: 'Taux de taxe',
      zakatRate: 'Taux de Zakat',
      calculateTax: 'Calculer la taxe',
      calculateZakat: 'Calculer le Zakat',
      taxAmount: 'Montant de la taxe',
      zakatAmount: 'Montant du Zakat',
      overdue: 'En retard',
      dueSoon: 'Échéance proche',
      recentRecords: 'Enregistrements récents',
    },
  };

  const t = texts[language];

  const handleAddRecord = () => {
    if (newTaxRecord.amount && newTaxRecord.period && newTaxRecord.dueDate) {
      addTaxRecord({
        type: newTaxRecord.type,
        amount: parseFloat(newTaxRecord.amount),
        period: newTaxRecord.period,
        dueDate: newTaxRecord.dueDate,
        status: 'pending',
      });
      setNewTaxRecord({ type: 'tax', amount: '', period: '', dueDate: '' });
    }
  };

  const markAsPaid = (recordId: string) => {
    updateTaxRecord(recordId, {
      status: 'paid',
      paidDate: new Date().toISOString().split('T')[0],
    });
  };

  const calculateTaxAndZakat = () => {
    const revenue = parseFloat(calculatorData.revenue) || 0;
    const expenses = parseFloat(calculatorData.expenses) || 0;
    const netIncome = revenue - expenses;
    
    const taxAmount = netIncome * (settings.taxRate / 100);
    const zakatAmount = revenue * (settings.zakatRate / 100);
    
    return { netIncome, taxAmount, zakatAmount };
  };

  const getRecordStatus = (record: any) => {
    if (record.status === 'paid') return { color: 'default', text: t.paid, icon: CheckCircle };
    
    const dueDate = new Date(record.dueDate);
    const today = new Date();
    const daysDiff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return { color: 'destructive', text: t.overdue, icon: AlertTriangle };
    if (daysDiff <= 7) return { color: 'warning', text: t.dueSoon, icon: AlertTriangle };
    return { color: 'secondary', text: t.pending, icon: Calendar };
  };

  const totalTaxes = taxRecords.filter(r => r.type === 'tax').reduce((sum, r) => sum + r.amount, 0);
  const totalZakat = taxRecords.filter(r => r.type === 'zakat').reduce((sum, r) => sum + r.amount, 0);
  const pendingPayments = taxRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Percent className="h-8 w-8" />
          {t.title}
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t.addRecord}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addRecord}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{t.type}</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newTaxRecord.type}
                  onChange={(e) => setNewTaxRecord(prev => ({ ...prev, type: e.target.value as 'tax' | 'zakat' }))}
                >
                  <option value="tax">{t.taxes}</option>
                  <option value="zakat">{t.zakat}</option>
                </select>
              </div>
              <div>
                <Label>{t.amount}</Label>
                <Input
                  type="number"
                  value={newTaxRecord.amount}
                  onChange={(e) => setNewTaxRecord(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div>
                <Label>{t.period}</Label>
                <Input
                  value={newTaxRecord.period}
                  placeholder="مثال: الربع الأول 2024"
                  onChange={(e) => setNewTaxRecord(prev => ({ ...prev, period: e.target.value }))}
                />
              </div>
              <div>
                <Label>{t.dueDate}</Label>
                <Input
                  type="date"
                  value={newTaxRecord.dueDate}
                  onChange={(e) => setNewTaxRecord(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddRecord}>{t.save}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalTaxes}</p>
                <p className="text-2xl font-bold text-blue-600">{totalTaxes.toFixed(2)} SAR</p>
              </div>
              <Percent className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalZakat}</p>
                <p className="text-2xl font-bold text-green-600">{totalZakat.toFixed(2)} SAR</p>
              </div>
              <Percent className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.pendingPayments}</p>
                <p className="text-2xl font-bold text-red-600">{pendingPayments.toFixed(2)} SAR</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="records">{t.recentRecords}</TabsTrigger>
          <TabsTrigger value="calculator">{t.calculator}</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="space-y-4">
            {taxRecords.slice(-20).reverse().map((record) => {
              const status = getRecordStatus(record);
              const StatusIcon = status.icon;

              return (
                <Card key={record.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={record.type === 'tax' ? 'default' : 'secondary'}>
                            {record.type === 'tax' ? t.taxes : t.zakat}
                          </Badge>
                          <Badge variant={status.color as any} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {status.text}
                          </Badge>
                        </div>
                        <p className="font-medium">{record.period}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {t.dueDate}: {new Date(record.dueDate).toLocaleDateString()}
                          </p>
                          {record.paidDate && (
                            <p className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {t.paidDate}: {new Date(record.paidDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="font-bold text-lg">{record.amount.toFixed(2)} SAR</p>
                        {record.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => markAsPaid(record.id)}
                          >
                            {t.markAsPaid}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  {t.calculator}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{t.period}</Label>
                  <Input
                    value={calculatorData.period}
                    placeholder="مثال: الربع الأول 2024"
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, period: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.revenue}</Label>
                  <Input
                    type="number"
                    value={calculatorData.revenue}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, revenue: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.expenses}</Label>
                  <Input
                    type="number"
                    value={calculatorData.expenses}
                    onChange={(e) => setCalculatorData(prev => ({ ...prev, expenses: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t.taxRate}</span>
                    <span className="font-mono">{settings.taxRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.zakatRate}</span>
                    <span className="font-mono">{settings.zakatRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>النتائج</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculatorData.revenue && calculatorData.expenses && (
                  <>
                    {(() => {
                      const { netIncome, taxAmount, zakatAmount } = calculateTaxAndZakat();
                      return (
                        <div className="space-y-4">
                          <div className="bg-muted p-4 rounded-lg space-y-2">
                            <div className="flex justify-between">
                              <span>{t.revenue}</span>
                              <span className="font-mono">{parseFloat(calculatorData.revenue).toFixed(2)} SAR</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t.expenses}</span>
                              <span className="font-mono">-{parseFloat(calculatorData.expenses).toFixed(2)} SAR</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>{t.netIncome}</span>
                              <span className="font-mono">{netIncome.toFixed(2)} SAR</span>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-blue-800">{t.taxAmount}</span>
                                <span className="font-bold text-blue-800">{taxAmount.toFixed(2)} SAR</span>
                              </div>
                              <p className="text-sm text-blue-600">({settings.taxRate}% من صافي الدخل)</p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">{t.zakatAmount}</span>
                                <span className="font-bold text-green-800">{zakatAmount.toFixed(2)} SAR</span>
                              </div>
                              <p className="text-sm text-green-600">({settings.zakatRate}% من الإيراد)</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                setNewTaxRecord({
                                  type: 'tax',
                                  amount: taxAmount.toString(),
                                  period: calculatorData.period,
                                  dueDate: '',
                                });
                              }}
                            >
                              {t.calculateTax}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setNewTaxRecord({
                                  type: 'zakat',
                                  amount: zakatAmount.toString(),
                                  period: calculatorData.period,
                                  dueDate: '',
                                });
                              }}
                            >
                              {t.calculateZakat}
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaxManagement;