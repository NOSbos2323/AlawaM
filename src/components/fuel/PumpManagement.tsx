import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGasStationStore } from '@/store/gasStationStore';
import { Fuel, Calculator, Save, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

interface PumpManagementProps {
  language?: 'ar' | 'fr';
}

export default function PumpManagement({ language = 'ar' }: PumpManagementProps) {
  const { 
    pumps, 
    fuelTypes, 
    tanks,
    updatePump, 
    recordSale
  } = useGasStationStore();

  const [readings, setReadings] = useState<Record<string, number>>({});
  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة المضخات',
      subtitle: 'تسجيل القراءات اليومية ومتابعة المبيعات',
      pump: 'مضخة',
      previousReading: 'القراءة السابقة',
      currentReading: 'القراءة الحالية',
      newReading: 'القراءة الجديدة',
      litersSold: 'لتر مباع',
      revenue: 'الإيراد',
      profit: 'الربح',
      updateReading: 'تحديث القراءة',
      saveReading: 'حفظ القراءة',
      fuelType: 'نوع الوقود',
      connectedTank: 'الخزان المرتبط',
      buyPrice: 'سعر الشراء',
      sellPrice: 'سعر البيع',
      profitPerLiter: 'الربح/لتر',
      dailyStats: 'إحصائيات اليوم',
      totalAmount: 'المبلغ الإجمالي',
      tankLevel: 'مستوى الخزان',
      lowLevel: 'مستوى منخفض',
      warning: 'تحذير',
      insufficientFuel: 'الكمية المطلوبة أكبر من المتوفر في الخزان!',
      active: 'مُفعّل',
      inactive: 'غير مُفعّل',
      currency: 'دج'
    },
    fr: {
      title: 'Gestion des Pompes',
      subtitle: 'Enregistrement des lectures quotidiennes et suivi des ventes',
      pump: 'Pompe',
      previousReading: 'Lecture précédente',
      currentReading: 'Lecture actuelle',
      newReading: 'Nouvelle lecture',
      litersSold: 'Litres vendus',
      revenue: 'Revenus',
      profit: 'Profit',
      updateReading: 'Mettre à jour',
      saveReading: 'Sauvegarder',
      fuelType: 'Type de carburant',
      connectedTank: 'Réservoir connecté',
      buyPrice: 'Prix d\'achat',
      sellPrice: 'Prix de vente',
      profitPerLiter: 'Profit/litre',
      dailyStats: 'Statistiques du jour',
      totalAmount: 'Montant total',
      tankLevel: 'Niveau du réservoir',
      lowLevel: 'Niveau bas',
      warning: 'Attention',
      insufficientFuel: 'Quantité demandée supérieure au disponible!',
      active: 'Actif',
      inactive: 'Inactif',
      currency: 'DA'
    },
  };

  const t = texts[language];

  const calculatePumpSales = (pump: any) => {
    const newReading = readings[pump.id] || pump.currentReading;
    const litersSold = newReading - pump.currentReading;
    const revenue = litersSold * (pump.sellPrice || 0);
    const profit = litersSold * ((pump.sellPrice || 0) - (pump.buyPrice || 0));

    return { litersSold, revenue, profit };
  };

  const handleSaveReading = (pumpId: string, newReading: number) => {
    const pump = pumps.find(p => p.id === pumpId);
    if (!pump) return;

    const liters = newReading - pump.currentReading;
    if (liters > 0) {
      const amount = liters * (pump.sellPrice || 0);
      recordSale(pumpId, liters, amount);
      
      updatePump(pumpId, {
        previousReading: pump.currentReading,
        currentReading: newReading,
      });
      
      // Clear the reading input
      setReadings(prev => ({ ...prev, [pumpId]: 0 }));
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 p-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h1>
          <p className="text-slate-600">{t.subtitle}</p>
        </div>

        {/* Pumps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pumps.filter(pump => pump.isActive).map((pump) => {
            const fuelType = fuelTypes.find(ft => ft.id === pump.fuelType);
            const tank = tanks.find(t => t.id === pump.tankId);
            const sales = calculatePumpSales(pump);
            const hasNewReading = readings[pump.id] && readings[pump.id] > (pump.currentReading || 0);
            const isInsufficientFuel = tank && hasNewReading && 
              (readings[pump.id] - (pump.currentReading || 0)) > (tank.currentLevel || 0);
            
            return (
              <Card key={pump.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                        style={{ backgroundColor: fuelType?.color || '#gray' }}
                      />
                      <span className="text-lg">{pump.name}</span>
                    </div>
                    <Badge variant={pump.isActive ? "default" : "secondary"}>
                      {pump.isActive ? t.active : t.inactive}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Fuel Type & Tank Info */}
                  <div className="bg-slate-50 p-3 rounded-lg space-y-3">
                    <div>
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">
                        {t.fuelType}
                      </Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: fuelType?.color }}
                        />
                        <span className="font-medium text-slate-900">
                          {fuelType?.name?.[language] || 'غير محدد'}
                        </span>
                      </div>
                    </div>

                    {/* Connected Tank */}
                    {tank && (
                      <div>
                        <Label className="text-xs text-slate-500 uppercase tracking-wide">
                          {t.connectedTank}
                        </Label>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-medium text-slate-900">{tank.name}</span>
                          <div className="text-right">
                            <div className={`text-sm font-mono ${
                              (tank.currentLevel || 0) <= (tank.minLevel || 0) ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {(tank.currentLevel || 0).toLocaleString()} لتر
                            </div>
                            {(tank.currentLevel || 0) <= (tank.minLevel || 0) && (
                              <div className="text-xs text-red-600 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {t.lowLevel}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing Info */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <Label className="text-xs text-red-600">{t.buyPrice}</Label>
                      <p className="font-mono text-red-700 font-medium">
                        {(pump.buyPrice || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <Label className="text-xs text-green-600">{t.sellPrice}</Label>
                      <p className="font-mono text-green-700 font-medium">
                        {(pump.sellPrice || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <Label className="text-xs text-blue-600">{t.profitPerLiter}</Label>
                      <p className="font-mono text-blue-700 font-medium">
                        {((pump.sellPrice || 0) - (pump.buyPrice || 0)).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Readings Section */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">{t.previousReading}</Label>
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg">
                          <span className="font-mono text-lg text-slate-700">
                            {(pump.previousReading || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">{t.currentReading}</Label>
                        <div className="mt-1 p-2 bg-slate-100 rounded-lg">
                          <span className="font-mono text-lg text-slate-900 font-medium">
                            {(pump.currentReading || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* New Reading Input */}
                    <div>
                      <Label className="text-sm font-medium">{t.newReading}</Label>
                      <Input
                        type="number"
                        min={pump.currentReading || 0}
                        value={readings[pump.id] || ''}
                        onChange={(e) => setReadings(prev => ({
                          ...prev,
                          [pump.id]: parseFloat(e.target.value) || 0
                        }))}
                        placeholder={(pump.currentReading || 0).toString()}
                        className="font-mono text-lg mt-1"
                      />
                    </div>
                  </div>

                  {/* Sales Calculation */}
                  {hasNewReading && (
                    <div className={`p-4 rounded-lg border-2 ${
                      isInsufficientFuel 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className={isInsufficientFuel ? 'text-red-700' : 'text-green-700'}>
                            {t.litersSold}
                          </Label>
                          <p className={`font-mono text-lg font-bold ${
                            isInsufficientFuel ? 'text-red-800' : 'text-green-800'
                          }`}>
                            {(readings[pump.id] - (pump.currentReading || 0)).toFixed(2)} لتر
                          </p>
                        </div>
                        <div>
                          <Label className={isInsufficientFuel ? 'text-red-700' : 'text-green-700'}>
                            {t.totalAmount}
                          </Label>
                          <p className={`font-mono text-lg font-bold ${
                            isInsufficientFuel ? 'text-red-800' : 'text-green-800'
                          }`}>
                            {((readings[pump.id] - (pump.currentReading || 0)) * (pump.sellPrice || 0)).toFixed(2)} {t.currency}
                          </p>
                        </div>
                      </div>
                      
                      {isInsufficientFuel && (
                        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-red-700 text-sm font-medium">
                              {t.warning}: {t.insufficientFuel}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Save Button */}
                  <Button 
                    onClick={() => handleSaveReading(pump.id, readings[pump.id] || (pump.currentReading || 0))}
                    disabled={!hasNewReading || isInsufficientFuel}
                    className="w-full"
                    size="lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {t.saveReading}
                  </Button>

                  {/* Daily Statistics */}
                  <div className="border-t pt-3">
                    <Label className="text-sm font-medium mb-2 block">{t.dailyStats}</Label>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-blue-50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="h-3 w-3 text-blue-600" />
                          <span className="text-xs text-blue-600">{t.litersSold}</span>
                        </div>
                        <p className="font-mono font-medium text-blue-800">
                          {(pump.dailySales?.liters || 0).toFixed(2)} لتر
                        </p>
                      </div>
                      <div className="text-center p-2 bg-green-50 rounded">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-green-600">{t.revenue}</span>
                        </div>
                        <p className="font-mono font-medium text-green-800">
                          {(pump.dailySales?.amount || 0).toFixed(2)} {t.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              ملخص المضخات اليومي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {pumps.filter(p => p.isActive).length}
                </div>
                <div className="text-sm text-slate-500">إجمالي المضخات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pumps.filter(p => p.isActive).reduce((sum, p) => sum + (p.dailySales?.liters || 0), 0).toFixed(0)}
                </div>
                <div className="text-sm text-slate-500">إجمالي اللترات المباعة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {pumps.filter(p => p.isActive).reduce((sum, p) => sum + (p.dailySales?.amount || 0), 0).toFixed(0)}
                </div>
                <div className="text-sm text-slate-500">إجمالي المبيعات ({t.currency})</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {pumps.filter(p => p.isActive).reduce((sum, p) => {
                    const profit = (p.dailySales?.liters || 0) * ((p.sellPrice || 0) - (p.buyPrice || 0));
                    return sum + profit;
                  }, 0).toFixed(0)}
                </div>
                <div className="text-sm text-slate-500">إجمالي الأرباح ({t.currency})</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}