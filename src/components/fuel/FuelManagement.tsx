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

const FuelManagement: React.FC<FuelManagementProps> = ({ language = 'ar' }) => {
  const {
    pumps,
    fuelTypes,
    tanks,
    updatePumpReading,
    addDailyReading,
    updateTankLevel,
  } = useGasStationStore();

  const [pumpReadings, setPumpReadings] = useState<Record<string, string>>({});
  const [tankUpdates, setTankUpdates] = useState<Record<string, string>>({});

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
    },
  };

  const t = texts[language];

  const getFuelType = (fuelTypeId: string) => {
    return fuelTypes.find(ft => ft.id === fuelTypeId);
  };

  const calculateSales = (pumpId: string, newReading: number) => {
    const pump = pumps.find(p => p.id === pumpId);
    if (!pump) return { litersSold: 0, revenue: 0 };

    const litersSold = newReading - pump.currentReading;
    const fuelType = getFuelType(pump.fuelType);
    const revenue = litersSold * (fuelType?.pricePerLiter || 0);

    return { litersSold, revenue };
  };

  const handleUpdatePumpReading = (pumpId: string) => {
    const newReading = parseFloat(pumpReadings[pumpId] || '0');
    const pump = pumps.find(p => p.id === pumpId);
    
    if (pump && newReading > pump.currentReading) {
      const { litersSold, revenue } = calculateSales(pumpId, newReading);
      
      // Add daily reading record
      addDailyReading({
        date: new Date().toISOString().split('T')[0],
        pumpId,
        previousReading: pump.currentReading,
        currentReading: newReading,
        litersSold,
        revenue,
      });

      // Update pump reading
      updatePumpReading(pumpId, newReading);
      
      // Clear input
      setPumpReadings(prev => ({ ...prev, [pumpId]: '' }));
    }
  };

  const handleUpdateTankLevel = (tankId: string) => {
    const newLevel = parseFloat(tankUpdates[tankId] || '0');
    if (newLevel >= 0) {
      updateTankLevel(tankId, newLevel);
      setTankUpdates(prev => ({ ...prev, [tankId]: '' }));
    }
  };

  const saveAllReadings = () => {
    Object.keys(pumpReadings).forEach(pumpId => {
      if (pumpReadings[pumpId]) {
        handleUpdatePumpReading(pumpId);
      }
    });
  };

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Fuel className="h-8 w-8" />
          {t.title}
        </h1>
        <Button onClick={saveAllReadings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {t.saveAll}
        </Button>
      </div>

      <Tabs defaultValue="pumps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pumps">{t.pumpReadings}</TabsTrigger>
          <TabsTrigger value="tanks">{t.tankLevels}</TabsTrigger>
        </TabsList>

        <TabsContent value="pumps" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pumps.map((pump) => {
              const fuelType = getFuelType(pump.fuelType);
              const newReading = parseFloat(pumpReadings[pump.id] || '0');
              const sales = newReading > pump.currentReading ? calculateSales(pump.id, newReading) : null;

              return (
                <Card key={pump.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t.pump} {pump.number}</span>
                      <Badge variant="outline" style={{ backgroundColor: fuelType?.color + '20', color: fuelType?.color }}>
                        {fuelType?.name[language]}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>{t.previousReading}</Label>
                        <p className="font-mono">{pump.previousReading.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label>{t.currentReading}</Label>
                        <p className="font-mono">{pump.currentReading.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`pump-${pump.id}`}>{t.newReading}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`pump-${pump.id}`}
                          type="number"
                          value={pumpReadings[pump.id] || ''}
                          onChange={(e) => setPumpReadings(prev => ({ ...prev, [pump.id]: e.target.value }))}
                          placeholder={pump.currentReading.toString()}
                          className="font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdatePumpReading(pump.id)}
                          disabled={!pumpReadings[pump.id] || parseFloat(pumpReadings[pump.id]) <= pump.currentReading}
                        >
                          {t.updateReading}
                        </Button>
                      </div>
                    </div>

                    {sales && (
                      <div className="bg-green-50 p-3 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">{t.calculate}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label>{t.litersSold}</Label>
                            <p className="font-mono text-green-700">{sales.litersSold.toLocaleString()} L</p>
                          </div>
                          <div>
                            <Label>{t.revenue}</Label>
                            <p className="font-mono text-green-700">{sales.revenue.toFixed(2)} SAR</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="tanks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tanks.map((tank) => {
              const fuelType = getFuelType(tank.fuelType);
              const percentage = (tank.currentLevel / tank.capacity) * 100;
              const isLowLevel = tank.currentLevel <= tank.minLevel;

              return (
                <Card key={tank.id} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{t.tank} {tank.name}</span>
                      {isLowLevel && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {t.lowLevel}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Badge variant="outline" style={{ backgroundColor: tank.color + '20', color: tank.color }}>
                        {fuelType?.name[language]}
                      </Badge>
                    </div>

                    <div className="relative h-32 w-full border-2 border-muted rounded-md overflow-hidden">
                      <div
                        className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
                        style={{
                          height: `${percentage}%`,
                          backgroundColor: tank.color,
                        }}
                      />
                      <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="border-t border-dashed border-muted-foreground/30 w-full h-0" />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>{t.currentLevel}</span>
                        <span className="font-mono">{tank.currentLevel.toLocaleString()} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.capacity}</span>
                        <span className="font-mono">{tank.capacity.toLocaleString()} L</span>
                      </div>
                      <div className="flex justify-between">
                        <span>%</span>
                        <span className="font-mono">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tank-${tank.id}`}>{t.newLevel}</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`tank-${tank.id}`}
                          type="number"
                          value={tankUpdates[tank.id] || ''}
                          onChange={(e) => setTankUpdates(prev => ({ ...prev, [tank.id]: e.target.value }))}
                          placeholder={tank.currentLevel.toString()}
                          className="font-mono"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateTankLevel(tank.id)}
                          disabled={!tankUpdates[tank.id]}
                        >
                          {t.updateLevel}
                        </Button>
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

export default FuelManagement;