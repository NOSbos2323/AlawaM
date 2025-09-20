import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useGasStationStore } from '@/store/gasStationStore';
import { Settings as SettingsIcon, Download, Upload, RotateCcw, Save, Globe, Moon, Sun, Database, Fuel, Edit, Plus, Trash2, DollarSign } from 'lucide-react';

interface SettingsProps {
  language?: 'ar' | 'fr';
  onLanguageChange?: (language: 'ar' | 'fr') => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const AppSettings: React.FC<SettingsProps> = ({ 
  language = 'ar', 
  onLanguageChange,
  onThemeChange 
}) => {
  const { 
    pumps, fuelTypes, tanks,
    addPump, updatePump, deletePump,
    addFuelType, updateFuelType, deleteFuelType,
    addTank, updateTank, deleteTank,
    settings, updateSettings, exportData, importData, resetData
  } = useGasStationStore();
  
  const [editingPump, setEditingPump] = useState<any>(null);
  const [editingFuelType, setEditingFuelType] = useState<any>(null);
  const [editingTank, setEditingTank] = useState<any>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  
  // إضافة حالات للتحكم في علب الحوار
  const [showAddPumpDialog, setShowAddPumpDialog] = useState(false);
  const [showEditPumpDialog, setShowEditPumpDialog] = useState(false);
  const [showAddTankDialog, setShowAddTankDialog] = useState(false);
  const [showEditTankDialog, setShowEditTankDialog] = useState(false);
  const [showAddFuelTypeDialog, setShowAddFuelTypeDialog] = useState(false);
  const [showEditFuelTypeDialog, setShowEditFuelTypeDialog] = useState(false);
  
  // إعدادات مؤقتة للتعديل
  const [tempSettings, setTempSettings] = useState({
    language: settings?.language || 'ar',
    theme: settings?.theme || 'light',
    currency: settings?.currency || 'دج',
    taxRate: settings?.taxRate || 19,
    zakatRate: settings?.zakatRate || 2.5,
    backupFrequency: settings?.backupFrequency || 'daily',
  });

  const texts = {
    ar: {
      title: 'الإعدادات',
      general: 'عام',
      language: 'اللغة',
      theme: 'السمة',
      currency: 'العملة',
      business: 'الأعمال',
      pumps: 'المضخات والوقود',
      taxRate: 'معدل الضريبة',
      zakatRate: 'معدل الزكاة',
      backupFrequency: 'تكرار النسخ الاحتياطي',
      dataManagement: 'ادارة البيانات',
      exportData: 'تصدير البيانات',
      importData: 'استيراد البيانات',
      resetData: 'إعادة تعيين البيانات',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      add: 'إضافة',
      arabic: 'العربية',
      french: 'الفرنسية',
      light: 'فاتح',
      dark: 'داكن',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      pumpName: 'اسم المضخة',
      fuelType: 'نوع الوقود',
      buyPrice: 'سعر الشراء',
      sellPrice: 'سعر البيع',
      profit: 'الربح',
      fuelTypes: 'أنواع الوقود',
      addPump: 'إضافة مضخة',
      editPump: 'تعديل المضخة',
      addFuelType: 'إضافة نوع وقود',
      editFuelType: 'تعديل نوع الوقود',
      fuelTypeName: 'اسم نوع الوقود',
      color: 'اللون',
      pumpSettings: 'إعدادات المضخات',
      fuelTypeSettings: 'إعدادات أنواع الوقود',
      exportDescription: 'تصدير جميع بيانات النظام إلى ملف JSON',
      importDescription: 'استيراد البيانات من ملف JSON محفوظ مسبقاً',
      resetDescription: 'حذف جميع البيانات وإعادة النظام إلى حالته الأولى',
      confirmReset: 'هل أنت متأكد من رغبتك في حذف جميع البيانات؟',
      selectFile: 'اختر ملف',
      noFileSelected: 'لم يتم اختيار ملف',
      resetWarning: 'تحذير: هذا الإجراء لا يمكن الراجع عنه!',
      settingsSaved: 'تم حفظ الإعدادات',
      dataExported: 'تم تصدير البيانات',
      dataImported: 'تم استيراد البيانات',
      dataReset: 'تم إعادة تعيين البيانات',
      percent: '%',
      tankManagement: 'إدارة الخزانات',
      addTank: 'إضافة خزان',
      settings: 'الإعدادات',
      manageSystemSettings: 'إدارة إعدادات النظام',
      pumpManagement: 'إدارة المضخات',
    },
    fr: {
      title: 'Paramètres',
      general: 'Général',
      language: 'Langue',
      theme: 'Thème',
      currency: 'Devise',
      business: 'Entreprise',
      pumps: 'Pompes et carburant',
      taxRate: 'Taux de taxe',
      zakatRate: 'Taux de Zakat',
      backupFrequency: 'Fréquence de sauvegarde',
      dataManagement: 'Gestion des données',
      exportData: 'Exporter les données',
      importData: 'Importer les données',
      resetData: 'Réinitialiser les données',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',
      arabic: 'Arabe',
      french: 'Français',
      light: 'Clair',
      dark: 'Sombre',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      pumpName: 'Nom de la pompe',
      fuelType: 'Type de carburant',
      buyPrice: 'Prix d\'achat',
      sellPrice: 'Prix de vente',
      profit: 'Bénéfice',
      fuelTypes: 'Types de carburant',
      addPump: 'Ajouter une pompe',
      editPump: 'Modifier la pompe',
      addFuelType: 'Ajouter un type de carburant',
      editFuelType: 'Modifier le type de carburant',
      fuelTypeName: 'Nom du type de carburant',
      color: 'Couleur',
      pumpSettings: 'Paramètres des pompes',
      fuelTypeSettings: 'Paramètres des types de carburant',
      exportDescription: 'Exporter toutes les données du système vers un fichier JSON',
      importDescription: 'Importer des données depuis un fichier JSON sauvegardé',
      resetDescription: 'Supprimer toutes les données et remettre le système à zéro',
      confirmReset: 'Êtes-vous sûr de vouloir supprimer toutes les données ?',
      selectFile: 'Sélectionner un fichier',
      noFileSelected: 'Aucun fichier sélectionné',
      resetWarning: 'Attention : Cette action est irréversible !',
      settingsSaved: 'Paramètres sauvegardés',
      dataExported: 'Données exportées',
      dataImported: 'Données importées',
      dataReset: 'Données réinitialisées',
      percent: '%',
      tankManagement: 'Gestion des réservoirs',
      addTank: 'Ajouter un réservoir',
      settings: 'Paramètres',
      manageSystemSettings: 'Gestion des paramètres du système',
      pumpManagement: 'Gestion des pompes',
    },
  };

  const t = texts[language];

  const handleSaveSettings = () => {
    updateSettings(tempSettings);
    if (onLanguageChange && tempSettings.language !== settings.language) {
      onLanguageChange(tempSettings.language);
    }
    if (onThemeChange && tempSettings.theme !== settings.theme) {
      onThemeChange(tempSettings.theme);
    }
  };

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gas-station-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    if (importFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          importData(data);
          setImportFile(null);
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      };
      reader.readAsText(importFile);
    }
  };

  const handleResetData = () => {
    if (window.confirm(t.confirmReset)) {
      resetData();
    }
  };

  const handleSavePump = (pumpData: any) => {
    if (editingPump?.id) {
      updatePump(editingPump.id, pumpData);
    } else {
      addPump({
        ...pumpData,
        id: `pump-${Date.now()}`,
        number: pumps.length + 1,
        previousReading: 0,
        currentReading: 0,
        isActive: true,
      });
    }
    setEditingPump(null);
    setShowAddPumpDialog(false);
    setShowEditPumpDialog(false);
  };

  const handleDeletePump = (pumpId: string) => {
    const pump = pumps.find(p => p.id === pumpId);
    if (window.confirm(`هل أنت متأكد من حذف "${pump?.name}"؟\n\nسيتم حذف جميع البيانات المرتبطة بهذه المضخة.`)) {
      deletePump(pumpId);
    }
  };

  const handleSaveFuelType = (fuelTypeData: any) => {
    if (editingFuelType?.id) {
      updateFuelType(editingFuelType.id, {
        name: { ar: fuelTypeData.name, fr: fuelTypeData.name },
        color: fuelTypeData.color,
        pricePerLiter: fuelTypeData.pricePerLiter || 0,
      });
    } else {
      addFuelType({
        id: `fuel-${Date.now()}`,
        name: { ar: fuelTypeData.name, fr: fuelTypeData.name },
        pricePerLiter: fuelTypeData.pricePerLiter || 0,
        color: fuelTypeData.color,
      });
    }
    setEditingFuelType(null);
    setShowAddFuelTypeDialog(false);
    setShowEditFuelTypeDialog(false);
  };

  const handleDeleteFuelType = (fuelTypeId: string) => {
    // تحقق من أن نوع الوقود غير مستخدم في أي مضخة
    const isUsed = pumps.some(pump => pump.fuelType === fuelTypeId);
    const usedInPumps = pumps.filter(pump => pump.fuelType === fuelTypeId);
    
    if (isUsed) {
      const pumpNames = usedInPumps.map(pump => pump.name).join('، ');
      alert(`لا يمكن حذف نوع الوقود هذا لأنه مستخدم في المضخات التالية: ${pumpNames}`);
      return;
    }
    
    if (window.confirm(`هل أنت متأكد من حذف نوع الوقود "${fuelTypes.find(ft => ft.id === fuelTypeId)?.name[language]}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      deleteFuelType(fuelTypeId);
    }
  };

  const handleSaveTank = (tankData: any) => {
    if (editingTank?.id) {
      updateTank(editingTank.id, tankData);
    } else {
      addTank({
        ...tankData,
        id: `tank-${Date.now()}`,
        currentLevel: tankData.currentLevel || 0,
        lastRefill: new Date(),
      });
    }
    setEditingTank(null);
    setShowAddTankDialog(false);
    setShowEditTankDialog(false);
  };

  const handleDeleteTank = (tankId: string) => {
    // تحقق من أن الخزان غير مستخدم في أي مضخة
    const isUsed = pumps.some(pump => pump.tankId === tankId);
    const usedInPumps = pumps.filter(pump => pump.tankId === tankId);
    
    if (isUsed) {
      const pumpNames = usedInPumps.map(pump => pump.name).join('، ');
      alert(`لا يمكن حذف الخزان هذا لأنه مستخدم في المضخات التالية: ${pumpNames}`);
      return;
    }
    
    const tank = tanks.find(t => t.id === tankId);
    if (window.confirm(`هل أنت متأكد من حذف الخزان "${tank?.name}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`)) {
      deleteTank(tankId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 rtl">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.settings}</h1>
          <p className="text-muted-foreground">{t.manageSystemSettings}</p>
        </div>

        <Tabs defaultValue="pumps" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pumps">{t.pumps}</TabsTrigger>
            <TabsTrigger value="tanks">الخزانات</TabsTrigger>
            <TabsTrigger value="fuel-types">{t.fuelTypes}</TabsTrigger>
            <TabsTrigger value="general">{t.general}</TabsTrigger>
          </TabsList>

          {/* قسم المضخات */}
          <TabsContent value="pumps" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{t.pumpManagement}</h2>
              <Dialog open={showAddPumpDialog} onOpenChange={setShowAddPumpDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingPump(null);
                    setShowAddPumpDialog(true);
                  }}>
                    <Plus className="h-4 w-4 ml-2" />
                    {t.addPump}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t.addPump}</DialogTitle>
                  </DialogHeader>
                  <PumpForm
                    pump={null}
                    fuelTypes={fuelTypes}
                    onSave={handleSavePump}
                    onCancel={() => setShowAddPumpDialog(false)}
                    texts={t}
                    language={language}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* عرض المضخات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pumps.map((pump) => {
                const fuelType = fuelTypes.find(ft => ft.id === pump.fuelType);
                const tank = tanks.find(t => t.id === pump.tankId);
                const profitPerLiter = (pump.sellPrice || 0) - (pump.buyPrice || 0);
                const profitMargin = pump.buyPrice > 0 ? (profitPerLiter / pump.buyPrice * 100) : 0;
                
                return (
                  <Card key={pump.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: fuelType?.color || '#gray' }}
                          />
                          <h3 className="font-bold text-lg">{pump.name}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Dialog open={showEditPumpDialog && editingPump?.id === pump.id} onOpenChange={(open) => {
                            setShowEditPumpDialog(open);
                            if (!open) setEditingPump(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingPump(pump);
                                  setShowEditPumpDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{t.editPump}</DialogTitle>
                              </DialogHeader>
                              <PumpForm
                                pump={pump}
                                fuelTypes={fuelTypes}
                                onSave={handleSavePump}
                                onCancel={() => {
                                  setShowEditPumpDialog(false);
                                  setEditingPump(null);
                                }}
                                texts={t}
                                language={language}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeletePump(pump.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{t.fuelType}</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: fuelType?.color }}
                            />
                            <span className="font-medium">{fuelType?.name[language] || 'غير محدد'}</span>
                          </div>
                        </div>
                        
                        {/* معلومات الخزان */}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">الخزان</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{tank?.name || 'غير محدد'}</span>
                            {tank && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                tank.currentLevel <= tank.minLevel 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {((tank.currentLevel / tank.capacity) * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{t.buyPrice}</span>
                          <span className="font-mono text-red-600">{(pump.buyPrice || 0).toFixed(2)} دج/لتر</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{t.sellPrice}</span>
                          <span className="font-mono text-green-600">{(pump.sellPrice || 0).toFixed(2)} دج/لتر</span>
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-sm font-medium">{t.profit}/لتر</span>
                          <span className="font-bold text-green-600">
                            {profitPerLiter.toFixed(2)} دج
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>هامش الربح:</span>
                          <span className={profitMargin > 0 ? "text-green-600" : "text-red-600"}>
                            {profitMargin.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* حالة المضخة */}
                      <div className="mt-3 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">الحالة:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pump.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {pump.isActive ? 'مُشغّلة' : 'مُتوقفة'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* قسم الخزانات */}
          <TabsContent value="tanks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">إدارة الخزانات</h2>
              <Dialog open={showAddTankDialog} onOpenChange={setShowAddTankDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingTank(null);
                    setShowAddTankDialog(true);
                  }}>
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة خزان
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>إضافة خزان جديد</DialogTitle>
                  </DialogHeader>
                  <TankForm
                    tank={null}
                    fuelTypes={fuelTypes}
                    onSave={handleSaveTank}
                    onCancel={() => setShowAddTankDialog(false)}
                    language={language}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* عرض الخزانات */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tanks.map((tank) => {
                const fuelType = fuelTypes.find(ft => ft.id === tank.fuelType);
                const usedInPumps = pumps.filter(pump => pump.tankId === tank.id);
                const canDelete = usedInPumps.length === 0;
                const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
                const isLowLevel = tank.currentLevel <= tank.minLevel;
                
                return (
                  <Card key={tank.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: fuelType?.color || '#gray' }}
                          />
                          <h3 className="font-bold text-lg">{tank.name}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Dialog open={showEditTankDialog && editingTank?.id === tank.id} onOpenChange={(open) => {
                            setShowEditTankDialog(open);
                            if (!open) setEditingTank(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingTank(tank);
                                  setShowEditTankDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>تعديل الخزان</DialogTitle>
                              </DialogHeader>
                              <TankForm
                                tank={tank}
                                fuelTypes={fuelTypes}
                                onSave={handleSaveTank}
                                onCancel={() => {
                                  setShowEditTankDialog(false);
                                  setEditingTank(null);
                                }}
                                language={language}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTank(tank.id)}
                            disabled={!canDelete}
                            className={!canDelete ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* نوع الوقود */}
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">نوع الوقود</span>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: fuelType?.color }}
                            />
                            <span className="font-medium">{fuelType?.name[language] || 'غير محدد'}</span>
                          </div>
                        </div>

                        {/* مستوى الخزان */}
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">المستوى الحالي</span>
                            <span className={`font-mono ${isLowLevel ? 'text-red-600' : 'text-green-600'}`}>
                              {tank.currentLevel.toLocaleString()} / {tank.capacity.toLocaleString()} لتر
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all ${
                                isLowLevel 
                                  ? 'bg-red-500' 
                                  : fillPercentage <= 30
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs">
                            <span className={isLowLevel ? 'text-red-600' : 'text-muted-foreground'}>
                              {fillPercentage.toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground">
                              الحد الأدنى: {tank.minLevel.toLocaleString()} لتر
                            </span>
                          </div>
                        </div>

                        {/* تحذير المستوى المنخفض */}
                        {isLowLevel && (
                          <div className="bg-red-50 border border-red-200 rounded p-2">
                            <p className="text-red-800 text-xs font-medium">
                              ⚠️ تحذير: مستوى الخزان منخفض!
                            </p>
                          </div>
                        )}

                        {/* معلومات الاستخدام */}
                        <div className="mt-2 text-xs text-muted-foreground">
                          {usedInPumps.length > 0 ? (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                              <p className="font-medium text-blue-800">مستخدم في:</p>
                              <p className="text-blue-700">
                                {usedInPumps.map(pump => pump.name).join('، ')}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded p-2">
                              <p className="text-gray-700">غير مستخدم في أي مضخة</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* قسم أنواع الوقود المحسن */}
          <TabsContent value="fuel-types" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{t.fuelTypeSettings}</h2>
              <Dialog open={showAddFuelTypeDialog} onOpenChange={setShowAddFuelTypeDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setEditingFuelType(null);
                    setShowAddFuelTypeDialog(true);
                  }}>
                    <Plus className="h-4 w-4 ml-2" />
                    {t.addFuelType}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t.addFuelType}</DialogTitle>
                  </DialogHeader>
                  <FuelTypeForm
                    fuelType={null}
                    onSave={handleSaveFuelType}
                    onCancel={() => setShowAddFuelTypeDialog(false)}
                    texts={t}
                    language={language}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* عرض أنواع الوقود */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fuelTypes.map((fuelType) => {
                const usedInPumps = pumps.filter(pump => pump.fuelType === fuelType.id);
                const usedInTanks = tanks.filter(tank => tank.fuelType === fuelType.id);
                const canDelete = usedInPumps.length === 0 && usedInTanks.length === 0;
                
                return (
                  <Card key={fuelType.id} className="bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                            style={{ backgroundColor: fuelType.color }}
                          />
                          <h3 className="font-bold text-lg">{fuelType.name[language]}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Dialog open={showEditFuelTypeDialog && editingFuelType?.id === fuelType.id} onOpenChange={(open) => {
                            setShowEditFuelTypeDialog(open);
                            if (!open) setEditingFuelType(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setEditingFuelType(fuelType);
                                  setShowEditFuelTypeDialog(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{t.editFuelType}</DialogTitle>
                              </DialogHeader>
                              <FuelTypeForm
                                fuelType={fuelType}
                                onSave={handleSaveFuelType}
                                onCancel={() => {
                                  setShowEditFuelTypeDialog(false);
                                  setEditingFuelType(null);
                                }}
                                texts={t}
                                language={language}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteFuelType(fuelType.id)}
                            disabled={!canDelete}
                            className={!canDelete ? "opacity-50 cursor-not-allowed" : ""}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* معلومات السعر */}
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">السعر لكل لتر</span>
                          <span className="font-mono text-lg font-bold text-green-600">
                            {(fuelType.pricePerLiter || 0).toFixed(2)} دج
                          </span>
                        </div>

                        {/* معلومات الاستخدام */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">المضخات المستخدمة:</span>
                            <span className="font-medium">{usedInPumps.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">الخزانات المستخدمة:</span>
                            <span className="font-medium">{usedInTanks.length}</span>
                          </div>
                        </div>

                        {/* تفاصيل الاستخدام */}
                        {(usedInPumps.length > 0 || usedInTanks.length > 0) && (
                          <div className="mt-3 text-xs">
                            {usedInPumps.length > 0 && (
                              <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2">
                                <p className="font-medium text-blue-800 mb-1">المضخات:</p>
                                <p className="text-blue-700">
                                  {usedInPumps.map(pump => pump.name).join('، ')}
                                </p>
                              </div>
                            )}
                            {usedInTanks.length > 0 && (
                              <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="font-medium text-green-800 mb-1">الخزانات:</p>
                                <p className="text-green-700">
                                  {usedInTanks.map(tank => tank.name).join('، ')}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* تحذير عدم إمكانية الحذف */}
                        {!canDelete && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                            <p className="text-yellow-800 text-xs font-medium">
                              ⚠️ لا يمكن حذف هذا النوع لأنه مستخدم في المضخات أو الخزانات
                            </p>
                          </div>
                        )}

                        {/* حالة غير مستخدم */}
                        {canDelete && (
                          <div className="bg-gray-50 border border-gray-200 rounded p-2">
                            <p className="text-gray-700 text-xs">
                              غير مستخدم - يمكن حذفه بأمان
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* رسالة عدم وجود أنواع وقود */}
            {fuelTypes.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Fuel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium text-muted-foreground">لا توجد أنواع وقود</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    قم بإضافة أنواع الوقود المختلفة التي تتعامل بها محطتك
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      setEditingFuelType(null);
                      setShowAddFuelTypeDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    إضافة نوع وقود جديد
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* إحصائيات أنواع الوقود */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">إجمالي أنواع الوقود</p>
                      <p className="text-2xl font-bold">{fuelTypes.length}</p>
                    </div>
                    <Fuel className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">أنواع مستخدمة</p>
                      <p className="text-2xl font-bold text-green-600">
                        {fuelTypes.filter(ft => 
                          pumps.some(p => p.fuelType === ft.id) || 
                          tanks.some(t => t.fuelType === ft.id)
                        ).length}
                      </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="h-4 w-4 rounded-full bg-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">متوسط السعر</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {fuelTypes.length > 0 
                          ? (fuelTypes.reduce((sum, ft) => sum + (ft.pricePerLiter || 0), 0) / fuelTypes.length).toFixed(2)
                          : '0.00'
                        } دج
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t.language}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.language}</Label>
                    <Select
                      value={tempSettings.language}
                      onValueChange={(value: 'ar' | 'fr') => 
                        setTempSettings(prev => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">{t.arabic}</SelectItem>
                        <SelectItem value="fr">{t.french}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {tempSettings.theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    {t.theme}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>{t.theme}</Label>
                    <Select
                      value={tempSettings.theme}
                      onValueChange={(value: 'light' | 'dark') => 
                        setTempSettings(prev => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t.light}</SelectItem>
                        <SelectItem value="dark">{t.dark}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.currency}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>{t.currency}</Label>
                    <Input
                      value={tempSettings.currency}
                      onChange={(e) => setTempSettings(prev => ({ ...prev, currency: e.target.value }))}
                      placeholder="دج"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t.backupFrequency}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label>{t.backupFrequency}</Label>
                    <Select
                      value={tempSettings.backupFrequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                        setTempSettings(prev => ({ ...prev, backupFrequency: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">{t.daily}</SelectItem>
                        <SelectItem value="weekly">{t.weekly}</SelectItem>
                        <SelectItem value="monthly">{t.monthly}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// مكون نموذج المضخة
const PumpForm = ({ pump, fuelTypes, onSave, onCancel, texts, language }: any) => {
  const { tanks } = useGasStationStore();
  
  const [formData, setFormData] = useState({
    name: pump?.name || '',
    fuelType: pump?.fuelType || '',
    tankId: pump?.tankId || '',
    buyPrice: pump?.buyPrice || 0,
    sellPrice: pump?.sellPrice || 0,
    isActive: pump?.isActive !== undefined ? pump.isActive : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedFuelType = fuelTypes.find((ft: any) => ft.id === formData.fuelType);
  const selectedTank = tanks.find((tank: any) => tank.id === formData.tankId);
  const availableTanks = tanks.filter((tank: any) => 
    tank.fuelType === formData.fuelType && tank.isActive
  );
  
  const profitPerLiter = formData.sellPrice - formData.buyPrice;
  const profitMargin = formData.buyPrice > 0 ? (profitPerLiter / formData.buyPrice * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>{texts.pumpName}</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="مضخة البنزين الممتاز"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          اختر اسماً وصفياً للمضخة (مثل: مضخة البنزين الممتاز، مضخة الديزل الأولى)
        </p>
      </div>
      
      <div>
        <Label>{texts.fuelType}</Label>
        <Select
          value={formData.fuelType}
          onValueChange={(value) => setFormData(prev => ({ 
            ...prev, 
            fuelType: value,
            tankId: '' // إعادة تعيين الخزان عند تغيير نوع الوقود
          }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الوقود" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((type: any) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name[language]}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* اختيار الخزان */}
      <div>
        <Label>الخزان المرتبط</Label>
        <Select
          value={formData.tankId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, tankId: value }))}
          disabled={!formData.fuelType}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              !formData.fuelType 
                ? "اختر نوع الوقود أولاً" 
                : availableTanks.length === 0 
                  ? "لا توجد خزانات متاحة"
                  : "اختر الخزان"
            } />
          </SelectTrigger>
          <SelectContent>
            {availableTanks.map((tank: any) => {
              const fillPercentage = (tank.currentLevel / tank.capacity) * 100;
              const isLowLevel = tank.currentLevel <= tank.minLevel;
              
              return (
                <SelectItem key={tank.id} value={tank.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedFuelType?.color }}
                      />
                      <span>{tank.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={isLowLevel ? "text-red-600" : "text-green-600"}>
                        {fillPercentage.toFixed(0)}%
                      </span>
                      {isLowLevel && <span className="text-red-600">⚠️</span>}
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        
        {selectedTank && (
          <div className="mt-2 p-3 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>المستوى الحالي:</span>
              <span className="font-mono">{selectedTank.currentLevel.toLocaleString()} لتر</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>السعة الكاملة:</span>
              <span className="font-mono">{selectedTank.capacity.toLocaleString()} لتر</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  selectedTank.currentLevel <= selectedTank.minLevel 
                    ? 'bg-red-500' 
                    : selectedTank.currentLevel <= selectedTank.capacity * 0.3
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                }`}
                style={{ 
                  width: `${Math.min((selectedTank.currentLevel / selectedTank.capacity) * 100, 100)}%` 
                }}
              />
            </div>
            {selectedTank.currentLevel <= selectedTank.minLevel && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ تحذير: مستوى الخزان منخفض! يحتاج إلى إعادة تعبئة
              </p>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          سيتم ربط المضخة بالخزان المحدد وتقليل مستواه تلقائياً مع كل عملية بيع
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{texts.buyPrice} (دج/لتر)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.buyPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, buyPrice: parseFloat(e.target.value) || 0 }))}
            placeholder="45.50"
            required
          />
        </div>
        
        <div>
          <Label>{texts.sellPrice} (دج/لتر)</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.sellPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, sellPrice: parseFloat(e.target.value) || 0 }))}
            placeholder="48.00"
            required
          />
        </div>
      </div>

      {/* حالة المضخة */}
      <div className="flex items-center justify-between">
        <div>
          <Label>حالة المضخة</Label>
          <p className="text-xs text-muted-foreground">
            المضخات غير النشطة لن تظهر في إدارة الوقود
          </p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
      </div>

      {/* معاينة الأرباح */}
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium">{texts.profit} لكل لتر:</span>
          <span className={`font-bold ${profitPerLiter >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {profitPerLiter.toFixed(2)} دج
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>هامش الربح:</span>
          <span className={profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
            {profitMargin.toFixed(1)}%
          </span>
        </div>
        {profitPerLiter < 0 && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ تحذير: سعر البيع أقل من سعر الشراء - ستحقق خسارة!
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!formData.tankId}>
          {texts.save}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {texts.cancel}
        </Button>
      </div>
    </form>
  );
};

// مكون نموذج نوع الوقود المحسن
const FuelTypeForm = ({ fuelType, onSave, onCancel, texts, language }: any) => {
  const [formData, setFormData] = useState({
    name: fuelType?.name?.[language] || fuelType?.name || '',
    color: fuelType?.color || '#22c55e',
    pricePerLiter: fuelType?.pricePerLiter || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const predefinedColors = [
    { name: 'أخضر', value: '#22c55e' },
    { name: 'أزرق', value: '#3b82f6' },
    { name: 'أحمر', value: '#ef4444' },
    { name: 'أصفر', value: '#eab308' },
    { name: 'بنفسجي', value: '#a855f7' },
    { name: 'برتقالي', value: '#f97316' },
    { name: 'وردي', value: '#ec4899' },
    { name: 'رمادي', value: '#6b7280' },
  ];

  const commonFuelTypes = [
    { name: 'بنزين عادي', color: '#22c55e', price: 45.5 },
    { name: 'بنزين ممتاز', color: '#3b82f6', price: 48.0 },
    { name: 'ديزل', color: '#eab308', price: 32.0 },
    { name: 'غاز طبيعي', color: '#a855f7', price: 25.0 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* اختيار سريع لأنواع الوقود الشائعة */}
      {!fuelType && (
        <div>
          <Label>أنواع الوقود الشائعة</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {commonFuelTypes.map((fuel) => (
              <button
                key={fuel.name}
                type="button"
                onClick={() => setFormData({
                  name: fuel.name,
                  color: fuel.color,
                  pricePerLiter: fuel.price,
                })}
                className="flex items-center gap-2 p-3 rounded border hover:border-primary hover:bg-primary/5 transition-colors text-right"
              >
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: fuel.color }}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{fuel.name}</p>
                  <p className="text-xs text-muted-foreground">{fuel.price} دج/لتر</p>
                </div>
              </button>
            ))}
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">أو أدخل بيانات مخصصة</span>
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>{texts.fuelTypeName}</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="بنزين عادي، بنزين ممتاز، ديزل، غاز..."
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          أدخل اسم نوع الوقود (مثل: بنزين عادي، بنزين ممتاز، ديزل، غاز طبيعي)
        </p>
      </div>

      <div>
        <Label>السعر لكل لتر (دج)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={formData.pricePerLiter}
          onChange={(e) => setFormData(prev => ({ ...prev, pricePerLiter: parseFloat(e.target.value) || 0 }))}
          placeholder="45.50"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          السعر الحالي لكل لتر من هذا النوع من الوقود
        </p>
      </div>
      
      <div>
        <Label>{texts.color}</Label>
        <div className="space-y-3">
          {/* اختيار الألوان المحددة مسبقاً */}
          <div className="grid grid-cols-4 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                className={`flex items-center gap-2 p-2 rounded border text-xs transition-colors ${
                  formData.color === color.value 
                    ? 'border-primary bg-primary/10' 
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border" 
                  style={{ backgroundColor: color.value }}
                />
                {color.name}
              </button>
            ))}
          </div>
          
          {/* اختيار لون مخصص */}
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <Input
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              placeholder="#22c55e"
              className="font-mono"
            />
          </div>
        </div>
        
        {/* معاينة اللون */}
        <div className="mt-3 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">معاينة:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: formData.color }}
              />
              <span className="font-medium">{formData.name || 'نوع الوقود'}</span>
            </div>
            <span className="font-mono text-lg font-bold text-green-600">
              {formData.pricePerLiter.toFixed(2)} دج/لتر
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit">{texts.save}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {texts.cancel}
        </Button>
      </div>
    </form>
  );
};

// مكون نموذج الخزان
const TankForm = ({ tank, fuelTypes, onSave, onCancel, language }: any) => {
  const [formData, setFormData] = useState({
    name: tank?.name || '',
    fuelType: tank?.fuelType || '',
    capacity: tank?.capacity || 10000,
    currentLevel: tank?.currentLevel || 0,
    minLevel: tank?.minLevel || 1000,
    isActive: tank?.isActive !== undefined ? tank.isActive : true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const selectedFuelType = fuelTypes.find((ft: any) => ft.id === formData.fuelType);
  const fillPercentage = formData.capacity > 0 ? (formData.currentLevel / formData.capacity) * 100 : 0;
  const isLowLevel = formData.currentLevel <= formData.minLevel;
  const isOverCapacity = formData.currentLevel > formData.capacity;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>اسم الخزان</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="خزان البنزين الرئيسي"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          اختر اسماً وصفياً للخزان (مثل: خزان البنزين الرئيسي، خزان الديزل الاحتياطي)
        </p>
      </div>
      
      <div>
        <Label>نوع الوقود</Label>
        <Select
          value={formData.fuelType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الوقود" />
          </SelectTrigger>
          <SelectContent>
            {fuelTypes.map((type: any) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: type.color }}
                  />
                  {type.name[language]}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>السعة الكاملة (لتر)</Label>
          <Input
            type="number"
            min="1000"
            max="50000"
            step="100"
            value={formData.capacity}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              capacity: parseInt(e.target.value) || 0 
            }))}
            placeholder="10000"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            السعة القصوى للخزان باللتر
          </p>
        </div>
        
        <div>
          <Label>المستوى الحالي (لتر)</Label>
          <Input
            type="number"
            min="0"
            max={formData.capacity}
            step="10"
            value={formData.currentLevel}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              currentLevel: parseInt(e.target.value) || 0 
            }))}
            placeholder="7500"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            الكمية الحالية في الخزان
          </p>
        </div>
      </div>

      <div>
        <Label>الحد الأدنى للتنبيه (لتر)</Label>
        <Input
          type="number"
          min="0"
          max={formData.capacity * 0.5}
          step="50"
          value={formData.minLevel}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            minLevel: parseInt(e.target.value) || 0 
          }))}
          placeholder="1000"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          عند الوصول لهذا المستوى سيظهر تحذير لإعادة التعبئة
        </p>
      </div>

      {/* حالة الخزان */}
      <div className="flex items-center justify-between">
        <div>
          <Label>حالة الخزان</Label>
          <p className="text-xs text-muted-foreground">
            الخزانات غير النشطة لن تظهر في قوائم اختيار المضخات
          </p>
        </div>
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
      </div>

      {/* معاينة الخزان */}
      <div className="bg-muted p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: selectedFuelType?.color || '#gray' }}
          />
          <span className="font-medium">{formData.name || 'الخزان الجديد'}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>المستوى الحالي:</span>
            <span className="font-mono">{formData.currentLevel.toLocaleString()} لتر</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>السعة الكاملة:</span>
            <span className="font-mono">{formData.capacity.toLocaleString()} لتر</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                isOverCapacity
                  ? 'bg-red-500'
                  : isLowLevel 
                    ? 'bg-red-500' 
                    : fillPercentage <= 30
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(fillPercentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className={
              isOverCapacity ? 'text-red-600' :
              isLowLevel ? 'text-red-600' : 'text-muted-foreground'
            }>
              {fillPercentage.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">
              الحد الأدنى: {((formData.minLevel / formData.capacity) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* تحذيرات */}
        {isOverCapacity && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
            ⚠️ تحذير: المستوى الحالي أكبر من السعة الكاملة!
          </p>
        )}
        {isLowLevel && !isOverCapacity && (
          <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            ⚠️ تنبيه: المستوى الحالي أقل من الحد الأدنى
          </p>
        )}
        {fillPercentage > 90 && !isOverCapacity && (
          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            ℹ️ الخزان ممتلئ تقريباً ({fillPercentage.toFixed(1)}%)
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isOverCapacity}>
          حفظ
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
      </div>
    </form>
  );
};

export default AppSettings;