import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGasStationStore } from '@/store/gasStationStore';
import { Bill } from '@/types';
import { 
  Receipt, 
  CreditCard, 
  Banknote, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Search,
  Filter,
  Calendar,
  DollarSign,
  FileText,
  Zap,
  Wifi,
  Phone,
  Car,
  Home,
  Trash2,
  Edit,
  Eye,
  Building2,
  FileCheck,
  ArrowDownToLine
} from 'lucide-react';

const TaxManagement: React.FC = () => {
  const { 
    bills, 
    addBill, 
    updateBill, 
    deleteBill, 
    payBill,
    customers = [],
    creditTransactions = []
  } = useGasStationStore();
  
  const [showAddBillDialog, setShowAddBillDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBankTransferDialog, setShowBankTransferDialog] = useState(false);
  const [showChequeDialog, setShowChequeDialog] = useState(false);
  const [showReceivedPaymentsDialog, setShowReceivedPaymentsDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // حالات للتحويلات البنكية والشيكات - استخدام البيانات الحقيقية
  const [bankTransfers, setBankTransfers] = useState<any[]>([]);
  const [cheques, setCheques] = useState<any[]>([]);
  const [receivedPayments, setReceivedPayments] = useState<any[]>([]);

  // استخراج البيانات الحقيقية من معاملات الديون والائتمان
  useEffect(() => {
    // التحويلات البنكية من معاملات الدفع
    const bankTransferTransactions = creditTransactions.filter(
      t => t.type === 'payment' && t.paymentMethod === 'bank_transfer'
    ).map(t => {
      const customer = customers.find(c => c.id === t.customerId);
      return {
        id: t.id,
        customerName: customer?.name || 'عميل غير معروف',
        customerId: t.customerId,
        amount: t.amount,
        transferDate: t.date,
        bankName: 'بنك الجزائر الخارجي', // يمكن إضافة هذا للمعاملة لاحقاً
        referenceNumber: `REF-${t.id.slice(-6)}`,
        notes: t.description,
        status: 'confirmed',
        createdAt: t.createdAt
      };
    });

    // الشيكات من معاملات الدفع
    const chequeTransactions = creditTransactions.filter(
      t => t.type === 'payment' && t.paymentMethod === 'cheque'
    ).map(t => {
      const customer = customers.find(c => c.id === t.customerId);
      return {
        id: t.id,
        customerName: customer?.name || 'عميل غير معروف',
        customerId: t.customerId,
        amount: t.amount,
        chequeNumber: `CHQ-${t.id.slice(-6)}`,
        bankName: 'بنك الفلاحة والت��مية الريفية',
        chequeDate: t.date,
        dueDate: t.date, // يمكن تحسين هذا
        notes: t.description,
        status: 'pending',
        createdAt: t.createdAt
      };
    });

    // جميع المدفوعات المستلمة
    const allPayments = creditTransactions.filter(
      t => t.type === 'payment'
    ).map(t => {
      const customer = customers.find(c => c.id === t.customerId);
      return {
        id: t.id,
        customerName: customer?.name || 'عميل غير معروف',
        customerId: t.customerId,
        amount: t.amount,
        paymentDate: t.date,
        paymentMethod: t.paymentMethod || 'cash',
        notes: t.description,
        status: 'received',
        createdAt: t.createdAt
      };
    });

    setBankTransfers(bankTransferTransactions);
    setCheques(chequeTransactions);
    setReceivedPayments(allPayments);
  }, [creditTransactions, customers]);

  const [newBankTransfer, setNewBankTransfer] = useState({
    customerName: '',
    customerId: '',
    amount: '',
    transferDate: '',
    bankName: '',
    referenceNumber: '',
    notes: '',
    status: 'pending'
  });

  const [newCheque, setNewCheque] = useState({
    customerName: '',
    customerId: '',
    amount: '',
    chequeNumber: '',
    bankName: '',
    chequeDate: '',
    dueDate: '',
    notes: '',
    status: 'pending'
  });

  const [newReceivedPayment, setNewReceivedPayment] = useState({
    customerName: '',
    customerId: '',
    amount: '',
    paymentDate: '',
    paymentMethod: 'cash',
    notes: '',
    status: 'received'
  });

  const [newBill, setNewBill] = useState<Partial<Bill>>({
    type: 'electricity',
    provider: '',
    accountNumber: '',
    amount: 0,
    dueDate: '',
    description: '',
    status: 'pending'
  });

  const [editBill, setEditBill] = useState<Partial<Bill>>({});

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'cash' as 'cash' | 'card' | 'bank_transfer',
    notes: ''
  });

  const billTypeIcons = {
    electricity: Zap,
    water: Receipt,
    internet: Wifi,
    phone: Phone,
    insurance: FileText,
    rent: Home,
    fuel: Car,
    other: FileText
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return Clock;
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || bill.status === filterStatus;
    const matchesType = filterType === 'all' || bill.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalBills = bills.length;
  const pendingAmount = bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.amount, 0);
  const paidThisMonth = bills.filter(b => b.status === 'paid' && b.paymentDate?.startsWith('2024-01')).reduce((sum, b) => sum + b.amount, 0);
  const overdueAmount = bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + b.amount, 0);

  const handleAddBill = () => {
    if (!newBill.provider || !newBill.accountNumber || !newBill.amount || !newBill.dueDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const bill: Omit<Bill, 'id'> = {
      type: newBill.type as Bill['type'],
      provider: newBill.provider,
      accountNumber: newBill.accountNumber,
      amount: Number(newBill.amount),
      dueDate: newBill.dueDate,
      status: 'pending',
      description: newBill.description || ''
    };

    addBill(bill);

    setNewBill({
      type: 'electricity',
      provider: '',
      accountNumber: '',
      amount: 0,
      dueDate: '',
      description: '',
      status: 'pending'
    });
    setShowAddBillDialog(false);
    alert('تم إضافة الفاتورة بنجاح');
  };

  const handleEditBill = () => {
    if (!selectedBill || !editBill.provider || !editBill.accountNumber || !editBill.amount || !editBill.dueDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    updateBill(selectedBill.id, editBill);
    setShowEditDialog(false);
    setSelectedBill(null);
    setEditBill({});
    alert('تم تحديث الفاتورة بنجاح');
  };

  const handlePayBill = () => {
    if (!selectedBill) return;

    payBill(selectedBill.id, paymentData.paymentMethod, paymentData.notes);
    setShowPaymentDialog(false);
    setSelectedBill(null);
    setPaymentData({ paymentMethod: 'cash', notes: '' });
    alert('تم دفع الفاتورة بنجاح');
  };

  const handleDeleteBill = (billId: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      deleteBill(billId);
      alert('تم حذف الفاتورة بنجاح');
    }
  };

  const openEditDialog = (bill: Bill) => {
    setSelectedBill(bill);
    setEditBill({
      type: bill.type,
      provider: bill.provider,
      accountNumber: bill.accountNumber,
      amount: bill.amount,
      dueDate: bill.dueDate,
      description: bill.description
    });
    setShowEditDialog(true);
  };

  const handleAddBankTransfer = () => {
    if (!newBankTransfer.customerName || !newBankTransfer.amount || !newBankTransfer.transferDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const transfer = {
      id: Date.now().toString(),
      ...newBankTransfer,
      amount: parseFloat(newBankTransfer.amount),
      createdAt: new Date().toISOString()
    };

    setBankTransfers([...bankTransfers, transfer]);
    setNewBankTransfer({
      customerName: '',
      customerId: '',
      amount: '',
      transferDate: '',
      bankName: '',
      referenceNumber: '',
      notes: '',
      status: 'pending'
    });
    setShowBankTransferDialog(false);
    alert('تم إضافة التحويل البنكي بنجاح');
  };

  const handleAddCheque = () => {
    if (!newCheque.customerName || !newCheque.amount || !newCheque.chequeNumber) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const cheque = {
      id: Date.now().toString(),
      ...newCheque,
      amount: parseFloat(newCheque.amount),
      createdAt: new Date().toISOString()
    };

    setCheques([...cheques, cheque]);
    setNewCheque({
      customerName: '',
      customerId: '',
      amount: '',
      chequeNumber: '',
      bankName: '',
      chequeDate: '',
      dueDate: '',
      notes: '',
      status: 'pending'
    });
    setShowChequeDialog(false);
    alert('تم إضافة الشيك بنجاح');
  };

  const handleAddReceivedPayment = () => {
    if (!newReceivedPayment.customerName || !newReceivedPayment.amount || !newReceivedPayment.paymentDate) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const payment = {
      id: Date.now().toString(),
      ...newReceivedPayment,
      amount: parseFloat(newReceivedPayment.amount),
      createdAt: new Date().toISOString()
    };

    setReceivedPayments([...receivedPayments, payment]);
    setNewReceivedPayment({
      customerName: '',
      customerId: '',
      amount: '',
      paymentDate: '',
      paymentMethod: 'cash',
      notes: '',
      status: 'received'
    });
    setShowReceivedPaymentsDialog(false);
    alert('تم إضافة المدفوعة المستلمة بنجاح');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <Receipt className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                الضرائب والفواتير
              </h1>
              <p className="text-gray-600 mt-1">
                إدارة الفواتير والتحويلات البنكية والشيكات
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Dialog open={showAddBillDialog} onOpenChange={setShowAddBillDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة فاتورة
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    إضافة فاتورة جديدة
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>نوع الفاتورة</Label>
                    <Select value={newBill.type} onValueChange={(value) => setNewBill({...newBill, type: value as Bill['type']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="electricity">كهرباء</SelectItem>
                        <SelectItem value="water">مياه</SelectItem>
                        <SelectItem value="internet">إنترنت</SelectItem>
                        <SelectItem value="phone">هاتف</SelectItem>
                        <SelectItem value="insurance">تأمين</SelectItem>
                        <SelectItem value="rent">إيجار</SelectItem>
                        <SelectItem value="fuel">وقود</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>مقدم الخدمة</Label>
                    <Input
                      value={newBill.provider}
                      onChange={(e) => setNewBill({...newBill, provider: e.target.value})}
                      placeholder="اسم مقدم الخدمة"
                    />
                  </div>

                  <div>
                    <Label>رقم الحساب</Label>
                    <Input
                      value={newBill.accountNumber}
                      onChange={(e) => setNewBill({...newBill, accountNumber: e.target.value})}
                      placeholder="رقم الحساب"
                    />
                  </div>

                  <div>
                    <Label>المبلغ</Label>
                    <Input
                      type="number"
                      value={newBill.amount}
                      onChange={(e) => setNewBill({...newBill, amount: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label>تاريخ الاستحقاق</Label>
                    <Input
                      type="date"
                      value={newBill.dueDate}
                      onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>الوصف</Label>
                    <Textarea
                      value={newBill.description}
                      onChange={(e) => setNewBill({...newBill, description: e.target.value})}
                      placeholder="وصف الفاتورة"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleAddBill} className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                      حفظ
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddBillDialog(false)} className="flex-1">
                      إلغاء
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards - تحديث الإحصائيات لتعكس البيانات الحقيقية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">إجمالي الفواتير</p>
                  <p className="text-3xl font-bold">{bills.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">التحويلات البنكية</p>
                  <p className="text-3xl font-bold">{bankTransfers.length}</p>
                  <p className="text-green-100 text-xs">
                    {bankTransfers.reduce((sum, t) => sum + t.amount, 0).toFixed(2)} دج
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">الشيكات المستلمة</p>
                  <p className="text-3xl font-bold">{cheques.length}</p>
                  <p className="text-purple-100 text-xs">
                    {cheques.reduce((sum, c) => sum + c.amount, 0).toFixed(2)} دج
                  </p>
                </div>
                <FileCheck className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">إجمالي المدفوعات</p>
                  <p className="text-3xl font-bold">{receivedPayments.length}</p>
                  <p className="text-orange-100 text-xs">
                    {receivedPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)} دج
                  </p>
                </div>
                <ArrowDownToLine className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="bills" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bills">الفواتير</TabsTrigger>
            <TabsTrigger value="bank-transfers">الت��ويلات البنكية</TabsTrigger>
            <TabsTrigger value="cheques">الشيكات</TabsTrigger>
            <TabsTrigger value="received-payments">المدفوعات المستلمة</TabsTrigger>
          </TabsList>

          {/* Bills Tab */}
          <TabsContent value="bills" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="بحث..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="تصفية" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="pending">معلقة</SelectItem>
                      <SelectItem value="paid">مدفوعة</SelectItem>
                      <SelectItem value="overdue">متأخرة</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="نوع الفاتورة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">الكل</SelectItem>
                      <SelectItem value="electricity">كهرباء</SelectItem>
                      <SelectItem value="water">مياه</SelectItem>
                      <SelectItem value="internet">إنترنت</SelectItem>
                      <SelectItem value="phone">هاتف</SelectItem>
                      <SelectItem value="insurance">تأمين</SelectItem>
                      <SelectItem value="rent">إيجار</SelectItem>
                      <SelectItem value="fuel">وقود</SelectItem>
                      <SelectItem value="other">أخرى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bills List */}
            <div className="grid gap-4">
              {filteredBills.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد فواتير</h3>
                    <p className="text-gray-500">ابدأ بإضافة فاتورة جديدة لإدارة مدفوعاتك</p>
                  </CardContent>
                </Card>
              ) : (
                filteredBills.map((bill) => {
                  const IconComponent = billTypeIcons[bill.type];
                  const StatusIcon = getStatusIcon(bill.status);
                  
                  return (
                    <Card key={bill.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                              <IconComponent className="w-6 h-6 text-blue-600" />
                            </div>
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{bill.provider}</h3>
                                <Badge className={`${getStatusColor(bill.status)} border`}>
                                  <StatusIcon className="w-3 h-3 ml-1" />
                                  {bill.status === 'pending' ? 'معلقة' : 
                                   bill.status === 'paid' ? 'مدفوعة' : 'متأخرة'}
                                </Badge>
                              </div>
                              <p className="text-gray-600">{bill.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>رقم الحساب: {bill.accountNumber}</span>
                                <span>تاريخ الاستحقاق: {bill.dueDate}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-left">
                              <p className="text-2xl font-bold text-gray-900">{bill.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">دج</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {bill.status === 'pending' && (
                                <Button
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setShowPaymentDialog(true);
                                  }}
                                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                                >
                                  <CreditCard className="w-4 h-4 ml-2" />
                                  دفع الفاتورة
                                </Button>
                              )}
                              
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openEditDialog(bill)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteBill(bill.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Bank Transfers Tab - عرض البيانات الحقيقية */}
          <TabsContent value="bank-transfers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">التحويلات البنكية</h2>
              <div className="text-sm text-gray-600">
                البيانات مستخرجة من معاملات الديون والائتمان
              </div>
            </div>

            <div className="grid gap-4">
              {bankTransfers.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد تحويلات بنكية</h3>
                    <p className="text-gray-500">لم يتم تسجيل أي تحويلات بنكية من العملاء حتى الآن</p>
                  </CardContent>
                </Card>
              ) : (
                bankTransfers.map((transfer) => (
                  <Card key={transfer.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-green-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{transfer.customerName}</h3>
                            <p className="text-gray-600">{transfer.bankName}</p>
                            <p className="text-sm text-gray-500">رقم المرجع: {transfer.referenceNumber}</p>
                            <p className="text-sm text-gray-500">تاريخ التحويل: {transfer.transferDate}</p>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                من معاملات الديون
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-bold text-green-600">{transfer.amount.toFixed(2)} دج</p>
                          <Badge className="bg-green-100 text-green-800">
                            {transfer.status === 'pending' ? 'معلق' : 'مؤكد'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(transfer.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      {transfer.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{transfer.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Cheques Tab - عرض البيانات الحقيقية */}
          <TabsContent value="cheques" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">الشيكات المستلمة</h2>
              <div className="text-sm text-gray-600">
                البيانات مستخرجة من معاملات الديون والائتمان
              </div>
            </div>

            <div className="grid gap-4">
              {cheques.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد شيكات</h3>
                    <p className="text-gray-500">لم يتم تسجيل أي شيكات من العملاء حتى الآن</p>
                  </CardContent>
                </Card>
              ) : (
                cheques.map((cheque) => (
                  <Card key={cheque.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-100 rounded-xl">
                            <FileCheck className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{cheque.customerName}</h3>
                            <p className="text-gray-600">{cheque.bankName}</p>
                            <p className="text-sm text-gray-500">رقم الشيك: {cheque.chequeNumber}</p>
                            <p className="text-sm text-gray-500">تاريخ الاستحقاق: {cheque.dueDate}</p>
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                من معاملات الديون
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-bold text-purple-600">{cheque.amount.toFixed(2)} دج</p>
                          <Badge className="bg-purple-100 text-purple-800">
                            {cheque.status === 'pending' ? 'معلق' : 'مصرف'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(cheque.createdAt).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                      {cheque.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{cheque.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Received Payments Tab - عرض البيانات الحقيقية */}
          <TabsContent value="received-payments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">المدفوعات المستلمة</h2>
              <div className="text-sm text-gray-600">
                البيانات مستخرجة من معاملات الديون والائتمان
              </div>
            </div>

            <div className="grid gap-4">
              {receivedPayments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <ArrowDownToLine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد مدفوعات مستلمة</h3>
                    <p className="text-gray-500">لم يتم تسجيل أي مدفوعات من العملاء حتى الآن</p>
                  </CardContent>
                </Card>
              ) : (
                receivedPayments.map((payment) => {
                  const getPaymentMethodIcon = (method: string) => {
                    switch (method) {
                      case 'cheque': return <FileCheck className="w-4 h-4" />;
                      case 'bank_transfer': return <Building2 className="w-4 h-4" />;
                      default: return <DollarSign className="w-4 h-4" />;
                    }
                  };

                  const getPaymentMethodText = (method: string) => {
                    switch (method) {
                      case 'cheque': return 'شيك';
                      case 'bank_transfer': return 'تحويل بنكي';
                      default: return 'نقدي';
                    }
                  };

                  const getPaymentMethodColor = (method: string) => {
                    switch (method) {
                      case 'cheque': return 'bg-purple-100 text-purple-800';
                      case 'bank_transfer': return 'bg-blue-100 text-blue-800';
                      default: return 'bg-green-100 text-green-800';
                    }
                  };

                  return (
                    <Card key={payment.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 rounded-xl">
                              <ArrowDownToLine className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{payment.customerName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <span className="text-gray-600">
                                  {getPaymentMethodText(payment.paymentMethod)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">تاريخ الدفع: {payment.paymentDate}</p>
                              <div className="mt-2 flex gap-2">
                                <Badge className={getPaymentMethodColor(payment.paymentMethod)}>
                                  {getPaymentMethodText(payment.paymentMethod)}
                                </Badge>
                                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                                  من معاملات الديون
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-2xl font-bold text-orange-600">{payment.amount.toFixed(2)} دج</p>
                            <Badge className="bg-orange-100 text-orange-800">مستلم</Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(payment.createdAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        {payment.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{payment.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                دفع الفاتورة
              </DialogTitle>
            </DialogHeader>
            
            {selectedBill && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold">{selectedBill.provider}</h4>
                  <p className="text-gray-600">{selectedBill.description}</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {selectedBill.amount.toFixed(2)} دج
                  </p>
                </div>

                <div>
                  <Label>طريقة الدفع</Label>
                  <Select value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData({...paymentData, paymentMethod: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4" />
                          نقداً
                        </div>
                      </SelectItem>
                      <SelectItem value="card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          بطاقة
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          تحويل بنكي
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>ملاحظات</Label>
                  <Textarea
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                    placeholder="ملاحظات إضافية"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handlePayBill} className="flex-1 bg-gradient-to-r from-green-500 to-green-600">
                    <CheckCircle className="w-4 h-4 ml-2" />
                    تأكيد الدفع
                  </Button>
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                    إلغاء
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                تعديل الفاتورة
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نوع الفاتورة</Label>
                <Select value={editBill.type} onValueChange={(value) => setEditBill({...editBill, type: value as Bill['type']})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electricity">كهرباء</SelectItem>
                    <SelectItem value="water">مياه</SelectItem>
                    <SelectItem value="internet">إنترنت</SelectItem>
                    <SelectItem value="phone">هاتف</SelectItem>
                    <SelectItem value="insurance">تأمين</SelectItem>
                    <SelectItem value="rent">إيجار</SelectItem>
                    <SelectItem value="fuel">وقود</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>مقدم الخدمة</Label>
                <Input
                  value={editBill.provider}
                  onChange={(e) => setEditBill({...editBill, provider: e.target.value})}
                  placeholder="اسم مقدم الخدمة"
                />
              </div>

              <div>
                <Label>رقم الحساب</Label>
                <Input
                  value={editBill.accountNumber}
                  onChange={(e) => setEditBill({...editBill, accountNumber: e.target.value})}
                  placeholder="رقم الحساب"
                />
              </div>

              <div>
                <Label>المبلغ</Label>
                <Input
                  type="number"
                  value={editBill.amount}
                  onChange={(e) => setEditBill({...editBill, amount: parseFloat(e.target.value) || 0})}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label>تاريخ الاستحقاق</Label>
                <Input
                  type="date"
                  value={editBill.dueDate}
                  onChange={(e) => setEditBill({...editBill, dueDate: e.target.value})}
                />
              </div>

              <div>
                <Label>الوصف</Label>
                <Textarea
                  value={editBill.description}
                  onChange={(e) => setEditBill({...editBill, description: e.target.value})}
                  placeholder="وصف الفاتورة"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleEditBill} className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
                  حفظ التغييرات
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                  إلغاء
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaxManagement;