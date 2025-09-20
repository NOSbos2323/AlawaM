import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGasStationStore } from '@/store/gasStationStore';
import { Fuel, Calculator, Save, AlertTriangle } from 'lucide-react';

interface FuelManagementProps {
  language?: 'ar' | 'fr';
}

export default function FuelManagement({ language = 'ar' }: FuelManagementProps) {
  const { 
    pumps, 
    fuelTypes, 
    tanks,
    updatePump, 
    recordSale,
    updateTankLevel 
  } = useGasStationStore();

  const [readings, setReadings] = useState<Record<string, number>>({});

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة الوقود',
      pumpReadings: 'قراءات المضخات',
      tankLevels: 'مستويات الخزانات',
      pump: 'مضخة',
      previousReading: 'القراءة السابقة',
      currentReading: 'القراءة الحالية',
      newReading: 'القراءة الجديدة',
      litersSold: 'لتر مباع',
      revenue: 'الإيراد',
      updateReading: 'تحديث القراءة',
      saveAll: 'حفظ الكل',
      tank: 'خزان',
      capacity: 'السعة',
      currentLevel: 'المستوى الحالي',
      newLevel: 'المستوى الجديد',
      updateLevel: 'تحديث المستوى',
      lowLevel: 'مستوى منخفض',
      calculate: 'حساب',
      active: 'مُفعّل',
      inactive: 'غير مُفعّل',
      fuelManagement: 'إدارة الوقود',
      manageDailyReadings: 'إدارة القراءات اليومية',
    },
    fr: {
      title: 'Gestion du carburant',
      pumpReadings: 'Lectures des pompes',
      tankLevels: 'Niveaux des réservoirs',
      pump: 'Pompe',
      previousReading: 'Lecture précédente',
      currentReading: 'Lecture actuelle',
      newReading: 'Nouvelle lecture',
      litersSold: 'Litres vendus',
      revenue: 'Revenus',
      updateReading: 'Mettre à jour',
      saveAll: 'Tout sauvegarder',
      tank: 'Réservoir',
      capacity: 'Capacité',
      currentLevel: 'Niveau actuel',
      newLevel: 'Nouveau niveau',
      updateLevel: 'Mettre à jour',
      lowLevel: 'Niveau bas',
      calculate: 'Calculer',
      active: 'Actif',
      inactive: 'Inactif',
      fuelManagement: 'Gestion du carburant',
      manageDailyReadings: 'Gestion des lectures quotidiennes',
    },
  };

  const t = texts[language];

  const getFuelType = (fuelTypeId: string) => {
    return fuelTypes.find(ft => ft.id === fuelTypeId);
  };

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
      // تسجيل المبيعات وتحديث مستوى الخزان تلقائياً
      const amount = liters * (pump.sellPrice || 0);
      recordSale(pumpId, liters, amount);
      
      // تحديث قراءة المضخة
      updatePump(pumpId, {
        previousReading: pump.currentReading,
        currentReading: newReading,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.fuelManagement}</h1>
          <p className="text-muted-foreground">{t.manageDailyReadings}</p>
        </div>

        {/* عرض حالة الخزانات */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              حالة الخزانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tanks.filter(tank => tank.isActive).map((tank) => {
                const fuelType = fuelTypes.find(ft => ft.id === tank.fuelType);
                const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
                const isLowLevel = tank.currentLevel <= tank.minLevel;
                const connectedPumps = pumps.filter(pump => pump.tankId === tank.id);
                
                return (
                  <div key={tank.id} className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: fuelType?.color }}
                      />
                      <span className="font-medium">{tank.name}</span>
                      {isLowLevel && <span className="text-red-500">⚠️</span>}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المستوى:</span>
                        <span className={`font-mono ${isLowLevel ? 'text-red-600' : 'text-green-600'}`}>
                          {(tank.currentLevel || 0).toLocaleString()} لتر
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            isLowLevel 
                              ? 'bg-red-500' 
                              : fillPercentage <= 30
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{(fillPercentage || 0).toFixed(1)}%</span>
                        <span>{connectedPumps.length} مضخة متصلة</span>
                      </div>
                      
                      {isLowLevel && (
                        <p className="text-xs text-red-600 bg-red-50 p-1 rounded">
                          يحتاج إعادة تعبئة
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* عرض المضخات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pumps.filter(pump => pump.isActive).map((pump) => {
            const fuelType = fuelTypes.find(ft => ft.id === pump.fuelType);
            const tank = tanks.find(t => t.id === pump.tankId);
            const sales = calculatePumpSales(pump);
            
            return (
              <Card key={pump.id} className="bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: fuelType?.color || '#gray' }}
                      />
                      <span>{pump.name}</span>
                    </div>
                    <Badge variant={pump.isActive ? "default" : "secondary"}>
                      {pump.isActive ? t.active : t.inactive}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* معلومات الخزان المرتبط */}
                  {tank && (
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">الخزان المرتبط:</span>
                        <span className="text-sm">{tank.name}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">المستوى:</span>
                        <span className={`text-xs font-mono ${
                          (tank.currentLevel || 0) <= (tank.minLevel || 0) ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {(tank.currentLevel || 0).toLocaleString()} / {(tank.capacity || 0).toLocaleString()} لتر
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            (tank.currentLevel || 0) <= (tank.minLevel || 0)
                              ? 'bg-red-500' 
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(((tank.currentLevel || 0) / (tank.capacity || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      {(tank.currentLevel || 0) <= (tank.minLevel || 0) && (
                        <p className="text-xs text-red-600 mt-1">⚠️ مستوى منخفض</p>
                      )}
                    </div>
                  )}

                  {/* عرض معلومات المضخة والوقود */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted p-3 rounded">
                    <div className="space-y-1">
                      <Label className="text-xs">نوع الوقود</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: fuelType?.color }}
                        />
                        <span className="font-medium">{fuelType?.name?.[language] || 'غير محدد'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">الربح/لتر</Label>
                      <p className="font-mono text-green-600">
                        {((pump.sellPrice || 0) - (pump.buyPrice || 0)).toFixed(2)} دج
                      </p>
                    </div>
                  </div>

                  {/* عرض أسعار المضخة */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>سعر الشراء</Label>
                      <p className="font-mono text-red-600">{(pump.buyPrice || 0).toFixed(2)} دج/لتر</p>
                    </div>
                    <div>
                      <Label>سعر البيع</Label>
                      <p className="font-mono text-green-600">{(pump.sellPrice || 0).toFixed(2)} دج/لتر</p>
                    </div>
                  </div>

                  {/* قراءات المضخة */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>القراءة السابقة</Label>
                        <p className="font-mono text-lg">{(pump.previousReading || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>القراءة الحالية</Label>
                        <Input
                          type="number"
                          min={pump.currentReading || 0}
                          value={readings[pump.id] || pump.currentReading || 0}
                          onChange={(e) => setReadings(prev => ({
                            ...prev,
                            [pump.id]: parseFloat(e.target.value) || (pump.currentReading || 0)
                          }))}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    {/* عرض المبيعات المحسوبة */}
                    {readings[pump.id] && readings[pump.id] > (pump.currentReading || 0) && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-green-700">اللترات المباعة</Label>
                            <p className="font-mono text-green-800 text-lg">
                              {(readings[pump.id] - (pump.currentReading || 0)).toFixed(2)} لتر
                            </p>
                          </div>
                          <div>
                            <Label className="text-green-700">المبلغ الإجمالي</Label>
                            <p className="font-mono text-green-800 text-lg">
                              {((readings[pump.id] - (pump.currentReading || 0)) * (pump.sellPrice || 0)).toFixed(2)} دج
                            </p>
                          </div>
                        </div>
                        
                        {/* تحذير إذا كان الخزان لا يحتوي على كمية كافية */}
                        {tank && (readings[pump.id] - (pump.currentReading || 0)) > (tank.currentLevel || 0) && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-red-700 text-xs">
                              ⚠️ تحذير: الكمية المطلوبة أكبر من المتوفر في الخزان!
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={() => handleSaveReading(pump.id, readings[pump.id] || (pump.currentReading || 0))}
                      disabled={!readings[pump.id] || readings[pump.id] <= (pump.currentReading || 0)}
                      className="w-full"
                    >
                      حفظ القراءة
                    </Button>
                  </div>

                  {/* إحصائيات اليوم */}
                  <div className="border-t pt-3">
                    <h4 className="font-medium mb-2">إحصائيات اليوم</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs">اللترات المباعة</Label>
                        <p className="font-mono">{(pump.dailySales?.liters || 0).toFixed(2)} لتر</p>
                      </div>
                      <div>
                        <Label className="text-xs">إجمالي المبيعات</Label>
                        <p className="font-mono text-green-600">{(pump.dailySales?.amount || 0).toFixed(2)} دج</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}