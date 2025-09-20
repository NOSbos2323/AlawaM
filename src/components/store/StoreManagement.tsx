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
import { ShoppingBag, Plus, Package, AlertTriangle, Receipt, Trash2 } from 'lucide-react';

interface StoreManagementProps {
  language?: 'ar' | 'fr';
}

const StoreManagement: React.FC<StoreManagementProps> = ({ language = 'ar' }) => {
  const {
    storeItems,
    storeSales,
    customers,
    addStoreItem,
    addStoreSale,
    updateStoreItem,
  } = useGasStationStore();

  const [newItem, setNewItem] = useState({
    nameAr: '',
    nameFr: '',
    price: '',
    stock: '',
    category: '',
  });

  const [saleItems, setSaleItems] = useState<Array<{ itemId: string; quantity: number }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة المتجر',
      inventory: 'المخزون',
      sales: 'المبيعات',
      newSale: 'بيع جديد',
      addItem: 'إضافة منتج',
      itemName: 'اسم المنتج',
      price: 'السعر',
      stock: 'المخزون',
      category: 'الفئة',
      lowStock: 'مخزون منخفض',
      outOfStock: 'نفد المخزون',
      automotive: 'سيارات',
      beverages: 'مشروبات',
      gas: 'غاز',
      snacks: 'وجبات خفيفة',
      quantity: 'الكمية',
      total: 'المجموع',
      customer: 'العميل',
      paymentMethod: 'طريقة الدفع',
      cash: 'نقدي',
      credit: 'آجل',
      completeSale: 'إتمام البيع',
      addToSale: 'إضافة للبيع',
      recentSales: 'المبيعات الأخيرة',
      date: 'التاريخ',
      items: 'المنتجات',
      save: 'حفظ',
      cancel: 'إلغاء',
    },
    fr: {
      title: 'Gestion du magasin',
      inventory: 'Inventaire',
      sales: 'Ventes',
      newSale: 'Nouvelle vente',
      addItem: 'Ajouter un article',
      itemName: 'Nom de l\'article',
      price: 'Prix',
      stock: 'Stock',
      category: 'Catégorie',
      lowStock: 'Stock faible',
      outOfStock: 'Rupture de stock',
      automotive: 'Automobile',
      beverages: 'Boissons',
      gas: 'Gaz',
      snacks: 'Collations',
      quantity: 'Quantité',
      total: 'Total',
      customer: 'Client',
      paymentMethod: 'Mode de paiement',
      cash: 'Espèces',
      credit: 'Crédit',
      completeSale: 'Finaliser la vente',
      addToSale: 'Ajouter à la vente',
      recentSales: 'Ventes récentes',
      date: 'Date',
      items: 'Articles',
      save: 'Sauvegarder',
      cancel: 'Annuler',
    },
  };

  const t = texts[language];

  const categories = [
    { value: 'automotive', label: t.automotive },
    { value: 'beverages', label: t.beverages },
    { value: 'gas', label: t.gas },
    { value: 'snacks', label: t.snacks },
  ];

  const handleAddItem = () => {
    if (newItem.nameAr && newItem.nameFr && newItem.price && newItem.stock && newItem.category) {
      addStoreItem({
        name: { ar: newItem.nameAr, fr: newItem.nameFr },
        price: parseFloat(newItem.price),
        stock: parseInt(newItem.stock),
        category: newItem.category,
      });
      setNewItem({ nameAr: '', nameFr: '', price: '', stock: '', category: '' });
      setShowAddItemDialog(false);
    }
  };

  const addItemToSale = (itemId: string, quantity: number) => {
    setSaleItems(prev => {
      const existing = prev.find(item => item.itemId === itemId);
      if (existing) {
        return prev.map(item =>
          item.itemId === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { itemId, quantity }];
    });
  };

  const calculateSaleTotal = () => {
    return saleItems.reduce((total, saleItem) => {
      const item = storeItems.find(i => i.id === saleItem.itemId);
      return total + (item ? item.price * saleItem.quantity : 0);
    }, 0);
  };

  const completeSale = () => {
    if (saleItems.length > 0) {
      const total = calculateSaleTotal();
      const transactionId = `TXN-${Date.now()}`;
      
      addStoreSale({
        items: saleItems.map(saleItem => {
          const item = storeItems.find(i => i.id === saleItem.itemId);
          return {
            itemId: saleItem.itemId,
            quantity: saleItem.quantity,
            price: item?.price || 0,
          };
        }),
        total,
        date: new Date().toISOString().split('T')[0],
        paymentMethod,
        customerId: selectedCustomer || undefined,
        transactionId,
      });

      // Update stock
      saleItems.forEach(saleItem => {
        const item = storeItems.find(i => i.id === saleItem.itemId);
        if (item) {
          updateStoreItem(saleItem.itemId, { stock: item.stock - saleItem.quantity });
        }
      });

      // If credit sale, add to customer debt and credit transactions
      if (paymentMethod === 'credit' && selectedCustomer) {
        const { addCreditTransaction, updateCustomerDebt } = useGasStationStore.getState();
        
        // Add credit transaction
        addCreditTransaction({
          customerId: selectedCustomer,
          type: 'debt',
          amount: total,
          description: `بيع متجر #${transactionId} - ${saleItems.length} منتج`,
          date: new Date().toISOString().split('T')[0],
          transactionId,
        });

        // Update customer debt
        updateCustomerDebt(selectedCustomer, total);
      }

      setSaleItems([]);
      setSelectedCustomer('');
      setPaymentMethod('cash');
    }
  };

  const removeItemFromSale = (itemId: string) => {
    setSaleItems(prev => prev.filter(item => item.itemId !== itemId));
  };

  const deleteStoreItem = (itemId: string) => {
    const { deleteStoreItem } = useGasStationStore.getState();
    deleteStoreItem(itemId);
  };

  const getStockStatus = (item: any) => {
    if (item.stock === 0) return { status: 'out', color: 'destructive', text: t.outOfStock };
    if (item.stock < 10) return { status: 'low', color: 'warning', text: t.lowStock };
    return { status: 'ok', color: 'default', text: '' };
  };

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-8 w-8" />
          {t.title}
        </h1>
        <div className="flex gap-2">
          <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t.addItem}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.addItem}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{t.itemName} (العربية)</Label>
                  <Input
                    value={newItem.nameAr}
                    onChange={(e) => setNewItem(prev => ({ ...prev, nameAr: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.itemName} (Français)</Label>
                  <Input
                    value={newItem.nameFr}
                    onChange={(e) => setNewItem(prev => ({ ...prev, nameFr: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.price}</Label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.stock}</Label>
                  <Input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.category}</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddItem}>{t.save}</Button>
                  <Button variant="outline" onClick={() => setShowAddItemDialog(false)}>{t.cancel}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">{t.inventory}</TabsTrigger>
          <TabsTrigger value="sales">{t.newSale}</TabsTrigger>
          <TabsTrigger value="history">{t.recentSales}</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {storeItems.map((item) => {
              const stockStatus = getStockStatus(item);
              return (
                <Card key={item.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{item.name[language]}</span>
                      <div className="flex items-center gap-2">
                        {stockStatus.status !== 'ok' && (
                          <Badge variant={stockStatus.color as any} className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {stockStatus.text}
                          </Badge>
                        )}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteStoreItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t.price}</span>
                      <span className="font-bold text-lg">{item.price.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t.stock}</span>
                      <span className={`font-mono ${item.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.stock}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t.category}</span>
                      <Badge variant="outline">
                        {categories.find(c => c.value === item.category)?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {t.inventory}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {storeItems.filter(item => item.stock > 0).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{item.name[language]}</p>
                        <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} دج</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">({item.stock})</span>
                        <Button
                          size="sm"
                          onClick={() => addItemToSale(item.id, 1)}
                          disabled={item.stock === 0}
                        >
                          {t.addToSale}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  {t.newSale}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {saleItems.map((saleItem) => {
                    const item = storeItems.find(i => i.id === saleItem.itemId);
                    if (!item) return null;
                    return (
                      <div key={saleItem.itemId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.name[language]}</p>
                          <p className="text-sm text-muted-foreground">
                            {saleItem.quantity} × {item.price.toFixed(2)} دج
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold">{(saleItem.quantity * item.price).toFixed(2)} دج</p>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItemFromSale(saleItem.itemId)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t.total}</span>
                    <span>{calculateSaleTotal().toFixed(2)} دج</span>
                  </div>

                  <div>
                    <Label>{t.paymentMethod}</Label>
                    <Select value={paymentMethod} onValueChange={(value: 'cash' | 'credit') => setPaymentMethod(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{t.cash}</SelectItem>
                        <SelectItem value="credit">{t.credit}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'credit' && (
                    <div>
                      <Label>{t.customer}</Label>
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر العميل" />
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
                  )}

                  <Button
                    onClick={completeSale}
                    disabled={saleItems.length === 0 || (paymentMethod === 'credit' && !selectedCustomer)}
                    className="w-full"
                  >
                    {t.completeSale}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-4">
            {storeSales.slice(-10).reverse().map((sale) => (
              <Card key={sale.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{t.date}: {new Date(sale.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.items}: {sale.items.length} | {sale.paymentMethod === 'cash' ? t.cash : t.credit}
                      </p>
                    </div>
                    <p className="font-bold text-lg">{sale.total.toFixed(2)} دج</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManagement;