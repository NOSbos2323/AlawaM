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
import { CreditCard, Plus, User, DollarSign, Calendar, AlertTriangle, Users, ShoppingBag, Trash2, Fuel, Coffee, Cigarette, Package, Gauge, Droplets } from 'lucide-react';

interface CreditManagementProps {
  language?: 'ar' | 'fr';
}

export const CreditManagement: React.FC<CreditManagementProps> = ({ language = 'ar' }) => {
  const { 
    customers = [], 
    creditTransactions = [],
    pumps = [],
    tanks = [],
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
  });

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');

  // إضافة حالات للتحكم في علب الحوار
  const [showAddCustomerDialog, setShowAddCustomerDialog] = useState(false);
  const [showAddTransactionDialog, setShowAddTransactionDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedCustomerForPayment, setSelectedCustomerForPayment] = useState<string>('');

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
    },
  };

  const t = texts[language];

  // أسعار الوقود الافتراضية
  const fuelPrices = {
    gasoline: 45.5,
    diesel: 32.0
  };

  // أسعار المنتجات الافتراضية
  const productPrices = {
    cigarettes: 450,
    drinks: 120,
    snacks: 80,
    other: 100
  };

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.creditLimit) {
      const customerId = Date.now().toString();
      addCustomer({
        id: customerId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        creditLimit: parseFloat(newCustomer.creditLimit),
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
    if (newTransaction.customerId && newTransaction.amount && newTransaction.description) {
      const amount = parseFloat(newTransaction.amount);
      const quantity = newTransaction.quantity ? parseFloat(newTransaction.quantity) : 0;
      const transactionId = Date.now().toString();

      // Build description based on type
      let description = newTransaction.description;
      if (newTransaction.fuelType) {
        description += ` - ${newTransaction.fuelType === 'gasoline' ? t.gasoline : t.diesel}`;
        if (newTransaction.quantity) {
          description += ` (${newTransaction.quantity} ${t.liter})`;
        }
        if (newTransaction.pumpId) {
          const pump = pumps.find(p => p.id === newTransaction.pumpId);
          description += ` - ${t.pump} ${pump?.name || newTransaction.pumpId}`;
        }
      } else if (newTransaction.productType) {
        const productName = {
          cigarettes: t.cigarettes,
          drinks: t.drinks,
          snacks: t.snacks,
          other: t.other
        }[newTransaction.productType] || newTransaction.productType;
        
        description += ` - ${productName}`;
        if (newTransaction.quantity) {
          const unit = newTransaction.productType === 'cigarettes' ? t.pack : t.piece;
          description += ` (${newTransaction.quantity} ${unit})`;
        }
      }

      // Add transaction
      addCreditTransaction({
        id: transactionId,
        customerId: newTransaction.customerId,
        type: newTransaction.type,
        amount: amount,
        description: description,
        date: new Date().toISOString().split('T')[0],
        fuelType: newTransaction.fuelType,
        productType: newTransaction.productType,
        quantity: quantity || undefined,
        pumpId: newTransaction.pumpId,
      });

      // Update customer debt
      const adjustedAmount = newTransaction.type === 'payment' ? -amount : amount;
      updateCustomerDebt(newTransaction.customerId, adjustedAmount);
      
      // Update pump reading and tank level if fuel transaction
      if (newTransaction.fuelType && newTransaction.pumpId && quantity > 0) {
        // Update pump reading (add to current reading)
        updatePumpReading(newTransaction.pumpId, quantity);
        
        // Update tank level (decrease from tank)
        const tank = tanks.find(t => t.fuelType === newTransaction.fuelType);
        if (tank) {
          updateTankLevel(tank.id, -quantity);
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
      });
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
        description: paymentDescription || 'دفعة نقدية',
        date: new Date().toISOString().split('T')[0],
      });

      // Update customer debt (reduce debt)
      updateCustomerDebt(customerId, -amount);

      setPaymentAmount('');
      setPaymentDescription('');
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

  const totalDebts = customers.reduce((sum, customer) => {
    const balance = calculateCustomerBalance(customer.id);
    return sum + (balance > 0 ? balance : 0);
  }, 0);

  const totalCredits = customers.reduce((sum, customer) => {
    return sum + (customer.creditLimit || 0);
  }, 0);

  const activeCustomers = customers.filter(customer => 
    calculateCustomerBalance(customer.id) !== 0
  ).length;

  // Calculate total amount when quantity changes
  const calculateTotalAmount = () => {
    if (newTransaction.fuelType && newTransaction.quantity) {
      const price = fuelPrices[newTransaction.fuelType as keyof typeof fuelPrices];
      const quantity = parseFloat(newTransaction.quantity);
      return (price * quantity).toFixed(2);
    } else if (newTransaction.productType && newTransaction.quantity) {
      const price = productPrices[newTransaction.productType as keyof typeof productPrices];
      const quantity = parseFloat(newTransaction.quantity);
      return (price * quantity).toFixed(2);
    }
    return '';
  };

  // Get available pumps for selected fuel type
  const getAvailablePumps = () => {
    if (!newTransaction.fuelType) return [];
    return pumps.filter(pump => pump.fuelType === newTransaction.fuelType);
  };

  // Get tank info for selected fuel type
  const getTankInfo = () => {
    if (!newTransaction.fuelType) return null;
    return tanks.find(tank => tank.fuelType === newTransaction.fuelType);
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
                <div>
                  <Label>{t.creditLimit}</Label>
                  <Input
                    type="number"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, creditLimit: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCustomer}>{t.save}</Button>
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
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t.type}</Label>
                    <Select value={newTransaction.type} onValueChange={(value: 'debt' | 'payment') => 
                      setNewTransaction(prev => ({ 
                        ...prev, 
                        type: value,
                        fuelType: '',
                        productType: '',
                        pumpId: '',
                        quantity: '',
                        amount: ''
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

                {/* Show fuel/product selection only for debt transactions */}
                {newTransaction.type === 'debt' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t.fuelType}</Label>
                        <Select value={newTransaction.fuelType} onValueChange={(value) => 
                          setNewTransaction(prev => ({ 
                            ...prev, 
                            fuelType: value, 
                            productType: '', 
                            pumpId: '',
                            quantity: '',
                            amount: ''
                          }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectFuelType} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gasoline">
                              <div className="flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-blue-500" />
                                {t.gasoline} - {fuelPrices.gasoline} دج/{t.liter}
                              </div>
                            </SelectItem>
                            <SelectItem value="diesel">
                              <div className="flex items-center gap-2">
                                <Fuel className="h-4 w-4 text-green-500" />
                                {t.diesel} - {fuelPrices.diesel} دج/{t.liter}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>{t.productType}</Label>
                        <Select value={newTransaction.productType} onValueChange={(value) => 
                          setNewTransaction(prev => ({ 
                            ...prev, 
                            productType: value, 
                            fuelType: '',
                            pumpId: '',
                            quantity: '',
                            amount: ''
                          }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectProductType} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cigarettes">
                              <div className="flex items-center gap-2">
                                <Cigarette className="h-4 w-4" />
                                {t.cigarettes} - {productPrices.cigarettes} دج/{t.pack}
                              </div>
                            </SelectItem>
                            <SelectItem value="drinks">
                              <div className="flex items-center gap-2">
                                <Coffee className="h-4 w-4" />
                                {t.drinks} - {productPrices.drinks} دج/{t.piece}
                              </div>
                            </SelectItem>
                            <SelectItem value="snacks">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                {t.snacks} - {productPrices.snacks} دج/{t.piece}
                              </div>
                            </SelectItem>
                            <SelectItem value="other">
                              <div className="flex items-center gap-2">
                                <ShoppingBag className="h-4 w-4" />
                                {t.other} - {productPrices.other} دج/{t.piece}
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Show pump selection and tank info for fuel transactions */}
                    {newTransaction.fuelType && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>{t.selectPump}</Label>
                            <Select value={newTransaction.pumpId} onValueChange={(value) => 
                              setNewTransaction(prev => ({ ...prev, pumpId: value }))
                            }>
                              <SelectTrigger>
                                <SelectValue placeholder={t.selectPump} />
                              </SelectTrigger>
                              <SelectContent>
                                {getAvailablePumps().map(pump => (
                                  <SelectItem key={pump.id} value={pump.id}>
                                    <div className="flex items-center gap-2">
                                      <Gauge className="h-4 w-4" />
                                      {pump.name} - {pump.currentReading.toFixed(2)} {t.liter}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Show tank info */}
                          <div>
                            <Label>معلومات الخزان</Label>
                            <div className="p-3 bg-slate-50 rounded-lg border">
                              {getTankInfo() ? (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>المستوى الحالي:</span>
                                    <span className="font-bold">{getTankInfo()?.currentLevel.toFixed(2)} {t.liter}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>السعة الكاملة:</span>
                                    <span>{getTankInfo()?.capacity.toFixed(2)} {t.liter}</span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">اختر نوع الوقود أولاً</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity and pricing section */}
                    {(newTransaction.fuelType || newTransaction.productType) && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label>{t.quantity}</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={newTransaction.quantity}
                              onChange={(e) => {
                                const quantity = e.target.value;
                                let calculatedAmount = '';
                                
                                if (newTransaction.fuelType && quantity) {
                                  const price = fuelPrices[newTransaction.fuelType as keyof typeof fuelPrices];
                                  calculatedAmount = (parseFloat(quantity) * price).toFixed(2);
                                } else if (newTransaction.productType && quantity) {
                                  const price = productPrices[newTransaction.productType as keyof typeof productPrices];
                                  calculatedAmount = (parseFloat(quantity) * price).toFixed(2);
                                }
                                
                                setNewTransaction(prev => ({ 
                                  ...prev, 
                                  quantity,
                                  amount: calculatedAmount
                                }));
                              }}
                              placeholder={newTransaction.fuelType ? "الكمية بالليتر" : "عدد القطع"}
                              className={!isQuantityValid() ? "border-red-500" : ""}
                            />
                            {!isQuantityValid() && (
                              <p className="text-xs text-red-500 mt-1">
                                الكمية تتجاوز المتوفر في الخزان
                              </p>
                            )}
                          </div>

                          <div>
                            <Label>السعر للوحدة</Label>
                            <Input
                              type="number"
                              value={
                                newTransaction.fuelType 
                                  ? fuelPrices[newTransaction.fuelType as keyof typeof fuelPrices]
                                  : newTransaction.productType
                                  ? productPrices[newTransaction.productType as keyof typeof productPrices]
                                  : ''
                              }
                              disabled
                              className="bg-gray-50"
                            />
                          </div>

                          <div>
                            <Label>{t.totalAmount}</Label>
                            <Input
                              type="number"
                              value={calculateTotalAmount()}
                              disabled
                              className="bg-blue-50 font-bold text-blue-900"
                            />
                          </div>
                        </div>

                        {/* Show calculated total in a prominent way */}
                        {(newTransaction.fuelType || newTransaction.productType) && newTransaction.quantity && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <span className="text-sm font-medium text-blue-800">ملخص المعاملة:</span>
                                <div className="text-xs text-blue-600">
                                  {newTransaction.quantity} × {
                                    newTransaction.fuelType 
                                      ? `${fuelPrices[newTransaction.fuelType as keyof typeof fuelPrices]} دج`
                                      : `${productPrices[newTransaction.productType as keyof typeof productPrices]} دج`
                                  }
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-blue-600">المبلغ الإجمالي</span>
                                <div className="text-2xl font-bold text-blue-900">
                                  {calculateTotalAmount()} دج
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label>{t.amount}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    disabled={(newTransaction.fuelType || newTransaction.productType) && newTransaction.quantity}
                    className={(newTransaction.fuelType || newTransaction.productType) && newTransaction.quantity ? "bg-gray-50" : ""}
                  />
                  {(newTransaction.fuelType || newTransaction.productType) && newTransaction.quantity && (
                    <p className="text-xs text-muted-foreground mt-1">
                      المبلغ محسوب تلقائياً من الكمية والسعر
                    </p>
                  )}
                </div>

                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف المعاملة"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddTransaction}
                    disabled={!isQuantityValid() || !newTransaction.customerId || !newTransaction.amount || !newTransaction.description}
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalDebt}</p>
                <p className="text-2xl font-bold text-red-600">{totalDebts.toFixed(2)} دج</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">العملاء النشطون</p>
                <p className="text-2xl font-bold text-blue-600">{activeCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
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

                return (
                  <Card key={customer.id} className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{customer.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={currentBalance > 0 ? "destructive" : "default"}>
                            {currentBalance > 0 ? `${currentBalance.toFixed(2)} دج` : t.noDept}
                          </Badge>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
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
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{t.phone}</span>
                          <span className="font-mono">{customer.phone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">إجمالي الديون</span>
                          <span className="font-bold text-red-600">
                            {totalDebt.toFixed(2)} دج
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">إجمالي المدفوعات</span>
                          <span className="font-bold text-green-600">
                            {totalPayments.toFixed(2)} دج
                          </span>
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

                      <div className="flex gap-2">
                        <Dialog open={showPaymentDialog && selectedCustomerForPayment === customer.id} onOpenChange={(open) => {
                          setShowPaymentDialog(open);
                          if (!open) {
                            setSelectedCustomerForPayment('');
                            setPaymentAmount('');
                            setPaymentDescription('');
                          }
                        }}>
                          <DialogTrigger asChild>
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
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{t.addPayment} - {customer.name}</DialogTitle>
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
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleAddPayment(customer.id)}
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
                                  }}
                                >
                                  {t.cancel}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
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
                
                return (
                  <Card key={transaction.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{customer?.name || 'عميل غير معروف'}</p>
                            {transaction.fuelType && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <Fuel className="h-3 w-3 mr-1" />
                                {transaction.fuelType === 'gasoline' ? t.gasoline : t.diesel}
                              </Badge>
                            )}
                            {transaction.productType && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <ShoppingBag className="h-3 w-3 mr-1" />
                                {transaction.productType}
                              </Badge>
                            )}
                            {pump && (
                              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
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
                                  {transaction.quantity} {transaction.fuelType ? t.liter : t.piece}
                                </span>
                              )}
                            </div>
                          </div>

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
                          <Badge variant={transaction.type === 'debt' ? 'destructive' : 'default'} className="mb-2">
                            {transaction.type === 'debt' ? t.debt : t.payment}
                          </Badge>
                          <p className={`font-bold text-xl ${
                            transaction.type === 'debt' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'debt' ? '+' : '-'}{transaction.amount.toFixed(2)} دج
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

export default CreditManagement;