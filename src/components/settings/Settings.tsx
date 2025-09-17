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
import { Settings as SettingsIcon, Download, Upload, RotateCcw, Save, Globe, Moon, Sun, Database } from 'lucide-react';

interface SettingsProps {
  language?: 'ar' | 'fr';
  onLanguageChange?: (language: 'ar' | 'fr') => void;
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  language = 'ar', 
  onLanguageChange,
  onThemeChange 
}) => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetData,
  } = useGasStationStore();

  const [tempSettings, setTempSettings] = useState(settings);
  const [importFile, setImportFile] = useState<File | null>(null);

  const isRTL = language === 'ar';

  const texts = {
    ar: {
      title: 'الإعدادات',
      general: 'عام',
      language: 'اللغة',
      theme: 'السمة',
      currency: 'العملة',
      business: 'الأعمال',
      taxRate: 'معدل الضريبة',
      zakatRate: 'معدل الزكاة',
      backupFrequency: 'تكرار النسخ الاحتياطي',
      dataManagement: 'إدارة البيانات',
      exportData: 'تصدير البيانات',
      importData: 'استيراد البيانات',
      resetData: 'إعادة تعيين البيانات',
      save: 'حفظ',
      cancel: 'إلغاء',
      arabic: 'العربية',
      french: 'الفرنسية',
      light: 'فاتح',
      dark: 'داكن',
      daily: 'يومي',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      exportDescription: 'تصدير جميع بيانات النظام إلى ملف JSON',
      importDescription: 'استيراد البيانات من ملف JSON محفوظ مسبقاً',
      resetDescription: 'حذف جميع البيانات وإعادة النظام إلى حالته الأولى',
      confirmReset: 'هل أنت متأكد من رغبتك في حذف جميع البيانات؟',
      selectFile: 'اختر ملف',
      noFileSelected: 'لم يتم اختيار ملف',
      resetWarning: 'تحذير: هذا الإجراء لا يمكن التراجع عنه!',
      settingsSaved: 'تم حفظ الإعدادات',
      dataExported: 'تم تصدير البيانات',
      dataImported: 'تم استيراد البيانات',
      dataReset: 'تم إعادة تعيين البيانات',
      percent: '%',
    },
    fr: {
      title: 'Paramètres',
      general: 'Général',
      language: 'Langue',
      theme: 'Thème',
      currency: 'Devise',
      business: 'Entreprise',
      taxRate: 'Taux de taxe',
      zakatRate: 'Taux de Zakat',
      backupFrequency: 'Fréquence de sauvegarde',
      dataManagement: 'Gestion des données',
      exportData: 'Exporter les données',
      importData: 'Importer les données',
      resetData: 'Réinitialiser les données',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      arabic: 'Arabe',
      french: 'Français',
      light: 'Clair',
      dark: 'Sombre',
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
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

  return (
    <div className="space-y-6 bg-background p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          {t.title}
        </h1>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {t.save}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">{t.general}</TabsTrigger>
          <TabsTrigger value="business">{t.business}</TabsTrigger>
          <TabsTrigger value="data">{t.dataManagement}</TabsTrigger>
        </TabsList>

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
                    placeholder="SAR"
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

        <TabsContent value="business" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.taxRate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>{t.taxRate} ({t.percent})</Label>
                  <Input
                    type="number"
                    value={tempSettings.taxRate}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    المعدل الحالي: {tempSettings.taxRate}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.zakatRate}</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label>{t.zakatRate} ({t.percent})</Label>
                  <Input
                    type="number"
                    value={tempSettings.zakatRate}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, zakatRate: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    المعدل الحالي: {tempSettings.zakatRate}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>معاينة الحسابات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">مثال: إيراد 10,000 SAR</p>
                    <p className="font-bold">ضريبة: {(10000 * tempSettings.taxRate / 100).toFixed(2)} SAR</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">مثال: إيراد 10,000 SAR</p>
                    <p className="font-bold">زكاة: {(10000 * tempSettings.zakatRate / 100).toFixed(2)} SAR</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">المجموع</p>
                    <p className="font-bold">
                      {((10000 * tempSettings.taxRate / 100) + (10000 * tempSettings.zakatRate / 100)).toFixed(2)} SAR
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t.exportData}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t.exportDescription}
                </p>
                <Button onClick={handleExportData} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t.exportData}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {t.importData}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t.importDescription}
                </p>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="import-file"
                  />
                  <Label htmlFor="import-file" className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm">
                        {importFile ? importFile.name : t.selectFile}
                      </p>
                    </div>
                  </Label>
                </div>
                <Button 
                  onClick={handleImportData} 
                  disabled={!importFile}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t.importData}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  {t.resetData}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t.resetDescription}
                </p>
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive font-medium">
                    {t.resetWarning}
                  </p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t.resetData}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t.confirmReset}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        سيتم حذف جميع البيانات التالية:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>قراءات المضخات اليومية</li>
                        <li>بيانات العملاء والديون</li>
                        <li>سجلات العمال والرواتب</li>
                        <li>مبيعات المتجر</li>
                        <li>سجلات الضرائب والزكاة</li>
                      </ul>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleResetData}>
                          نعم، احذف جميع البيانات
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;