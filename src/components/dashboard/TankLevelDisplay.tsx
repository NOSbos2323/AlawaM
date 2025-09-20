import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGasStationStore } from "@/store/gasStationStore";
import { AlertTriangle, Fuel } from "lucide-react";

interface TankLevelDisplayProps {
  language?: 'ar' | 'fr';
}

const TankLevelDisplay = ({ 
  language = 'ar'
}: TankLevelDisplayProps) => {
  const { tanks, fuelTypes } = useGasStationStore();
  const isRTL = language === 'ar';

  const texts = {
    ar: {
      tankLevels: "مستويات الخزانات",
      tank: "خزان",
      currentLevel: "المستوى الحالي",
      capacity: "السعة",
      fuelType: "نوع الوقود",
      lowLevel: "مستوى منخفض",
      critical: "حرج",
      warning: "تحذير",
      normal: "طبيعي",
      liters: "لتر",
      noTanks: "لا توجد خزانات متاحة",
      addFromSettings: "يمكن إضافة خزانات جديدة من الإعدادات"
    },
    fr: {
      tankLevels: "Niveaux des réservoirs",
      tank: "Réservoir",
      currentLevel: "Niveau actuel",
      capacity: "Capacité",
      fuelType: "Type de carburant",
      lowLevel: "Niveau bas",
      critical: "Critique",
      warning: "Attention",
      normal: "Normal",
      liters: "litres",
      noTanks: "Aucun réservoir disponible",
      addFromSettings: "Vous pouvez ajouter de nouveaux réservoirs depuis les paramètres"
    },
  };

  const t = texts[language];

  const activeTanks = tanks.filter(tank => tank.isActive);

  const getTankStatus = (tank: any) => {
    const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
    if (tank.currentLevel <= tank.minLevel) return 'critical';
    if (fillPercentage <= 30) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  if (activeTanks.length === 0) {
    return (
      <Card className="w-full bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            {t.tankLevels}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Fuel className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t.noTanks}</h3>
            <p className="text-slate-500 text-sm">{t.addFromSettings}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full bg-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fuel className="h-5 w-5" />
          {t.tankLevels}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeTanks.map((tank) => {
            const fuelType = fuelTypes.find(ft => ft.id === tank.fuelType);
            const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
            const status = getTankStatus(tank);
            
            return (
              <div key={tank.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                {/* Tank Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: fuelType?.color || '#gray' }}
                    />
                    <span className="font-medium text-slate-900">
                      {t.tank} {tank.name}
                    </span>
                  </div>
                  {status === 'critical' && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>

                {/* Status Badge */}
                <div className="mb-3">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(status)} border text-xs`}
                  >
                    {status === 'critical' ? t.critical : 
                     status === 'warning' ? t.warning : t.normal}
                  </Badge>
                </div>

                {/* Fuel Type */}
                <div className="mb-3">
                  <span className="text-xs text-slate-500 uppercase tracking-wide">
                    {t.fuelType}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: fuelType?.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {fuelType?.name?.[language] || 'غير محدد'}
                    </span>
                  </div>
                </div>

                {/* Tank Visualization */}
                <div className="mb-4">
                  <div className="relative h-24 w-full border-2 border-slate-300 rounded-md overflow-hidden bg-white">
                    {/* Fuel Level */}
                    <div
                      className="absolute bottom-0 w-full transition-all duration-500 ease-in-out opacity-80"
                      style={{
                        height: `${Math.min(fillPercentage, 100)}%`,
                        backgroundColor: fuelType?.color || '#gray',
                      }}
                    />
                    {/* Level Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
                      <div className="border-t border-dashed border-slate-400/40 w-full h-0" />
                      <div className="border-t border-dashed border-slate-400/40 w-full h-0" />
                      <div className="border-t border-dashed border-slate-400/40 w-full h-0" />
                    </div>
                  </div>
                </div>

                {/* Level Information */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">{t.currentLevel}</span>
                    <div className="text-right">
                      <span className={`text-lg font-bold font-mono ${
                        status === 'critical' ? 'text-red-600' : 
                        status === 'warning' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {(tank.currentLevel || 0).toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">{t.liters}</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(status)}`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0</span>
                      <span>{fillPercentage.toFixed(1)}%</span>
                      <span>{(tank.capacity || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Warning Message */}
                {status === 'critical' && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-700 font-medium">
                        {t.lowLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TankLevelDisplay;