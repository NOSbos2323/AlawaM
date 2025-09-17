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
import { Users, Plus, User, DollarSign, Calendar, Briefcase } from 'lucide-react';

interface WorkerManagementProps {
  language?: 'ar' | 'fr';
}

const WorkerManagement: React.FC<WorkerManagementProps> = ({ language = 'ar' }) => {
  const {
    workers,
    salaryPayments,
    addWorker,
    addSalaryPayment,
    updateWorker,
  } = useGasStationStore();

  const [newWorker, setNewWorker] = useState({
    name: '',
    positionAr: '',
    positionFr: '',
    salary: '',
    hireDate: '',
  });

  const [newPayment, setNewPayment] = useState({
    workerId: '',
    amount: '',
    period: '',
    notes: '',
  });

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
      hireDate: 'تاريخ التوظيف',
      active: 'نشط',
      inactive: 'غير نشط',
      amount: 'المبلغ',
      period: 'الفترة',
      notes: 'ملاحظات',
      date: 'التاريخ',
      save: 'حفظ',
      cancel: 'إلغاء',
      totalWorkers: 'إجمالي العمال',
      activeWorkers: 'العمال النشطون',
      monthlySalaries: 'الرواتب الشهرية',
      recentPayments: 'المدفوعات الأخيرة',
      selectWorker: 'اختر العامل',
      paymentHistory: 'تاريخ المدفوعات',
      deactivate: 'إلغاء التفعيل',
      activate: 'تفعيل',
      manager: 'مدير',
      cashier: 'أمين صندوق',
      attendant: 'عامل محطة',
      mechanic: 'ميكانيكي',
      cleaner: 'عامل نظافة',
    },
    fr: {
      title: 'Gestion des travailleurs',
      workers: 'Travailleurs',
      salaries: 'Salaires',
      addWorker: 'Ajouter un travailleur',
      addPayment: 'Ajouter un paiement',
      workerName: 'Nom du travailleur',
      position: 'Poste',
      salary: 'Salaire',
      hireDate: 'Date d\'embauche',
      active: 'Actif',
      inactive: 'Inactif',
      amount: 'Montant',
      period: 'Période',
      notes: 'Notes',
      date: 'Date',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      totalWorkers: 'Total des travailleurs',
      activeWorkers: 'Travailleurs actifs',
      monthlySalaries: 'Salaires mensuels',
      recentPayments: 'Paiements récents',
      selectWorker: 'Sélectionner un travailleur',
      paymentHistory: 'Historique des paiements',
      deactivate: 'Désactiver',
      activate: 'Activer',
      manager: 'Directeur',
      cashier: 'Caissier',
      attendant: 'Pompiste',
      mechanic: 'Mécanicien',
      cleaner: 'Agent de nettoyage',
    },
  };

  const t = texts[language];

  const positions = [
    { ar: 'مدير', fr: 'Directeur' },
    { ar: 'أمين صندوق', fr: 'Caissier' },
    { ar: 'عامل محطة', fr: 'Pompiste' },
    { ar: 'ميكانيكي', fr: 'Mécanicien' },
    { ar: 'عامل نظافة', fr: 'Agent de nettoyage' },
  ];

  const handleAddWorker = () => {
    if (newWorker.name && newWorker.positionAr && newWorker.positionFr && newWorker.salary && newWorker.hireDate) {
      addWorker({
        name: newWorker.name,
        position: { ar: newWorker.positionAr, fr: newWorker.positionFr },
        salary: parseFloat(newWorker.salary),
        hireDate: newWorker.hireDate,
        isActive: true,
      });
      setNewWorker({ name: '', positionAr: '', positionFr: '', salary: '', hireDate: '' });
    }
  };

  const handleAddPayment = () => {
    if (newPayment.workerId && newPayment.amount && newPayment.period) {
      addSalaryPayment({
        workerId: newPayment.workerId,
        amount: parseFloat(newPayment.amount),
        period: newPayment.period,
        date: new Date().toISOString().split('T')[0],
        notes: newPayment.notes,
      });
      setNewPayment({ workerId: '', amount: '', period: '', notes: '' });
    }
  };

  const toggleWorkerStatus = (workerId: string, currentStatus: boolean) => {
    updateWorker(workerId, { isActive: !currentStatus });
  };

  const getWorkerPayments = (workerId: string) => {
    return salaryPayments.filter(p => p.workerId === workerId).slice(-5);
  };

  const activeWorkers = workers.filter(w => w.isActive);
  const totalMonthlySalaries = activeWorkers.reduce((sum, worker) => sum + worker.salary, 0);

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
                  />
                </div>
                <div>
                  <Label>{t.position} (العربية)</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newWorker.positionAr}
                    onChange={(e) => {
                      const selectedPosition = positions.find(p => p.ar === e.target.value);
                      setNewWorker(prev => ({ 
                        ...prev, 
                        positionAr: e.target.value,
                        positionFr: selectedPosition?.fr || ''
                      }));
                    }}
                  >
                    <option value="">اختر المنصب</option>
                    {positions.map(pos => (
                      <option key={pos.ar} value={pos.ar}>{pos.ar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{t.position} (Français)</Label>
                  <Input
                    value={newWorker.positionFr}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, positionFr: e.target.value }))}
                    readOnly
                  />
                </div>
                <div>
                  <Label>{t.salary}</Label>
                  <Input
                    type="number"
                    value={newWorker.salary}
                    onChange={(e) => setNewWorker(prev => ({ ...prev, salary: e.target.value }))}
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
                    {activeWorkers.map(worker => (
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
                  />
                </div>
                <div>
                  <Label>{t.period}</Label>
                  <Input
                    value={newPayment.period}
                    placeholder="مثال: يناير 2024"
                    onChange={(e) => setNewPayment(prev => ({ ...prev, period: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.notes}</Label>
                  <Textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
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
                <p className="text-sm font-medium text-muted-foreground">{t.totalWorkers}</p>
                <p className="text-2xl font-bold">{workers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.activeWorkers}</p>
                <p className="text-2xl font-bold text-green-600">{activeWorkers.length}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.monthlySalaries}</p>
                <p className="text-2xl font-bold text-purple-600">{totalMonthlySalaries.toFixed(2)} SAR</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workers">{t.workers}</TabsTrigger>
          <TabsTrigger value="payments">{t.recentPayments}</TabsTrigger>
        </TabsList>

        <TabsContent value="workers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker) => {
              const recentPayments = getWorkerPayments(worker.id);
              const lastPayment = recentPayments[0];

              return (
                <Card key={worker.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {worker.name}
                      </span>
                      <Badge variant={worker.isActive ? 'default' : 'secondary'}>
                        {worker.isActive ? t.active : t.inactive}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{worker.position[language]}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold">{worker.salary.toFixed(2)} SAR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(worker.hireDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {lastPayment && (
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm font-medium">آخر راتب</p>
                        <p className="text-sm text-muted-foreground">{lastPayment.period}</p>
                        <p className="font-bold">{lastPayment.amount.toFixed(2)} SAR</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={worker.isActive ? "destructive" : "default"}
                        onClick={() => toggleWorkerStatus(worker.id, worker.isActive)}
                      >
                        {worker.isActive ? t.deactivate : t.activate}
                      </Button>
                    </div>

                    {recentPayments.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t.paymentHistory}</p>
                        {recentPayments.slice(0, 3).map((payment) => (
                          <div key={payment.id} className="text-xs flex justify-between">
                            <span>{payment.period}</span>
                            <span className="font-mono">{payment.amount.toFixed(2)} SAR</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="space-y-4">
            {salaryPayments.slice(-20).reverse().map((payment) => {
              const worker = workers.find(w => w.id === payment.workerId);
              return (
                <Card key={payment.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{worker?.name}</p>
                        <p className="text-sm text-muted-foreground">{worker?.position[language]}</p>
                        <p className="text-sm text-muted-foreground">{payment.period}</p>
                        {payment.notes && (
                          <p className="text-xs text-muted-foreground">{payment.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(payment.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          {payment.amount.toFixed(2)} SAR
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerManagement;