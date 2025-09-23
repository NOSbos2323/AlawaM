import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useGasStationStore } from '@/store/gasStationStore';
import { CreditCard, Plus, User, DollarSign, Calendar, AlertTriangle, Users, ShoppingBag, Trash2, Fuel, Coffee, Cigarette, Package, Gauge, Droplets, Building2, FileCheck } from 'lucide-react';

interface CreditManagementProps {
  language?: 'ar' | 'fr';
}

export const CreditManagement: React.FC<CreditManagementProps> = ({ language = 'ar' }) => {
  const { 
    customers = [], 
    creditTransactions = [],
    pumps = [],
    tanks = [],
    fuelTypes = [],
    storeItems = [],
    addCustomer, 
    updateCustomer, 
    deleteCustomer,
    addCreditTransaction,
    updateCustomerDebt,
    updatePumpReading,
    updateTankLevel
  } = useGasStationStore();
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
  });

  const [newTransaction, setNewTransaction] = useState({
    customerId: '',
    type: 'debt' as 'debt' | 'payment',
    amount: '',
    description: '',
    fuelType: '',
    productType: '',
    quantity: '',
    pumpId: '',
    paymentMethod: 'cash' as 'cash' | 'cheque' | 'bank_transfer',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'cheque' | 'bank_transfer'>('cash');

  // إضافة حالات للتحكم في علب الحوار
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState<string>('');
  const [showCustomerDetailsDialog, setShowCustomerDetailsDialog] = useState(false);
  const [selectedCustomerForDetails, setSelectedCustomerForDetails] = useState<string>('');

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة الديون والائتمان',
      customers: 'العملاء',
      transactions: 'المعاملات',
      addCustomer: 'إضافة عميل',
      addTransaction: 'إضافة معاملة',
      customerName: 'اسم العميل',
      phone: 'الهاتف',
      address: 'العنوان',
      creditLimit: 'حد الائتمان',
      currentDebt: 'الدين الحالي',
      availableCredit: 'الائتمان المتاح',
      type: 'النوع',
      amount: 'المبلغ',
      description: 'الوصف',
      date: 'التاريخ',
      debt: 'دين',
      payment: 'دفعة',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      confirmDelete: 'تأكيد الحذف',
      deleteCustomerConfirm: 'هل أنت متأكد من حذف هذا العميل؟ سيتم حذف جميع معاملاته أيضاً.',
      highDebt: 'دين مرتفع',
      overLimit: 'تجاوز الحد',
      recentTransactions: 'المعاملات الأخيرة',
      totalDebt: 'إجمالي الديون',
      totalCredits: 'إجمالي الائتمان',
      selectCustomer: 'اختر العميل',
      addCredit: 'إضافة دين',
      recordPayment: 'تسجيل دفعة',
      customerDetails: 'تفاصيل العميل',
      noCustomers: 'لا يوجد عملاء',
      noTransactions: 'لا توجد معاملات',
      noDept: 'لا يوجد دين',
      addPayment: 'إضافة دفعة',
      fuelType: 'نوع الوقود',
      productType: 'نوع المنتج',
      quantity: 'الكمية',
      selectFuelType: 'اختر نوع الوقود',
      selectProductType: 'اختر نوع المنتج',
      selectPump: 'اختر المضخة',
      gasoline: 'بنزين',
      diesel: 'ديزل',
      cigarettes: 'سجائر',
      drinks: 'مشروبات',
      snacks: 'وجبات خفيفة',
      other: 'أخرى',
      liter: 'لتر',
      piece: 'قطعة',
      pack: 'علبة',
      pump: 'مضخة',
      pricePerLiter: 'السعر لكل لتر',
      totalAmount: 'المبلغ الإجمالي',
      pumpReading: 'قراءة المضخة',
      tankLevel: 'مستوى الخزان',
      paymentMethod: 'طريقة الدفع',
      cash: 'نقدي',
      cheque: 'شيك',
      bankTransfer: 'تحويل بنكي',
    },
    fr: {
      title: 'Gestion des crédits et dettes',
      customers: 'Clients',
      transactions: 'Transactions',
      addCustomer: 'Ajouter un client',
      addTransaction: 'Ajouter une transaction',
      customerName: 'Nom du client',
      phone: 'Téléphone',
      address: 'Adresse',
      creditLimit: 'Limite de crédit',
      currentDebt: 'Dette actuelle',
      availableCredit: 'Crédit disponible',
      type: 'Type',
      amount: 'Montant',
      description: 'Description',
      date: 'Date',
      debt: 'Dette',
      payment: 'Paiement',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      delete: 'Supprimer',
      confirmDelete: 'Confirmer la suppression',
      deleteCustomerConfirm: 'Êtes-vous sûr de vouloir supprimer ce client? Toutes ses transactions seront également supprimées.',
      highDebt: 'Dette élevée',
      overLimit: 'Dépassement de limite',
      recentTransactions: 'Transactions récentes',
      totalDebt: 'Dette totale',
      totalCredits: 'Crédits totaux',
      selectCustomer: 'Sélectionner un client',
      addCredit: 'Ajouter un crédit',
      recordPayment: 'Enregistrer un paiement',
      customerDetails: 'Détails du client',
      noCustomers: 'Aucun client',
      noTransactions: 'Aucune transaction',
      noDept: 'Aucune dette',
      addPayment: 'Ajouter un paiement',
      fuelType: 'Type de carburant',
      productType: 'Type de produit',
      quantity: 'Quantité',
      selectFuelType: 'Sélectionner le type de carburant',
      selectProductType: 'Sélectionner le type de produit',
      selectPump: 'Sélectionner la pompe',
      gasoline: 'Essence',
      diesel: 'Diesel',
      cigarettes: 'Cigarettes',
      drinks: 'Boissons',
      snacks: 'Collations',
      other: 'Autre',
      liter: 'Litre',
      piece: 'Pièce',
      pack: 'Paquet',
      pump: 'Pompe',
      pricePerLiter: 'Prix par litre',
      totalAmount: 'Montant total',
      pumpReading: 'Lecture de la pompe',
      tankLevel: 'Niveau du réservoir',
      paymentMethod: 'Mode de paiement',
      cash: 'Espèces',
      cheque: 'Chèque',
      bankTransfer: 'Virement bancaire',
    },
  };

  const t = texts[language];

  // Helpers to use real data
  const getSelectedFuelType = () => fuelTypes.find(ft => ft.id === newTransaction.fuelType) || null;
  const getSelectedPump = () => pumps.find(p => p.id === newTransaction.pumpId) || null;
  const getSelectedProduct = () => storeItems.find(i => i.id === newTransaction.productType) || null;
  const getItemUnitLabel = (unit: 'unit' | 'liter' | 'kg') => unit === 'liter' ? (language === 'ar' ? 'لتر' : 'L') : unit === 'kg' ? (language === 'ar' ? 'كغ' : 'kg') : (language === 'ar' ? 'علبة' : 'u');

  const getFuelUnitPrice = () => {
    const pump = getSelectedPump();
    if (pump) return pump.sellPrice || 0;
    const ft = getSelectedFuelType();
    return ft?.pricePerLiter || 0;
  };

  const handleAddCustomer = () => {
    if (newCustomer.name) {
      const customerId = Date.now().toString();
      addCustomer({
        id: customerId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        creditLimit: 0,
        currentDebt: 0,
        creditBalance: 0,
        debtBalance: 0,
      });
      setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
      setShowAddCustomerDialog(false);
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    deleteCustomer(customerId);
  };

  const handleAddTransaction = () => {
    // Ensure required fields
    if (!newTransaction.amount || !newTransaction.description) return;

    // Determine customer to use (create if it's a new customer)
    let customerIdToUse = newTransaction.customerId;
    if (customerIdToUse === 'new_customer') {
      if (!newCustomer.name) return; // must have a name for new customer
      const customerId = Date.now().toString();
      addCustomer({
        id: customerId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        creditLimit: 0,
        currentDebt: 0,
        creditBalance: 0,
        debtBalance: 0,
      });
      customerIdToUse = customerId;
    }

    if (customerIdToUse) {
      const amount = parseFloat(newTransaction.amount);
      const quantity = newTransaction.quantity ? parseFloat(newTransaction.quantity) : 0;
      const transactionId = Date.now().toString();

      // Build description based on type (use real names)
      let description = newTransaction.description;
      if (newTransaction.fuelType) {
        const ft = fuelTypes.find(f => f.id === newTransaction.fuelType);
        description += ` - ${ft?.name?.[language] || ft?.name?.ar || ''}`;
        if (newTransaction.quantity) {
          description += ` (${newTransaction.quantity} ${t.liter})`;
        }
        if (newTransaction.pumpId) {
          const pump = pumps.find(p => p.id === newTransaction.pumpId);
          description += ` - ${t.pump} ${pump?.name || newTransaction.pumpId}`;
        }
      } else if (newTransaction.productType) {
        const product = storeItems.find(i => i.id === newTransaction.productType);
        description += ` - ${product?.name || newTransaction.productType}`;
        if (newTransaction.quantity) {
          const unit = product ? getItemUnitLabel(product.unit) : '';
          description += ` (${newTransaction.quantity} ${unit})`;
        }
      }

      // Add transaction
      addCreditTransaction({
        id: transactionId,
        customerId: customerIdToUse,
        type: newTransaction.type,
        amount: amount,
        description: description,
        date: new Date().toISOString().split('T')[0],
        fuelType: newTransaction.fuelType,
        productType: newTransaction.productType,
        quantity: quantity || undefined,
        pumpId: newTransaction.pumpId,
        paymentMethod: newTransaction.type === 'payment' ? newTransaction.paymentMethod : undefined,
      });

      // Update customer debt
      const adjustedAmount = newTransaction.type === 'payment' ? -amount : amount;
      updateCustomerDebt(customerIdToUse, adjustedAmount);
      
      // Update pump/tank if fuel transaction
      if (newTransaction.type === 'debt' && newTransaction.fuelType && newTransaction.pumpId && quantity > 0) {
        const pump = pumps.find(p => p.id === newTransaction.pumpId);
        if (pump) {
          updatePumpReading(newTransaction.pumpId, (pump.currentReading || 0) + quantity);
        }
      }
      
      // Reset form and close dialog
      setNewTransaction({ 
        customerId: '', 
        type: 'debt', 
        amount: '', 
        description: '',
        fuelType: '',
        productType: '',
        quantity: '',
        pumpId: '',
        paymentMethod: 'cash',
      });
      setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
      setShowAddTransactionDialog(false);
    }
  };

  const handleAddPayment = (customerId: string) => {
    if (paymentAmount && parseFloat(paymentAmount) > 0) {
      const amount = parseFloat(paymentAmount);
      const transactionId = `PAY-${Date.now()}`;
      
      addCreditTransaction({
        id: transactionId,
        customerId,
        type: 'payment',
        amount,
        description: paymentDescription || (paymentMethod === 'cash' ? 'دفعة نقدية' : paymentMethod === 'cheque' ? 'دفعة بشيك' : 'تحويل بنكي'),
        date: new Date().toISOString().split('T')[0],
        paymentMethod,
      });

      // Update customer debt (reduce debt)
      updateCustomerDebt(customerId, -amount);

      setPaymentAmount('');
      setPaymentDescription('');
      setPaymentMethod('cash');
      setShowPaymentDialog(false);
      setSelectedCustomerForPayment('');
    }
  };

  // Calculate real totals from transactions
  const calculateCustomerBalance = (customerId: string) => {
    const customerTransactions = creditTransactions.filter(t => t.customerId === customerId);
    const totalDebt = customerTransactions
      .filter(t => t.type === 'debt')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalPayments = customerTransactions
      .filter(t => t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0);
    return totalDebt - totalPayments;
  };

  const totalDebts = creditTransactions
    .filter(t => t.type === 'debt')
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);

  const totalCredits = creditTransactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0)
    .toFixed(2);

  const activeCustomers = customers.filter(customer => 
    calculateCustomerBalance(customer.id) !== 0
  ).length;

  // Calculate total amount when quantity changes (using real prices from selected pump/product)
  const calculateTotalAmount = () => {
    if (newTransaction.fuelType && newTransaction.quantity && newTransaction.pumpId) {
      const pump = getSelectedPump();
      const price = pump?.sellPrice || 0;
      const quantity = parseFloat(newTransaction.quantity);
      return (price * quantity).toFixed(2);
    } else if (newTransaction.productType && newTransaction.quantity) {
      const product = getSelectedProduct();
      const price = product?.sellPrice || 0;
      const quantity = parseFloat(newTransaction.quantity);
      return (price * quantity).toFixed(2);
    }
    return '';
  };

  // Get available pumps for selected fuel type (real pumps)
  const getAvailablePumps = () => {
    if (!newTransaction.fuelType) return [];
    return pumps.filter(pump => pump.fuelType === newTransaction.fuelType && pump.isActive);
  };

  // Get tank info for selected fuel type (real tanks)
  const getTankInfo = () => {
    if (!newTransaction.fuelType) return null;
    return tanks.find(tank => tank.fuelType === newTransaction.fuelType) || null;
  };

  // Check if quantity is valid (not exceeding tank capacity)
  const isQuantityValid = () => {
    if (!newTransaction.fuelType || !newTransaction.quantity) return true;
    const tank = getTankInfo();
    const quantity = parseFloat(newTransaction.quantity);
    return tank ? quantity <= tank.currentLevel : true;
  };

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          {t.title}
        </h1>
        <div className="flex gap-2">
          <Dialog open={showAddCustomerDialog} onOpenChange={setShowAddCustomerDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addCustomer}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addCustomer}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.customerName}</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسم العميل"
                  />
                </div>
                <div>
                  <Label>{t.phone}</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                  />
                </div>
                <div>
                  <Label>{t.address}</Label>
                  <Textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="عنوان العميل"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (newCustomer.name) {
                      const customerId = Date.now().toString();
                      addCustomer({
                        id: customerId,
                        name: newCustomer.name,
                        phone: newCustomer.phone,
                        address: newCustomer.address,
                        creditLimit: 0,
                        currentDebt: 0,
                        creditBalance: 0,
                        debtBalance: 0,
                      });
                      setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
                      setShowAddCustomerDialog(false);
                    }
                  }} disabled={!newCustomer.name}>{t.save}</Button>
                  <Button variant="outline" onClick={() => setShowAddCustomerDialog(false)}>{t.cancel}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAddTransactionDialog} onOpenChange={setShowAddTransactionDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addTransaction}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t.addTransaction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t.selectCustomer}</Label>
                    <Select value={newTransaction.customerId} onValueChange={(value) => 
                      setNewTransaction(prev => ({ ...prev, customerId: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder={t.selectCustomer} />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center justify-between w-full gap-2">
                              <span>{customer.name}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{customer.phone}</span>
                                <Badge variant={calculateCustomerBalance(customer.id) > 0 ? "destructive" : "default"} className="text-xs">
                                  {calculateCustomerBalance(customer.id) > 0 
                                    ? `دين: ${calculateCustomerBalance(customer.id).toFixed(2)} دج`
                                    : "لا يوجد دين"
                                  }
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="new_customer" className="border-t border-gray-200 mt-2 pt-2">
                          <div className="flex items-center gap-2 text-blue-600 font-medium">
                            <Plus className="h-4 w-4" />
                            <span>عميل جديد</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t.type}</Label>
                    <Select value={newTransaction.type} onValueChange={(value: 'debt' | 'payment') => 
                      setNewTransaction(prev => ({ 
                        ...prev, 
                        type: value,
                        amount: '',
                        paymentMethod: value === 'payment' ? 'cash' : 'cash'
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debt">{t.debt}</SelectItem>
                        <SelectItem value="payment">{t.payment}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Show new customer form if "new_customer" is selected */}
                {newTransaction.customerId === 'new_customer' && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        إضافة عميل جديد
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>{t.customerName}</Label>
                          <Input
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="أدخل اسم العميل"
                          />
                        </div>
                        <div>
                          <Label>{t.phone}</Label>
                          <Input
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="05xxxxxxxx"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => {
                            if (newCustomer.name) {
                              const customerId = Date.now().toString();
                              addCustomer({
                                id: customerId,
                                name: newCustomer.name,
                                phone: newCustomer.phone,
                                address: newCustomer.address,
                                creditLimit: 0,
                                currentDebt: 0,
                                creditBalance: 0,
                                debtBalance: 0,
                              });
                              setNewTransaction(prev => ({ ...prev, customerId }));
                              setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
                            }
                          }}
                          disabled={!newCustomer.name}
                        >
                          حفظ العميل واستخدامه
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setNewTransaction(prev => ({ ...prev, customerId: '' }));
                            setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
                          }}
                        >
                          إلغاء
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label>{t.amount}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف المعاملة"
                  />
                </div>

                {newTransaction.type === 'payment' && (
                  <div>
                    <Label>{t.paymentMethod}</Label>
                    <Select
                      value={newTransaction.paymentMethod}
                      onValueChange={(value: 'cash' | 'cheque' | 'bank_transfer') =>
                        setNewTransaction(prev => ({ ...prev, paymentMethod: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{t.cash}</SelectItem>
                        <SelectItem value="cheque">{t.cheque}</SelectItem>
                        <SelectItem value="bank_transfer">{t.bankTransfer}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddTransaction}
                    disabled={
                      !newTransaction.amount ||
                      !newTransaction.description ||
                      !newTransaction.customerId ||
                      (newTransaction.customerId === 'new_customer' && !newCustomer.name)
                    }
                  >
                    {t.save}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setNewTransaction({ 
                      customerId: '', 
                      type: 'debt', 
                      amount: '', 
                      description: '',
                      fuelType: '',
                      productType: '',
                      quantity: '',
                      pumpId: '',
                      paymentMethod: 'cash',
                    });
                    setShowAddTransactionDialog(false);
                  }}>{t.cancel}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">إجمالي الديون</p>
                <p className="text-3xl font-bold">
                  {creditTransactions
                    .filter(t => t.type === 'debt')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
                <p className="text-red-100 text-xs">دج</p>
              </div>
              <DollarSign className="w-8 h-8 text-red-200" />
            </div>
            <div className="text-xs text-red-100 mt-2">
              {customers.filter(c => calculateCustomerBalance(c.id) > 0).length} عميل مدين
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">إجمالي المدفوعات</p>
                <p className="text-3xl font-bold">
                  {creditTransactions
                    .filter(t => t.type === 'payment')
                    .reduce((sum, t) => sum + t.amount, 0)
                    .toFixed(2)}
                </p>
                <p className="text-green-100 text-xs">دج</p>
              </div>
              <Users className="w-8 h-8 text-green-200" />
            </div>
            <div className="text-xs text-green-100 mt-2">
              من أصل {customers.length} عميل
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">إجمالي العملاء</p>
                <p className="text-3xl font-bold">{customers.length}</p>
                <p className="text-blue-100 text-xs">عميل</p>
              </div>
              <User className="w-8 h-8 text-blue-200" />
            </div>
            <div className="text-xs text-blue-100 mt-2">
              {creditTransactions.length} معاملة إجمالية
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">العملاء الجدد اليوم</p>
                <p className="text-3xl font-bold">
                  {(() => {
                    const today = new Date().toDateString();
                    return customers.filter(customer => {
                      const customerDate = new Date(parseInt(customer.id)).toDateString();
                      return customerDate === today;
                    }).length;
                  })()}
                </p>
                <p className="text-purple-100 text-xs">عميل</p>
              </div>
              <Plus className="w-8 h-8 text-purple-200" />
            </div>
            <div className="text-xs text-purple-100 mt-2">
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const todayTransactions = creditTransactions.filter(t => t.date === today);
                return `${todayTransactions.length} معاملة اليوم`;
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers">{t.customers}</TabsTrigger>
          <TabsTrigger value="transactions">{t.recentTransactions}</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {customers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">{t.noCustomers}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRTL ? 'لا يوجد عملاء حتى الآن' : 'Aucun client pour le moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((customer) => {
                const currentBalance = calculateCustomerBalance(customer.id);
                const customerTransactions = creditTransactions.filter(t => t.customerId === customer.id);
                const totalDebt = customerTransactions
                  .filter(t => t.type === 'debt')
                  .reduce((sum, t) => sum + t.amount, 0);
                const totalPayments = customerTransactions
                  .filter(t => t.type === 'payment')
                  .reduce((sum, t) => sum + t.amount, 0);

                // حساب إحصائيات طرق الدفع
                const paymentMethods = customerTransactions
                  .filter(t => t.type === 'payment')
                  .reduce((acc, t) => {
                    const method = t.paymentMethod || 'cash';
                    acc[method] = (acc[method] || 0) + t.amount;
                    return acc;
                  }, {} as Record<string, number>);

                const getPaymentMethodIcon = (method: string) => {
                  switch (method) {
                    case 'cheque': return <FileCheck className="h-3 w-3" />;
                    case 'bank_transfer': return <Building2 className="h-3 w-3" />;
                    default: return <DollarSign className="h-3 w-3" />;
                  }
                };

                const getPaymentMethodText = (method: string) => {
                  switch (method) {
                    case 'cheque': return 'شيك';
                    case 'bank_transfer': return 'تحويل بنكي';
                    default: return 'نقدي';
                  }
                };

                return (
                  <Card key={customer.id} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{customer.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={currentBalance > 0 ? "destructive" : "default"}>
                            {currentBalance > 0 ? `${currentBalance.toFixed(2)} دج` : t.noDept}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t.deleteCustomerConfirm}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCustomer(customer.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  {t.delete}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t.phone}</span>
                          <span className="font-mono">{customer.phone}</span>
                        </div>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-sm font-medium">الرصيد الحالي</span>
                          <span className={`font-bold text-lg ${
                            currentBalance > 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {currentBalance > 0 ? '+' : ''}{currentBalance.toFixed(2)} دج
                          </span>
                        </div>
                      </div>

                      {/* عرض طرق الدفع المستخدمة */}
                      {Object.keys(paymentMethods).length > 0 && (
                        <div className="border-t pt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">طرق الدفع المستخدمة:</p>
                          <div className="space-y-2">
                            {Object.entries(paymentMethods).map(([method, amount]) => (
                              <div key={method} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                  {getPaymentMethodIcon(method)}
                                  <span>{getPaymentMethodText(method)}</span>
                                </div>
                                <span className="font-medium text-green-600">
                                  {amount.toFixed(2)} دج
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* إحصائيات سريعة */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-red-50 p-2 rounded text-center">
                          <p className="text-red-600 font-medium">إجمالي الديون</p>
                          <p className="text-red-700 font-bold">{totalDebt.toFixed(2)} دج</p>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <p className="text-green-600 font-medium">إجمالي المدفوعات</p>
                          <p className="text-green-700 font-bold">{totalPayments.toFixed(2)} دج</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedCustomerForPayment(customer.id);
                            setShowPaymentDialog(true);
                          }}
                        >
                          {t.addPayment}
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedCustomerForDetails(customer.id);
                            setShowCustomerDetailsDialog(true);
                          }}
                        >
                          عرض السجل
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {creditTransactions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium text-muted-foreground">{t.noTransactions}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {isRTL ? 'لا توجد معاملات حتى الآن' : 'Aucune transaction pour le moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {creditTransactions.slice(-20).reverse().map((transaction) => {
                const customer = customers.find(c => c.id === transaction.customerId);
                const pump = transaction.pumpId ? pumps.find(p => p.id === transaction.pumpId) : null;
                const product = transaction.productType ? storeItems.find(i => i.id === transaction.productType) : null;
                
                // تحديد أيقونة طريقة الدفع
                const getPaymentMethodIcon = (method?: string) => {
                  switch (method) {
                    case 'cheque':
                      return <FileCheck className="h-3 w-3 mr-1" />;
                    case 'bank_transfer':
                      return <Building2 className="h-3 w-3 mr-1" />;
                    case 'cash':
                    default:
                      return <DollarSign className="h-3 w-3 mr-1" />;
                  }
                };

                const getPaymentMethodText = (method?: string) => {
                  switch (method) {
                    case 'cheque':
                      return 'شيك';
                    case 'bank_transfer':
                      return 'تحويل بنكي';
                    case 'cash':
                    default:
                      return 'نقدي';
                  }
                };

                const getPaymentMethodColor = (method?: string) => {
                  switch (method) {
                    case 'cheque':
                      return 'bg-purple-50 text-purple-700 border-purple-200';
                    case 'bank_transfer':
                      return 'bg-blue-50 text-blue-700 border-blue-200';
                    case 'cash':
                    default:
                      return 'bg-green-50 text-green-700 border-green-200';
                  }
                };
                
                return (
                  <Card key={transaction.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{customer?.name || 'عميل غير معروف'}</p>
                            
                            {/* نوع المعاملة */}
                            <Badge variant={transaction.type === 'debt' ? 'destructive' : 'default'}>
                              {transaction.type === 'debt' ? t.debt : t.payment}
                            </Badge>

                            {/* طريقة الدفع للمدفوعات */}
                            {transaction.type === 'payment' && transaction.paymentMethod && (
                              <Badge variant="outline" className={`text-xs ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                {getPaymentMethodText(transaction.paymentMethod)}
                              </Badge>
                            )}

                            {/* نوع الوقود */}
                            {transaction.fuelType && (
                              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                <Fuel className="h-3 w-3 mr-1" />
                                {fuelTypes.find(f => f.id === transaction.fuelType)?.name?.[language] || '—'}
                              </Badge>
                            )}

                            {/* نوع المنتج */}
                            {transaction.productType && (
                              <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                {product?.name || '—'}
                              </Badge>
                            )}

                            {/* المضخة */}
                            {pump && (
                              <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                <Gauge className="h-3 w-3 mr-1" />
                                {pump.name}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(transaction.date).toLocaleDateString('ar-SA')}
                              </span>
                              {transaction.quantity && (
                                <span className="flex items-center gap-1">
                                  <Droplets className="h-3 w-3" />
                                  {transaction.quantity} {transaction.fuelType ? t.liter : (product ? getItemUnitLabel(product.unit) : '')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* معلومات إضافية للمدفوعات غير النقدية */}
                          {transaction.type === 'payment' && transaction.paymentMethod !== 'cash' && (
                            <div className={`p-3 rounded-lg border-r-4 ${
                              transaction.paymentMethod === 'cheque' 
                                ? 'bg-purple-50 border-r-purple-400' 
                                : 'bg-blue-50 border-r-blue-400'
                            }`}>
                              <div className="flex items-center gap-2 text-sm">
                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                <span className="font-medium">
                                  {transaction.paymentMethod === 'cheque' 
                                    ? 'دفعة بشيك - يتطلب تأكيد الصرف' 
                                    : 'تحويل بنكي - يتطلب تأكيد الاستلام'
                                  }
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {transaction.paymentMethod === 'cheque' 
                                  ? 'سيتم إضافة هذا المبلغ للسيولة عند صرف الشيك'
                                  : 'سيتم إضافة هذا المبلغ للسيولة عند تأكيد التحويل'
                                }
                              </p>
                            </div>
                          )}

                          <div className="bg-slate-50 p-3 rounded border-l-4 border-l-slate-300">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600">نتيجة المعاملة:</span>
                              <span className={`font-bold ${
                                transaction.type === 'debt' ? 'text-red-600' : 'text-green-600'
                              }`}>
                                {transaction.type === 'debt' 
                                  ? `زيادة الدين بمقدار ${transaction.amount.toFixed(2)} دج`
                                  : `تقليل الدين بمقدار ${transaction.amount.toFixed(2)} دج`
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <p className={`font-bold text-xl ${
                            transaction.type === 'debt' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'debt' ? '+' : '-'}{transaction.amount.toFixed(2)} دج
                          </p>
                          {transaction.type === 'payment' && transaction.paymentMethod !== 'cash' && (
                            <p className="text-xs text-amber-600 font-medium mt-1">
                              {transaction.paymentMethod === 'cheque' ? 'في انتظار الصرف' : 'في انتظار التأكيد'}
                            </p>
                          )}
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

      {/* Today's Transactions Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Debts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              سجل الديون اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todayDebts = creditTransactions.filter(t => 
                t.type === 'debt' && t.date === today
              );
              const totalTodayDebts = todayDebts.reduce((sum, t) => sum + t.amount, 0);

              return (
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="text-center">
                      <p className="text-sm text-red-600 font-medium">إجمالي ديون اليوم</p>
                      <p className="text-3xl font-bold text-red-700">{totalTodayDebts.toFixed(2)} دج</p>
                      <p className="text-xs text-red-500 mt-1">({todayDebts.length} معاملة)</p>
                    </div>
                  </div>
                  
                  {todayDebts.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">لا توجد ديون اليوم</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {todayDebts.slice().reverse().map((transaction) => {
                        const customer = customers.find(c => c.id === transaction.customerId);
                        return (
                          <div key={transaction.id} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm">{customer?.name || 'عميل غير معروف'}</p>
                                  <Badge variant="destructive" className="text-xs">دين</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{transaction.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(transaction.date).toLocaleDateString('ar-SA')}
                                  </span>
                                  {transaction.quantity && (
                                    <span className="flex items-center gap-1">
                                      <Droplets className="h-3 w-3" />
                                      {transaction.quantity} لتر
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <p className="font-bold text-lg text-red-600">+{transaction.amount.toFixed(2)} دج</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Today's Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <DollarSign className="h-5 w-5" />
              سجل المدفوعات اليوم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const todayPayments = creditTransactions.filter(t => 
                t.type === 'payment' && t.date === today
              );
              const totalTodayPayments = todayPayments.reduce((sum, t) => sum + t.amount, 0);

              return (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-center">
                      <p className="text-sm text-green-600 font-medium">إجمالي مدفوعات اليوم</p>
                      <p className="text-3xl font-bold text-green-700">{totalTodayPayments.toFixed(2)} دج</p>
                      <p className="text-xs text-green-500 mt-1">({todayPayments.length} معاملة)</p>
                    </div>
                  </div>
                  
                  {todayPayments.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">لا توجد مدفوعات اليوم</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {todayPayments.slice().reverse().map((transaction) => {
                        const customer = customers.find(c => c.id === transaction.customerId);
                        return (
                          <div key={transaction.id} className="bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-sm">{customer?.name || 'عميل غير معروف'}</p>
                                  <Badge variant="default" className="text-xs bg-green-100 text-green-700 border-green-300">دفعة</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{transaction.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(transaction.date).toLocaleDateString('ar-SA')}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right ml-3">
                                <p className="font-bold text-lg text-green-600">-{transaction.amount.toFixed(2)} دج</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetailsDialog} onOpenChange={setShowCustomerDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تفاصيل العميل - {customers.find(c => c.id === selectedCustomerForDetails)?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomerForDetails && (() => {
            const customer = customers.find(c => c.id === selectedCustomerForDetails);
            const customerTransactions = creditTransactions.filter(t => t.customerId === selectedCustomerForDetails);
            const currentBalance = calculateCustomerBalance(selectedCustomerForDetails);
            const totalDebt = customerTransactions.filter(t => t.type === 'debt').reduce((sum, t) => sum + t.amount, 0);
            const totalPayments = customerTransactions.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
            
            return (
              <div className="space-y-6">
                {/* Customer Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-red-600 font-medium">إجمالي الديون</p>
                        <p className="text-2xl font-bold text-red-700">{totalDebt.toFixed(2)} دج</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-green-600 font-medium">إجمالي المدفوعات</p>
                        <p className="text-2xl font-bold text-green-700">{totalPayments.toFixed(2)} دج</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className={`${currentBalance > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className={`text-sm font-medium ${currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          الرصيد الحالي
                        </p>
                        <p className={`text-2xl font-bold ${currentBalance > 0 ? 'text-red-700' : 'text-green-700'}`}>
                          {currentBalance > 0 ? '+' : ''}{currentBalance.toFixed(2)} دج
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">معلومات العميل</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">الاسم</Label>
                      <p className="font-medium">{customer?.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">الهاتف</Label>
                      <p className="font-mono">{customer?.phone || '—'}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">العنوان</Label>
                      <p>{customer?.address || '—'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      سجل المعاملات ({customerTransactions.length} معاملة)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {customerTransactions.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">لا توجد معاملات لهذا العميل</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {customerTransactions.reverse().map((transaction) => {
                          const pump = transaction.pumpId ? pumps.find(p => p.id === transaction.pumpId) : null;
                          const product = transaction.productType ? storeItems.find(i => i.id === transaction.productType) : null;
                          
                          // تحديد أيقونة ونص طريقة الدفع
                          const getPaymentMethodIcon = (method?: string) => {
                            switch (method) {
                              case 'cheque':
                                return <FileCheck className="h-3 w-3 mr-1" />;
                              case 'bank_transfer':
                                return <Building2 className="h-3 w-3 mr-1" />;
                              case 'cash':
                              default:
                                return <DollarSign className="h-3 w-3 mr-1" />;
                            }
                          };

                          const getPaymentMethodText = (method?: string) => {
                            switch (method) {
                              case 'cheque':
                                return 'شيك';
                              case 'bank_transfer':
                                return 'تحويل بنكي';
                              case 'cash':
                              default:
                                return 'نقدي';
                            }
                          };

                          const getPaymentMethodColor = (method?: string) => {
                            switch (method) {
                              case 'cheque':
                                return 'bg-purple-50 text-purple-700 border-purple-200';
                              case 'bank_transfer':
                                return 'bg-blue-50 text-blue-700 border-blue-200';
                              case 'cash':
                              default:
                                return 'bg-green-50 text-green-700 border-green-200';
                            }
                          };
                          
                          return (
                            <div key={transaction.id} className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant={transaction.type === 'debt' ? 'destructive' : 'default'}>
                                      {transaction.type === 'debt' ? t.debt : t.payment}
                                    </Badge>

                                    {/* عرض طريقة الدفع للمدفوعات */}
                                    {transaction.type === 'payment' && transaction.paymentMethod && (
                                      <Badge variant="outline" className={`text-xs ${getPaymentMethodColor(transaction.paymentMethod)}`}>
                                        {getPaymentMethodIcon(transaction.paymentMethod)}
                                        {getPaymentMethodText(transaction.paymentMethod)}
                                      </Badge>
                                    )}

                                    {transaction.fuelType && (
                                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                        <Fuel className="h-3 w-3 mr-1" />
                                        {fuelTypes.find(f => f.id === transaction.fuelType)?.name?.[language] || '—'}
                                      </Badge>
                                    )}
                                    {transaction.productType && (
                                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                                        <ShoppingBag className="h-3 w-3 mr-1" />
                                        {product?.name || '—'}
                                      </Badge>
                                    )}
                                    {pump && (
                                      <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
                                        <Gauge className="h-3 w-3 mr-1" />
                                        {pump.name}
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <p className="text-sm text-muted-foreground">{transaction.description}</p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(transaction.date).toLocaleDateString('ar-SA')}
                                    </span>
                                    {transaction.quantity && (
                                      <span className="flex items-center gap-1">
                                        <Droplets className="h-3 w-3" />
                                        {transaction.quantity} {transaction.fuelType ? t.liter : (product ? getItemUnitLabel(product.unit) : '')}
                                      </span>
                                    )}
                                  </div>

                                  {/* معلومات إضافية للمدفوعات غير النقدية */}
                                  {transaction.type === 'payment' && transaction.paymentMethod !== 'cash' && (
                                    <div className={`p-3 rounded-lg border-r-4 ${
                                      transaction.paymentMethod === 'cheque' 
                                        ? 'bg-purple-50 border-r-purple-400' 
                                        : 'bg-blue-50 border-r-blue-400'
                                    }`}>
                                      <div className="flex items-center gap-2 text-sm">
                                        {getPaymentMethodIcon(transaction.paymentMethod)}
                                        <span className="font-medium">
                                          {transaction.paymentMethod === 'cheque' 
                                            ? 'دفعة بشيك - يتطلب تأكيد الصرف' 
                                            : 'تحويل بنكي - يتطلب تأكيد الاستلام'
                                          }
                                        </span>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {transaction.paymentMethod === 'cheque' 
                                          ? 'سيتم إضافة هذا المبلغ للسيولة عند صرف الشيك'
                                          : 'سيتم إضافة هذا المبلغ للسيولة عند تأكيد التحويل'
                                        }
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="text-right ml-4">
                                  <p className={`font-bold text-xl ${
                                    transaction.type === 'debt' ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {transaction.type === 'debt' ? '+' : '-'}{transaction.amount.toFixed(2)} دج
                                  </p>
                                  {transaction.type === 'payment' && transaction.paymentMethod !== 'cash' && (
                                    <p className="text-xs text-amber-600 font-medium mt-1">
                                      {transaction.paymentMethod === 'cheque' ? 'في انتظار الصرف' : 'في انتظار التأكيد'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setShowCustomerDetailsDialog(false)}>
                    إغلاق
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentDialog && selectedCustomerForPayment !== ''} onOpenChange={(open) => {
        if (!open) {
          setShowPaymentDialog(false);
          setSelectedCustomerForPayment('');
          setPaymentAmount('');
          setPaymentDescription('');
          setPaymentMethod('cash');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addPayment} - {customers.find(c => c.id === selectedCustomerForPayment)?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.amount}</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>{t.description}</Label>
              <Input
                value={paymentDescription}
                onChange={(e) => setPaymentDescription(e.target.value)}
                placeholder="وصف الدفعة..."
              />
            </div>
            <div>
              <Label>{t.paymentMethod}</Label>
              <Select value={paymentMethod} onValueChange={(v: 'cash' | 'cheque' | 'bank_transfer') => setPaymentMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">{t.cash}</SelectItem>
                  <SelectItem value="cheque">{t.cheque}</SelectItem>
                  <SelectItem value="bank_transfer">{t.bankTransfer}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleAddPayment(selectedCustomerForPayment)}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
                className="flex-1"
              >
                {t.save}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPaymentDialog(false);
                  setSelectedCustomerForPayment('');
                  setPaymentAmount('');
                  setPaymentDescription('');
                  setPaymentMethod('cash');
                }}
              >
                {t.cancel}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditManagement;