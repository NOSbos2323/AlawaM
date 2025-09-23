import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGasStationStore } from '@/store/gasStationStore';
import { ShoppingBag, Plus, Package, AlertTriangle, Receipt, Trash2, Save, Pencil, DollarSign, ShoppingCart } from 'lucide-react';

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
    name: '',
    buyPrice: '',
    sellPrice: '',
    stock: '',
    unit: 'unit' as 'unit' | 'liter' | 'kg',
  });

  // حذف useEffect للاعتماد على المخزون كقيمة افتراضية للقراءة السابقة

  // إضافة قراءات للمنتجات مثل المضخات
  const [prevReadings, setPrevReadings] = useState<Record<string, number>>({});
  const [readings, setReadings] = useState<Record<string, number>>({});

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
      newSale: 'بيع بالقراءات',
      addItem: 'إضافة منتج',
      itemName: 'اسم المنتج',
      buyPrice: 'سعر الشراء',
      sellPrice: 'سعر البيع',
      stock: 'المخزون',
      productType: 'نوع المنتج',
      type_unit: 'معلب (علبة)',
      type_liter: 'لترات',
      type_kg: 'ميزان (كيلوغرام)',
      lowStock: 'مخزون منخفض',
      outOfStock: 'نفد المخزون',
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
      unit_unit: 'علبة',
      unit_liter: 'لتر',
      unit_kg: 'كغ',
      previousReading: 'القراءة السابقة',
      newReading: 'المتبقي في المخزون',
      sold: 'الكمية المباعة',
      revenue: 'الإيرادات',
      dailyProductsTotal: 'إجمالي إيرادات المنتجات لليوم',
      errorOverStock: 'لا يمكن بيع أكثر من المخزون',
      salesSummary: 'ملخص مبيعات اليوم',
      // Dashboard labels
      todayRevenue: 'إيرادات اليوم (المتجر)',
      todayTransactions: 'معاملات اليوم (المتجر)',
      totalItemsDash: 'إجمالي المنتجات',
      lowStockCount: 'عدد منتجات المخزون المنخفض',
    },
    fr: {
      title: 'Gestion du magasin',
      inventory: 'Inventaire',
      sales: 'Ventes',
      newSale: 'Vente par relevés',
      addItem: 'Ajouter un article',
      itemName: "Nom de l'article",
      buyPrice: "Prix d'achat",
      sellPrice: 'Prix de vente',
      stock: 'Stock',
      productType: 'Type de produit',
      type_unit: 'Emballé (unité)',
      type_liter: 'Litres',
      type_kg: 'Poids (kg)',
      lowStock: 'Stock faible',
      outOfStock: 'Rupture de stock',
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
      unit_unit: 'u',
      unit_liter: 'L',
      unit_kg: 'kg',
      previousReading: 'Ancien relevé',
      newReading: 'Stock restant',
      sold: 'Quantité vendue',
      revenue: 'Recette',
      dailyProductsTotal: "Total recettes d'aujourd'hui",
      errorOverStock: "Vente au-delà du stock n'est pas autorisée",
      salesSummary: 'Résumé des ventes du jour',
      // Dashboard labels
      todayRevenue: "Revenus d'aujourd'hui (magasin)",
      todayTransactions: "Transactions d'aujourd'hui (magasin)",
      totalItemsDash: 'Total des articles',
      lowStockCount: 'Articles à stock faible',
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
    if (newItem.name && newItem.buyPrice && newItem.sellPrice && newItem.stock && newItem.unit) {
      addStoreItem({
        name: newItem.name,
        buyPrice: parseFloat(newItem.buyPrice),
        sellPrice: parseFloat(newItem.sellPrice),
        stock: parseFloat(newItem.stock),
        unit: newItem.unit,
      });
      setNewItem({ name: '', buyPrice: '', sellPrice: '', stock: '', unit: 'unit' });
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
      return total + (item ? item.sellPrice * saleItem.quantity : 0);
    }, 0);
  };

  // حالة تعديل منتج
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    buyPrice: string;
    sellPrice: string;
    unit: 'unit' | 'liter' | 'kg';
    addStock: string;
  }>({ name: '', buyPrice: '', sellPrice: '', unit: 'unit', addStock: '' });

  const openEditItem = (id: string) => {
    const it = storeItems.find((i) => i.id === id);
    if (!it) return;
    setEditingItemId(id);
    setEditForm({
      name: it.name,
      buyPrice: String(it.buyPrice),
      sellPrice: String(it.sellPrice),
      unit: it.unit,
      addStock: '',
    });
  };

  const handleSaveEdit = () => {
    if (!editingItemId) return;
    const it = storeItems.find((i) => i.id === editingItemId);
    if (!it) return;

    const name = editForm.name.trim() || it.name;
    const buyPrice = parseFloat(editForm.buyPrice || String(it.buyPrice)) || it.buyPrice;
    const sellPrice = parseFloat(editForm.sellPrice || String(it.sellPrice)) || it.sellPrice;
    const unit = editForm.unit || it.unit;
    const addStockNum = Math.max(0, parseFloat(editForm.addStock || '0') || 0);
    const newStock = it.stock + addStockNum;

    updateStoreItem(editingItemId, { name, buyPrice, sellPrice, unit, stock: newStock });

    // الحفاظ على التناسق مع القراءات: حدّث العدد السابق إلى المخزون الجديد بعد الإضافة
    setPrevReadings((s) => ({ ...s, [editingItemId]: newStock }));

    setEditingItemId(null);
  };

  // حفظ قراءة منتج واحد وتسجيل البيع وتحديث المخزون (يحترم نوع الوحدة)
  const handleSaveItemReading = (itemId: string) => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item) return;
    const prev = (prevReadings[itemId] ?? item.stock);
    const curr = readings[item.id] ?? 0;

    const rawSold = prev - curr;
    const sold = item.unit === 'unit'
      ? Math.floor(rawSold)
      : Math.max(0, Number(rawSold.toFixed(2)));

    if (sold <= 0) return;
    if (sold > item.stock) return;

    const amount = sold * item.sellPrice;

    addStoreSale({
      items: [{ itemId, quantity: sold, price: item.sellPrice }],
      total: amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
    });

    updateStoreItem(itemId, { stock: Math.max(0, item.stock - sold) });

    // تحديث القراءة السابقة لتصبح المتبقي الحالي للعملية التالية
    setPrevReadings((s) => ({ ...s, [itemId]: curr }));
    // مسح القراءة الحالية لإعادة تعيينها
    setReadings((s) => {
      const n = { ...s };
      delete n[itemId];
      return n;
    });
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
            price: item?.sellPrice || 0,
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

  const getUnitLabel = (unit: 'unit' | 'liter' | 'kg') => {
    if (unit === 'liter') return t.unit_liter;
    if (unit === 'kg') return t.unit_kg;
    return t.unit_unit;
  };

  // Dashboard metrics for Store page
  const today = new Date().toISOString().split('T')[0];
  const todaySales = storeSales.filter((s) => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayTransactions = todaySales.length;
  const totalItemsDash = storeItems.length;
  const lowStockCount = storeItems.filter((it) => it.stock < 10).length;

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
                  <Label>{t.itemName}</Label>
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.buyPrice}</Label>
                  <Input
                    type="number"
                    value={newItem.buyPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, buyPrice: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.sellPrice}</Label>
                  <Input
                    type="number"
                    value={newItem.sellPrice}
                    onChange={(e) => setNewItem(prev => ({ ...prev, sellPrice: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>{t.productType}</Label>
                  <Select value={newItem.unit} onValueChange={(value: 'unit' | 'liter' | 'kg') => setNewItem(prev => ({ ...prev, unit: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unit">{t.type_unit}</SelectItem>
                      <SelectItem value="liter">{t.type_liter}</SelectItem>
                      <SelectItem value="kg">{t.type_kg}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t.stock} ({getUnitLabel(newItem.unit)})</Label>
                  <Input
                    type="number"
                    value={newItem.stock}
                    onChange={(e) => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                  />
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

      {/* Store dashboard summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">{t.todayRevenue}</p>
                <p className="text-3xl font-bold">{todayRevenue.toFixed(2)}</p>
                <p className="text-green-100 text-xs">دج</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">{t.todayTransactions}</p>
                <p className="text-3xl font-bold">{todayTransactions}</p>
                <p className="text-blue-100 text-xs">معاملة</p>
              </div>
              <Receipt className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">{t.totalItemsDash}</p>
                <p className="text-3xl font-bold">{totalItemsDash}</p>
                <p className="text-purple-100 text-xs">منتج</p>
              </div>
              <Package className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">{t.lowStockCount}</p>
                <p className="text-3xl font-bold">{lowStockCount}</p>
                <p className="text-orange-100 text-xs">منتج</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
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
              const stockStatus = getStockStatus(item as any);
              return (
                <Card key={item.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{item.name}</span>
                      <div className="flex items-center gap-2">
                        {stockStatus.status !== 'ok' && (
                          <Badge variant={stockStatus.color as any} className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {stockStatus.text}
                          </Badge>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditItem(item.id)}
                          className="h-8 p-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
                      <span className="text-sm text-muted-foreground">{t.sellPrice}</span>
                      <span className="font-bold text-lg">{item.sellPrice.toFixed(2)} دج</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{t.stock}</span>
                      <span className={`font-mono ${item.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.stock} {getUnitLabel(item.unit)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                {t.newSale}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {storeItems.filter((item) => item.stock > 0).map((item) => {
                  const prev = (prevReadings[item.id] ?? item.stock);
                  const curr = readings[item.id] ?? 0;
                  const rawSold = Math.max(0, prev - curr);
                  const sold = item.unit === 'unit' ? Math.floor(rawSold) : rawSold;
                  const overStock = sold > item.stock;
                  const amount = sold * item.sellPrice;
                  const unitLabel = getUnitLabel(item.unit);
                  const step = item.unit === 'unit' ? 1 : 0.01;
                  const soldDisplay = item.unit === 'unit' ? String(sold) : sold.toFixed(2);
                  return (
                    <div key={item.id} className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.sellPrice.toFixed(2)} دج / {unitLabel}</span>
                          <span className="text-xs text-blue-600">متوفر: {item.stock} {unitLabel}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label className="text-sm">{t.previousReading} ({unitLabel})</Label>
                          <Input
                            type="number"
                            step={step}
                            min={0}
                            value={(prevReadings[item.id] ?? item.stock).toString()}
                            onChange={(e) =>
                              setPrevReadings((s) => ({ ...s, [item.id]: parseFloat(e.target.value) || 0 }))
                            }
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">{t.newReading}</Label>
                          <Input
                            type="number"
                            step={step}
                            min={0}
                            max={prev}
                            value={readings[item.id] ?? ''}
                            onChange={(e) =>
                              setReadings((s) => ({ ...s, [item.id]: parseFloat(e.target.value) || 0 }))
                            }
                            placeholder={String(prev)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">{t.sold}</Label>
                          <p className={`font-mono text-lg ${overStock ? 'text-red-600' : ''}`}>
                            {soldDisplay} {unitLabel}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm">{t.revenue}</Label>
                          <p className="font-mono text-lg">{amount.toFixed(2)} دج</p>
                        </div>
                      </div>
                      {overStock && (
                        <p className="text-sm text-red-600 mt-2">{t.errorOverStock} (الحد الأقصى {item.stock} {unitLabel})</p>
                      )}
                      <div className="mt-3">
                        <Button
                          onClick={() => handleSaveItemReading(item.id)}
                          disabled={sold <= 0 || overStock}
                          className="w-full md:w-auto"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {t.save}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-bold">{t.dailyProductsTotal}</span>
                <span className="font-mono font-bold text-green-600">
                  {storeSales
                    .filter((s) => s.date === new Date().toISOString().split('T')[0])
                    .reduce((sum, s) => sum + s.total, 0)
                    .toFixed(2)} دج
                </span>
              </div>
              {/* ملخص المبيعات أسفل الصفحة */}
              {(() => {
                const today = new Date().toISOString().split('T')[0];
                const summary: Record<string, { qty: number; amount: number } > = {};
                storeSales
                  .filter((s) => s.date === today)
                  .forEach((s) => {
                    s.items.forEach((it) => {
                      if (!summary[it.itemId]) summary[it.itemId] = { qty: 0, amount: 0 };
                      summary[it.itemId].qty += it.quantity;
                      summary[it.itemId].amount += it.quantity * it.price;
                    });
                  });
                const entries = Object.entries(summary);
                if (entries.length === 0) return null;
                return (
                  <div className="mt-4 space-y-2">
                    <div className="font-bold">{t.salesSummary}</div>
                    <div className="space-y-1">
                      {entries.map(([itemId, data]) => {
                        const item = storeItems.find((i) => i.id === itemId);
                        const unitLabel = item ? getUnitLabel(item.unit) : '';
                        return (
                          <div key={itemId} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{item?.name || itemId}</span>
                            <span className="font-mono">
                              {data.qty.toFixed(2)} {unitLabel} — {data.amount.toFixed(2)} دج
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
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

      {/* حوار تعديل منتج */}
      <Dialog open={!!editingItemId} onOpenChange={(open) => !open && setEditingItemId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.addItem}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>{t.itemName}</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((s) => ({ ...s, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>{t.buyPrice}</Label>
                <Input
                  type="number"
                  value={editForm.buyPrice}
                  onChange={(e) => setEditForm((s) => ({ ...s, buyPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label>{t.sellPrice}</Label>
                <Input
                  type="number"
                  value={editForm.sellPrice}
                  onChange={(e) => setEditForm((s) => ({ ...s, sellPrice: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>{t.productType}</Label>
              <Select
                value={editForm.unit}
                onValueChange={(value: 'unit' | 'liter' | 'kg') => setEditForm((s) => ({ ...s, unit: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">{t.type_unit}</SelectItem>
                  <SelectItem value="liter">{t.type_liter}</SelectItem>
                  <SelectItem value="kg">{t.type_kg}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>إضافة مخزون</Label>
              <Input
                type="number"
                placeholder={`0 (${t.unit_unit}/${t.unit_liter}/${t.unit_kg})`}
                value={editForm.addStock}
                onChange={(e) => setEditForm((s) => ({ ...s, addStock: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">سيتم جمع الكمية بالمخزون الحالي</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit}>{t.save}</Button>
              <Button variant="outline" onClick={() => setEditingItemId(null)}>{t.cancel}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoreManagement;