import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  const [showAdvancePaymentDialog, setShowAdvancePaymentDialog] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [showPaymentConfirmDialog, setShowPaymentConfirmDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ workerId: '', netSalary: 0, totalAdvances: 0, fullSalary: 0 });

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة العمال',
      workers: 'العمال',
      salaries: 'الرواتب',
      addWorker: 'إضافة عامل',
      addPayment: 'إضافة راتب',
      advancePayment: 'مصاريف مسبقة',
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
      monthEnded: 'انتهى الشهر',
      unpaid: 'غير مخلص',
      markAsPaid: 'تعديل كمخلص',
      confirmPayment: 'تأكيد الدفع',
      paymentConfirmation: 'تأكيد دفع الراتب',
      fullSalary: 'الراتب الكامل',
      advanceDeduction: 'خصم المصاريف المسبقة',
      netAmount: 'المبلغ الصافي',
      confirmPaymentText: 'هل تريد دفع الراتب للعامل؟',
      totalAdvances: 'إجمالي المصاريف المسبقة',
      lastPayments: 'آخر المدفوعات',
    },
    fr: {
      title: 'Gestion du personnel',
      workers: 'Personnel',
      salaries: 'Salaires',
      addWorker: 'Ajouter un employé',
      addPayment: 'Ajouter un paiement',
      advancePayment: 'Avance sur salaire',
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
      monthEnded: 'Mois terminé',
      unpaid: 'Non payé',
      markAsPaid: 'Marquer comme payé',
      confirmPayment: 'Confirmer le paiement',
      paymentConfirmation: 'Confirmation de paiement',
      fullSalary: 'Salaire complet',
      advanceDeduction: 'Déduction avances',
      netAmount: 'Montant net',
      confirmPaymentText: 'Voulez-vous payer le salaire de l\'employé?',
      totalAdvances: 'Total des avances',
      lastPayments: 'Derniers paiements',
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
      setShowAddWorkerDialog(false);
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
      setShowAddPaymentDialog(false);
    }
  };

  const handleAdvancePayment = () => {
    if (selectedWorkerId && newPayment.amount) {
      const paymentId = Date.now().toString();
      addSalaryPayment({
        id: paymentId,
        workerId: selectedWorkerId,
        amount: parseFloat(newPayment.amount),
        month: 'advance',
        year: new Date().getFullYear(),
        date: new Date().toISOString().split('T')[0],
        notes: newPayment.notes || 'مصاريف مسبقة',
      });
      setNewPayment({ workerId: '', amount: '', month: '', year: '', notes: '' });
      setSelectedWorkerId('');
      setShowAdvancePaymentDialog(false);
    }
  };

  const handleMarkAsPaid = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    
    if (worker) {
      // حساب إجمالي المصاريف المسبقة للعامل
      const advancePayments = salaryPayments.filter(p => 
        p.workerId === workerId && p.month === 'advance'
      );
      const totalAdvances = advancePayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // حساب الراتب الصافي بعد خصم المصاريف المسبقة
      const netSalary = worker.salary - totalAdvances;
      
      setPaymentDetails({
        workerId: workerId,
        netSalary: netSalary > 0 ? netSalary : 0,
        totalAdvances: totalAdvances,
        fullSalary: worker.salary
      });
      setShowPaymentConfirmDialog(true);
    }
  };

  const confirmPayment = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const paymentId = Date.now().toString();
    addSalaryPayment({
      id: paymentId,
      workerId: paymentDetails.workerId,
      amount: paymentDetails.netSalary,
      month: currentMonth.toString(),
      year: currentYear,
      date: new Date().toISOString().split('T')[0],
      notes: paymentDetails.totalAdvances > 0 ? 
        `راتب شهري - خصم مصاريف مسبقة: ${paymentDetails.totalAdvances.toFixed(2)} دج` : 
        'راتب شهري',
    });
    
    setShowPaymentConfirmDialog(false);
    setPaymentDetails({ workerId: '', netSalary: 0, totalAdvances: 0, fullSalary: 0 });
  };

  const getWorkerPayments = (workerId: string) => {
    return salaryPayments.filter(p => p.workerId === workerId);
  };

  const getLastPayments = (workerId: string, count: number = 3) => {
    const payments = getWorkerPayments(workerId);
    return payments.slice(-count).reverse();
  };

  const getLastPayment = (workerId: string) => {
    const payments = getWorkerPayments(workerId);
    return payments.length > 0 ? payments[payments.length - 1] : null;
  };

  const getTotalAdvances = (workerId: string) => {
    const advancePayments = salaryPayments.filter(p => 
      p.workerId === workerId && p.month === 'advance'
    );
    return advancePayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const isMonthEnded = (workerId: string) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();
    
    if (currentDay > 25) {
      const payments = salaryPayments.filter(p => 
        p.workerId === workerId && 
        p.month === currentMonth.toString() && 
        p.year === currentYear
      );
      return payments.length === 0;
    }
    return false;
  };

  const isWorkerUnpaid = (workerId: string) => {
    const worker = workers.find(w => w.id === workerId);
    if (!worker || !worker.hireDate) return false;

    const hireDate = new Date(worker.hireDate);
    const currentDate = new Date();
    
    // حساب عدد الأشهر منذ التوظيف
    const monthsDiff = (currentDate.getFullYear() - hireDate.getFullYear()) * 12 + 
                      (currentDate.getMonth() - hireDate.getMonth());
    
    // إذا مر شهر أو أكثر منذ التوظيف
    if (monthsDiff >= 1) {
      // التحقق من وجود مدفوعات للعامل
      const workerPayments = salaryPayments.filter(p => p.workerId === workerId && p.month !== 'advance');
      
      // إذا لم يكن هناك مدفوعات أو عدد المدفوعات أقل من عدد الأشهر
      return workerPayments.length < monthsDiff;
    }
    
    return false;
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
          <Dialog open={showAddWorkerDialog} onOpenChange={setShowAddWorkerDialog}>
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

          {/* نافذة ��لمصاريف المسبقة */}
          <Dialog open={showAdvancePaymentDialog} onOpenChange={setShowAdvancePaymentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.advancePayment}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
                  <Label>{t.notes}</Label>
                  <Textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="سبب المصاريف المسبقة"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdvancePayment}>{t.save}</Button>
                  <Button variant="outline" onClick={() => setShowAdvancePaymentDialog(false)}>
                    {t.cancel}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* نافذة تأكيد الدفع */}
          <AlertDialog open={showPaymentConfirmDialog} onOpenChange={setShowPaymentConfirmDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.paymentConfirmation}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t.confirmPaymentText}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-3 my-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{t.fullSalary}</span>
                  <span className="font-bold">{paymentDetails.fullSalary.toFixed(2)} دج</span>
                </div>
                {paymentDetails.totalAdvances > 0 && (
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <span className="font-medium text-orange-700">{t.advanceDeduction}</span>
                    <span className="font-bold text-orange-700">-{paymentDetails.totalAdvances.toFixed(2)} دج</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-green-50 rounded border-2 border-green-200">
                  <span className="font-bold text-green-700">{t.netAmount}</span>
                  <span className="font-bold text-green-700 text-lg">{paymentDetails.netSalary.toFixed(2)} دج</span>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                <AlertDialogAction onClick={confirmPayment} className="bg-green-600 hover:bg-green-700">
                  {t.confirmPayment}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">{t.activeWorkers}</p>
                <p className="text-3xl font-bold">{workers.filter(w => w.status === 'active').length}</p>
                <p className="text-indigo-100 text-xs">عامل</p>
              </div>
              <Users className="w-8 h-8 text-indigo-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">{t.monthlyPayroll}</p>
                <p className="text-3xl font-bold">{totalMonthlySalaries.toFixed(2)}</p>
                <p className="text-green-100 text-xs">دج</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{t.recentPayments}</p>
                <p className="text-3xl font-bold">{totalPaymentsThisMonth.toFixed(2)}</p>
                <p className="text-purple-100 text-xs">دج</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
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
                const lastPayments = getLastPayments(worker.id, 3);
                const monthEnded = isMonthEnded(worker.id);
                const unpaid = isWorkerUnpaid(worker.id);
                const totalAdvances = getTotalAdvances(worker.id);

                return (
                  <Card key={worker.id} className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {worker.name}
                          {monthEnded && (
                            <Badge variant="destructive" className="text-xs bg-red-500 text-white">
                              ⚠️ {t.monthEnded}
                            </Badge>
                          )}
                          {unpaid && (
                            <Badge variant="destructive" className="text-xs bg-orange-500 text-white">
                              💰 {t.unpaid}
                            </Badge>
                          )}
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
                            {t.hireDate}: {new Date(worker.hireDate).toLocaleDateString('en-US')}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">{t.monthlySalary}</span>
                          <span className="font-bold">{worker.salary.toFixed(2)} دج</span>
                        </div>
                        {totalAdvances > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-orange-600">{t.totalAdvances}</span>
                            <span className="text-sm font-medium text-orange-600">-{totalAdvances.toFixed(2)} دج</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm">المدفوعات</span>
                          <span className="text-sm font-medium">{workerPayments.length}</span>
                        </div>
                      </div>

                      {/* آخر المدفوعات */}
                      {lastPayments.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <h4 className="text-sm font-medium text-muted-foreground">{t.lastPayments}</h4>
                          {lastPayments.map((payment) => (
                            <div key={payment.id} className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground">
                                {payment.month === 'advance' ? 'مسبق' : months.find(m => m.value === payment.month)?.label} {payment.year}
                              </span>
                              <span className={`font-medium ${payment.month === 'advance' ? 'text-orange-600' : 'text-green-600'}`}>
                                {payment.month === 'advance' ? '-' : '+'}{payment.amount.toFixed(2)} دج
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="pt-2 border-t space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            setSelectedWorkerId(worker.id);
                            setShowAdvancePaymentDialog(true);
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-2" />
                          {t.advancePayment}
                        </Button>
                        
                        {unpaid && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsPaid(worker.id)}
                          >
                            ✓ {t.markAsPaid}
                          </Button>
                        )}
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