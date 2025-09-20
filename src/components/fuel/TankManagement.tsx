import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useGasStationStore } from '@/store/gasStationStore';
import { Fuel, AlertTriangle, Gauge, Plus, Edit, Trash2 } from 'lucide-react';

interface TankManagementProps {
  language?: 'ar' | 'fr';
}

export default function TankManagement({ language = 'ar' }: TankManagementProps) {
  const { 
    tanks,
    fuelTypes,
    pumps,
    updateTankLevel 
  } = useGasStationStore();

  const [newLevels, setNewLevels] = useState<Record<string, number>>({});
  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'إدارة الخزانات',
      subtitle: 'مراقبة وإدارة مستويات الوقود في الخزانات',
      tank: 'خزان',
      capacity: 'السعة',
      currentLevel: 'المستوى الحالي',
      newLevel: 'المستوى الجديد',
      updateLevel: 'تحديث المستوى',
      lowLevel: 'مستوى منخفض',
      connectedPumps: 'المضخات المتصلة',
      fuelType: 'نوع الوقود',
      fillPercentage: 'نسبة الامتلاء',
      needsRefill: 'يحتاج إعادة تعبئة',
      liters: 'لتر',
      active: 'مُفعّل',
      inactive: 'غير مُفعّل',
      warning: 'تحذير',
      normal: 'طبيعي',
      critical: 'حرج'
    },
    fr: {
      title: 'Gestion des Réservoirs',
      subtitle: 'Surveillance et gestion des niveaux de carburant',
      tank: 'Réservoir',
      capacity: 'Capacité',
      currentLevel: 'Niveau actuel',
      newLevel: 'Nouveau niveau',
      updateLevel: 'Mettre à jour',
      lowLevel: 'Niveau bas',
      connectedPumps: 'Pompes connectées',
      fuelType: 'Type de carburant',
      fillPercentage: 'Pourcentage de remplissage',
      needsRefill: 'Nécessite un remplissage',
      liters: 'litres',
      active: 'Actif',
      inactive: 'Inactif',
      warning: 'Attention',
      normal: 'Normal',
      critical: 'Critique'
    },
  };

  const t = texts[language];

  const handleUpdateLevel = (tankId: string, newLevel: number) => {
    updateTankLevel(tankId, newLevel);
    setNewLevels(prev => ({ ...prev, [tankId]: 0 }));
  };

  const getTankStatus = (tank: any) => {
    const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
    if (tank.currentLevel <= tank.minLevel) return 'critical';
    if (fillPercentage <= 30) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
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

        {/* Tank Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tanks.filter(tank => tank.isActive).map((tank) => {
            const fuelType = fuelTypes.find(ft => ft.id === tank.fuelType);
            const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
            const status = getTankStatus(tank);
            const connectedPumps = pumps.filter(pump => pump.tankId === tank.id);
            
            return (
              <Card key={tank.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                        style={{ backgroundColor: fuelType?.color || '#gray' }}
                      />
                      <span className="text-lg">{tank.name}</span>
                    </div>
                    {status === 'critical' && (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Tank Status Badge */}
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant="secondary" 
                      className={`${getStatusColor(status)} border`}
                    >
                      {status === 'critical' ? t.critical : 
                       status === 'warning' ? t.warning : t.normal}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {connectedPumps.length} {t.connectedPumps}
                    </span>
                  </div>

                  {/* Fuel Type */}
                  <div className="bg-slate-50 p-3 rounded-lg">
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

                  {/* Current Level Display */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                      <Label className="text-sm font-medium">{t.currentLevel}</Label>
                      <div className="text-right">
                        <span className={`text-2xl font-bold font-mono ${
                          status === 'critical' ? 'text-red-600' : 
                          status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {(tank.currentLevel || 0).toLocaleString()}
                        </span>
                        <span className="text-sm text-slate-500 ml-1">{t.liters}</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(status)}`}
                          style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{fillPercentage.toFixed(1)}%</span>
                        <span>{(tank.capacity || 0).toLocaleString()} {t.liters}</span>
                      </div>
                    </div>
                  </div>

                  {/* Update Level Section */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <Label className="text-sm font-medium">{t.newLevel}</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={tank.capacity}
                        value={newLevels[tank.id] || ''}
                        onChange={(e) => setNewLevels(prev => ({
                          ...prev,
                          [tank.id]: parseFloat(e.target.value) || 0
                        }))}
                        placeholder="0"
                        className="font-mono"
                      />
                      <Button 
                        onClick={() => handleUpdateLevel(tank.id, newLevels[tank.id] || 0)}
                        disabled={!newLevels[tank.id] || newLevels[tank.id] <= 0}
                        size="sm"
                        className="px-3"
                      >
                        <Gauge className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Warning Message */}
                  {status === 'critical' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-700 font-medium">
                          {t.needsRefill}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Connected Pumps List */}
                  {connectedPumps.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-500 uppercase tracking-wide">
                        {t.connectedPumps}
                      </Label>
                      <div className="flex flex-wrap gap-1">
                        {connectedPumps.map(pump => (
                          <Badge key={pump.id} variant="outline" className="text-xs">
                            {pump.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Statistics */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              ملخص الخزانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {tanks.filter(t => t.isActive).length}
                </div>
                <div className="text-sm text-slate-500">إجمالي الخزانات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {tanks.filter(t => t.isActive && getTankStatus(t) === 'normal').length}
                </div>
                <div className="text-sm text-slate-500">خزانات طبيعية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {tanks.filter(t => t.isActive && getTankStatus(t) === 'warning').length}
                </div>
                <div className="text-sm text-slate-500">تحتاج مراقبة</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {tanks.filter(t => t.isActive && getTankStatus(t) === 'critical').length}
                </div>
                <div className="text-sm text-slate-500">تحتاج تعبئة فورية</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}