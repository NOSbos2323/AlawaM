import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useGasStationStore } from '@/store/gasStationStore';
import { Users, Plus, DollarSign, Calendar, User, Briefcase } from 'lucide-react';

interface WorkerManagementProps {
  language?: 'ar' | 'fr';
}

const WorkerManagement: React.FC<WorkerManagementProps> = ({ language = 'ar' }) => {
  const {
    workers = [],
    salaryPayments = [],
    addWorker,
    addSalaryPayment,
    updateWorker,
  } = useGasStationStore();

  const [newWorker, setNewWorker] = useState({
    name: '',
    position: '',
    salary: '',
    phone: '',
    address: '',
    hireDate: '',
  });

  const [newPayment, setNewPayment] = useState({
    workerId: '',
    amount: '',
    month: '',
    year: '',
    notes: '',
  });

  const [showAddWorkerDialog, setShowAddWorkerDialog] = useState(false);
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة العمال',
      workers: 'العمال',
      salaries: 'الرواتب',
      addWorker: 'إضافة عامل',
      addPayment: 'إضافة راتب',
      workerName: 'اسم العامل',
      position: 'المنصب',
      salary: 'الراتب',
      phone: 'الهاتف',
      address: 'العنوان',
      hireDate: 'تاريخ التوظيف',
      amount: 'المبلغ',
      month: 'الشهر',
      year: 'السنة',
      notes: 'ملاحظات',
      totalSalaries: 'إجمالي الرواتب',
      activeWorkers: 'العمال النشطون',
      monthlyPayroll: 'كشف الرواتب الشهري',
      recentPayments: 'المدفوعات الأخيرة',
      save: 'حفظ',
      cancel: 'إلغاء',
      selectWorker: 'اختر العامل',
      paymentHistory: 'تاريخ المدفوعات',
      noWorkers: 'لا يوجد عمال',
      noPayments: 'لا توجد مدفوعات',
      monthlySalary: 'الراتب الشهري',
      lastPayment: 'آخر دفعة',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
    },
    fr: {
      title: 'Gestion du personnel',
      workers: 'Personnel',
      salaries: 'Salaires',
      addWorker: 'Ajouter un employé',
      addPayment: 'Ajouter un paiement',
      workerName: 'Nom de l\'employé',
      position: 'Poste',
      salary: 'Salaire',
      phone: 'Téléphone',
      address: 'Adresse',
      hireDate: 'Date d\'embauche',
      amount: 'Montant',
      month: 'Mois',
      year: 'Année',
      notes: 'Notes',
      totalSalaries: 'Total des salaires',
      activeWorkers: 'Employés actifs',
      monthlyPayroll: 'Paie mensuelle',
      recentPayments: 'Paiements récents',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      selectWorker: 'Sélectionner un employé',
      paymentHistory: 'Historique des paiements',
      noWorkers: 'Aucun employé',
      noPayments: 'Aucun paiement',
      monthlySalary: 'Salaire mensuel',
      lastPayment: 'Dernier paiement',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
    },
  };

  const t = texts[language];

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.position && newWorker.salary) {
      const workerId = Date.now().toString();
      addWorker({
        id: workerId,
        name: newWorker.name,
        position: newWorker.position,
        salary: parseFloat(newWorker.salary),
        phone: newWorker.phone,
        address: newWorker.address,
        hireDate: newWorker.hireDate,
        status: 'active',
      });
      setNewWorker({ name: '', position: '', salary: '', phone: '', address: '', hireDate: '' });
    }
  };

  const handleAddPayment = () => {
    if (newPayment.workerId && newPayment.amount && newPayment.month && newPayment.year) {
      const paymentId = Date.now().toString();
      addSalaryPayment({
        id: paymentId,
        workerId: newPayment.workerId,
        amount: parseFloat(newPayment.amount),
        month: newPayment.month,
        year: parseInt(newPayment.year),
        date: new Date().toISOString().split('T')[0],
        notes: newPayment.notes,
      });
      setNewPayment({ workerId: '', amount: '', month: '', year: '', notes: '' });
    }
  };

  const getWorkerPayments = (workerId: string) => {
    return salaryPayments.filter(p => p.workerId === workerId);
  };

  const getLastPayment = (workerId: string) => {
    const payments = getWorkerPayments(workerId);
    return payments.length > 0 ? payments[payments.length - 1] : null;
  };

  const totalMonthlySalaries = workers.reduce((sum, worker) => sum + (worker.salary || 0), 0);
  const totalPaymentsThisMonth = salaryPayments
    .filter(p => {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      return p.month === currentMonth.toString() && p.year === currentYear;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const months = [
    { value: '1', label: isRTL ? 'يناير' : 'Janvier' },
    { value: '2', label: isRTL ? 'فبراير' : 'Février' },
    { value: '3', label: isRTL ? 'مارس' : 'Mars' },
    { value: '4', label: isRTL ? 'أبريل' : 'Avril' },
    { value: '5', label: isRTL ? 'مايو' : 'Mai' },
    { value: '6', label: isRTL ? 'يونيو' : 'Juin' },
    { value: '7', label: isRTL ? 'يوليو' : 'Juillet' },
    { value: '8', label: isRTL ? 'أغسطس' : 'Août' },
    { value: '9', label: isRTL ? 'سبتمبر' : 'Septembre' },
    { value: '10', label: isRTL ? 'أكتوبر' : 'Octobre' },
    { value: '11', label: isRTL ? 'نوفمبر' : 'Novembre' },
    { value: '12', label: isRTL ? 'ديسمبر' : 'Décembre' },
  ];

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          {t.title}
        </h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addWorker}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addWorker}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.workerName}</Label>
                  <Input
                    value={newWorker.name}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم العامل"
                  />
                </div>
                <div>
                  <Label>{t.position}</Label>
                  <Input
                    value={newWorker.position}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, position: e.target.value }))}
                    placeholder="المنصب"
                  />
                </div>
                <div>
                  <Label>{t.salary}</Label>
                  <Input
                    type="number"
                    value={newWorker.salary}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>{t.phone}</Label>
                  <Input
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <Label>{t.address}</Label>
                  <Textarea
                    value={newWorker.address}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="عنوان العامل"
                  />
                </div>
                <div>
                  <Label>{t.hireDate}</Label>
                  <Input
                    type="date"
                    value={newWorker.hireDate}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, hireDate: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddWorker}>{t.save}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
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
                  <Label>{t.selectWorker}</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newPayment.workerId}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, workerId: e.target.value }))}
                  >
                    <option value="">{t.selectWorker}</option>
                    {workers.map(worker => (
                      <option key={worker.id} value={worker.id}>{worker.name}</option>
                    ))}
                  </select>
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
                  <Label>{t.month}</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newPayment.month}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, month: e.target.value }))}
                  >
                    <option value="">{t.month}</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>{month.label}</option>
                    ))}
                  </select>
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
                  <Textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="ملاحظات إضافية"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddPayment}>{t.save}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.activeWorkers}</p>
                <p className="text-2xl font-bold">{workers.filter(w => w.status === 'active').length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.monthlyPayroll}</p>
                <p className="text-2xl font-bold text-green-600">{totalMonthlySalaries.toFixed(2)} دج</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.recentPayments}</p>
                <p className="text-2xl font-bold text-purple-600">{totalPaymentsThisMonth.toFixed(2)} دج</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workers">{t.workers}</TabsTrigger>
          <TabsTrigger value="payments">{t.paymentHistory}</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4">
          {workers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">{t.noWorkers}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRTL ? 'ابدأ بإضافة عامل جديد' : 'Commencez par ajouter un nouvel employé'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => {
                const lastPayment = getLastPayment(worker.id);
                const workerPayments = getWorkerPayments(worker.id);

                return (
                  <Card key={worker.id} className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {worker.name}
                        </span>
                        <Badge variant={worker.status === 'active' ? 'default' : 'secondary'}>
                          {worker.status === 'active' ? t.active : t.inactive}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{worker.position}</span>
                        </div>
                        {worker.phone && (
                          <p className="text-sm text-muted-foreground">{worker.phone}</p>
                        )}
                        {worker.hireDate && (
                          <p className="text-sm text-muted-foreground">
                            {t.hireDate}: {new Date(worker.hireDate).toLocaleDateString('ar-SA')}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t.monthlySalary}</span>
                          <span className="font-bold">{worker.salary.toFixed(2)} دج</span>
                        </div>
                        {lastPayment && (
                          <div className="flex justify-between">
                            <span className="text-sm">{t.lastPayment}</span>
                            <span className="text-sm text-muted-foreground">
                              {months.find(m => m.value === lastPayment.month)?.label} {lastPayment.year}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm">المدفوعات</span>
                          <span className="text-sm font-medium">{workerPayments.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {salaryPayments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">{t.noPayments}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRTL ? 'لا توجد مدفوعات حتى الآن' : 'Aucun paiement pour le moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {salaryPayments.slice(-20).reverse().map((payment) => {
                const worker = workers.find(w => w.id === payment.workerId);
                const monthName = months.find(m => m.value === payment.month)?.label;

                return (
                  <Card key={payment.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{worker?.name || 'عامل غير معروف'}</p>
                          <p className="text-sm text-muted-foreground">
                            {monthName} {payment.year}
                          </p>
                          {payment.notes && (
                            <p className="text-sm text-muted-foreground">{payment.notes}</p>
                          )}
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(payment.date).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-green-600">
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

export default WorkerManagement;