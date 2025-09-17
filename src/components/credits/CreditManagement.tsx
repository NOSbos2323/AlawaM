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
import { CreditCard, Plus, User, DollarSign, Calendar, AlertTriangle } from 'lucide-react';

interface CreditManagementProps {
  language?: 'ar' | 'fr';
}

const CreditManagement: React.FC<CreditManagementProps> = ({ language = 'ar' }) => {
  const {
    customers,
    creditTransactions,
    addCustomer,
    addCreditTransaction,
    updateCustomerDebt,
  } = useGasStationStore();

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    creditLimit: '',
  });

  const [newTransaction, setNewTransaction] = useState({
    customerId: '',
    type: 'credit' as 'credit' | 'payment',
    amount: '',
    description: '',
  });

  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

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
      credit: 'دين',
      payment: 'دفعة',
      save: 'حفظ',
      cancel: 'إلغاء',
      highDebt: 'دين مرتفع',
      overLimit: 'تجاوز الحد',
      recentTransactions: 'المعاملات الأخيرة',
      totalDebt: 'إجمالي الديون',
      totalCredits: 'إجمالي الائتمان',
      selectCustomer: 'اختر العميل',
      addCredit: 'إضافة دين',
      recordPayment: 'تسجيل دفعة',
      customerDetails: 'تفاصيل العميل',
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
      credit: 'Crédit',
      payment: 'Paiement',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      highDebt: 'Dette élevée',
      overLimit: 'Dépassement de limite',
      recentTransactions: 'Transactions récentes',
      totalDebt: 'Dette totale',
      totalCredits: 'Crédits totaux',
      selectCustomer: 'Sélectionner un client',
      addCredit: 'Ajouter un crédit',
      recordPayment: 'Enregistrer un paiement',
      customerDetails: 'Détails du client',
    },
  };

  const t = texts[language];

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.creditLimit) {
      addCustomer({
        name: newCustomer.name,
        phone: newCustomer.phone,
        address: newCustomer.address,
        creditLimit: parseFloat(newCustomer.creditLimit),
        currentDebt: 0,
      });
      setNewCustomer({ name: '', phone: '', address: '', creditLimit: '' });
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.customerId && newTransaction.amount && newTransaction.description) {
      const amount = parseFloat(newTransaction.amount);
      const adjustedAmount = newTransaction.type === 'payment' ? -amount : amount;

      addCreditTransaction({
        customerId: newTransaction.customerId,
        type: newTransaction.type,
        amount: amount,
        description: newTransaction.description,
        date: new Date().toISOString().split('T')[0],
      });

      updateCustomerDebt(newTransaction.customerId, adjustedAmount);
      setNewTransaction({ customerId: '', type: 'credit', amount: '', description: '' });
    }
  };

  const getCustomerStatus = (customer: any) => {
    const debtRatio = customer.currentDebt / customer.creditLimit;
    if (customer.currentDebt > customer.creditLimit) {
      return { status: 'over', color: 'destructive', text: t.overLimit };
    }
    if (debtRatio > 0.8) {
      return { status: 'high', color: 'warning', text: t.highDebt };
    }
    return { status: 'ok', color: 'default', text: '' };
  };

  const getCustomerTransactions = (customerId: string) => {
    return creditTransactions.filter(t => t.customerId === customerId).slice(-5);
  };

  const totalDebts = customers.reduce((sum, customer) => sum + customer.currentDebt, 0);
  const totalCreditLimits = customers.reduce((sum, customer) => sum + customer.creditLimit, 0);

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CreditCard className="h-8 w-8" />
          {t.title}
        </h1>
        <div className="flex gap-2">
          <Dialog>
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
                  />
                </div>
                <div>
                  <Label>{t.phone}</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.address}</Label>
                  <Textarea
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.creditLimit}</Label>
                  <Input
                    type="number"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, creditLimit: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCustomer}>{t.save}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addTransaction}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addTransaction}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.selectCustomer}</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newTransaction.customerId}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, customerId: e.target.value }))}
                  >
                    <option value="">{t.selectCustomer}</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{t.type}</Label>
                  <select
                    className="w-full p-2 border rounded"
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as 'credit' | 'payment' }))}
                  >
                    <option value="credit">{t.credit}</option>
                    <option value="payment">{t.payment}</option>
                  </select>
                </div>
                <div>
                  <Label>{t.amount}</Label>
                  <Input
                    type="number"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.description}</Label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTransaction}>{t.save}</Button>
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
                <p className="text-sm font-medium text-muted-foreground">{t.totalDebt}</p>
                <p className="text-2xl font-bold text-red-600">{totalDebts.toFixed(2)} SAR</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.totalCredits}</p>
                <p className="text-2xl font-bold text-blue-600">{totalCreditLimits.toFixed(2)} SAR</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.customers}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => {
              const status = getCustomerStatus(customer);
              const availableCredit = customer.creditLimit - customer.currentDebt;
              const recentTransactions = getCustomerTransactions(customer.id);

              return (
                <Card key={customer.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {customer.name}
                      </span>
                      {status.status !== 'ok' && (
                        <Badge variant={status.color as any} className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {status.text}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {customer.phone && (
                        <p className="text-sm text-muted-foreground">{customer.phone}</p>
                      )}
                      {customer.address && (
                        <p className="text-sm text-muted-foreground">{customer.address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{t.currentDebt}</span>
                        <span className={`font-bold ${customer.currentDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {customer.currentDebt.toFixed(2)} SAR
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t.creditLimit}</span>
                        <span className="font-mono">{customer.creditLimit.toFixed(2)} SAR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">{t.availableCredit}</span>
                        <span className={`font-bold ${availableCredit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {availableCredit.toFixed(2)} SAR
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          customer.currentDebt > customer.creditLimit
                            ? 'bg-red-600'
                            : customer.currentDebt / customer.creditLimit > 0.8
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }`}
                        style={{
                          width: `${Math.min((customer.currentDebt / customer.creditLimit) * 100, 100)}%`,
                        }}
                      />
                    </div>

                    {recentTransactions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{t.recentTransactions}</p>
                        {recentTransactions.map((transaction) => (
                          <div key={transaction.id} className="text-xs flex justify-between">
                            <span>{transaction.description}</span>
                            <span className={transaction.type === 'credit' ? 'text-red-600' : 'text-green-600'}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)}
                            </span>
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

        <TabsContent value="transactions" className="space-y-4">
          <div className="space-y-4">
            {creditTransactions.slice(-20).reverse().map((transaction) => {
              const customer = customers.find(c => c.id === transaction.customerId);
              return (
                <Card key={transaction.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{customer?.name}</p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={transaction.type === 'credit' ? 'destructive' : 'default'}>
                          {transaction.type === 'credit' ? t.credit : t.payment}
                        </Badge>
                        <p className={`font-bold text-lg ${
                          transaction.type === 'credit' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{transaction.amount.toFixed(2)} SAR
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

export default CreditManagement;