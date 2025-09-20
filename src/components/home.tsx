import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { 
  Languages,
  LogOut,
  Bell,
  Search,
  User,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Download,
  Upload,
  HelpCircle,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  Calendar,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { useGasStationStore } from '@/store/gasStationStore';

// Import components
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import TankLevelDisplay from '@/components/dashboard/TankLevelDisplay';
import SalesTrendsChart from '@/components/dashboard/SalesTrendsChart';
import FuelManagement from '@/components/fuel/FuelManagement';
import StoreManagement from '@/components/store/StoreManagement';
import CreditManagement from '@/components/credits/CreditManagement';
import WorkerManagement from '@/components/workers/WorkerManagement';
import TaxManagement from '@/components/taxes/TaxManagement';
import Reports from '@/components/reports/Reports';
import Settings from '@/components/settings/Settings';
import Sidebar from '@/components/layout/Sidebar';
import TankManagement from '@/components/fuel/TankManagement';
import PumpManagement from '@/components/fuel/PumpManagement';

interface HomeProps {
  language?: 'ar' | 'fr';
}

export default function Home({ language = 'ar' }: HomeProps) {
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'fr'>(language);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح', time: 'منذ 5 دقائق', read: false },
    { id: 2, type: 'warning', title: 'مستوى الخزان منخفض', message: 'خزان الديزل أقل من 30%', time: 'منذ 15 دقيقة', read: false },
    { id: 3, type: 'success', title: 'نسخة احتياطية', message: 'تم إنشاء النسخة الاحتياطية', time: 'منذ ساعة', read: true }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({ cpu: 45, memory: 62, storage: 78 });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const isRTL = currentLanguage === 'ar';
  const unreadCount = notifications.filter(n => !n.read).length;

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'ar' ? 'fr' : 'ar');
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    
    // Add refresh notification
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      title: 'تحديث البيانات',
      message: 'تم تحديث جميع البيانات بنجاح',
      time: 'الآن',
      read: false
    }, ...prev]);
  };

  const handleBackup = () => {
    const { exportData } = useGasStationStore.getState();
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-station-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setNotifications(prev => [{
      id: Date.now(),
      type: 'success',
      title: 'نسخة احتياطية',
      message: 'تم إنشاء النسخة الاحتياطية بنجاح',
      time: 'الآن',
      read: false
    }, ...prev]);
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            const { importData } = useGasStationStore.getState();
            importData(data);
            
            setNotifications(prev => [{
              id: Date.now(),
              type: 'success',
              title: 'استعادة البيانات',
              message: 'تم استعادة البيانات بنجاح',
              time: 'الآن',
              read: false
            }, ...prev]);
          } catch (error) {
            setNotifications(prev => [{
              id: Date.now(),
              type: 'warning',
              title: 'خطأ في الاستعادة',
              message: 'فشل في استعادة البيانات',
              time: 'الآن',
              read: false
            }, ...prev]);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    if (confirm(currentT.confirmLogout)) {
      window.location.reload();
    }
  };

  const t = {
    ar: {
      search: 'البحث في النظام...',
      notifications: 'الإشعارات',
      logout: 'تسجيل الخروج',
      welcome: 'مرحباً بك في نظام إدارة محطة الوقود',
      lastUpdate: 'آخر تحديث: منذ دقيقتين',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      backup: 'نسخ احتياطي',
      restore: 'استعادة',
      help: 'المساعدة',
      darkMode: 'الوضع المظلم',
      lightMode: 'الوضع المضيء',
      admin: 'مدير النظام',
      noNotifications: 'لا توجد إشعارات',
      clearAll: 'مسح الكل',
      markAsRead: 'تم القراءة',
      confirmLogout: 'هل أنت متأكد من تسجيل الخروج؟',
      helpTitle: 'مركز المساعدة',
      helpContent: 'مرحباً بك في مركز المساعدة. يمكنك العثور على جميع المعلومات التي تحتاجها هنا.',
      profileTitle: 'الملف الشخصي',
      editProfile: 'تعديل الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      accountSettings: 'إعدادات الحساب',
      fullscreen: 'ملء الشاشة',
      exitFullscreen: 'إنهاء ملء الشاشة',
      refresh: 'تحديث البيانات',
      online: 'متصل',
      offline: 'غير متصل',
      systemStatus: 'حالة النظام',
      performance: 'الأداء'
    },
    fr: {
      search: 'Rechercher dans le système...',
      notifications: 'Notifications',
      logout: 'Déconnexion',
      welcome: 'Bienvenue dans le système de gestion de station-service',
      lastUpdate: 'Dernière mise à jour: il y a 2 minutes',
      profile: 'Profil',
      settings: 'Paramètres',
      backup: 'Sauvegarde',
      restore: 'Restaurer',
      help: 'Aide',
      darkMode: 'Mode sombre',
      lightMode: 'Mode clair',
      admin: 'Administrateur',
      noNotifications: 'Aucune notification',
      clearAll: 'Tout effacer',
      markAsRead: 'Marquer comme lu',
      confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter?',
      helpTitle: 'Centre d\'aide',
      helpContent: 'Bienvenue au centre d\'aide. Vous pouvez trouver toutes les informations dont vous avez besoin ici.',
      profileTitle: 'Profil',
      editProfile: 'Modifier le profil',
      changePassword: 'Changer le mot de passe',
      accountSettings: 'Paramètres du compte',
      fullscreen: 'Plein écran',
      exitFullscreen: 'Quitter plein écran',
      refresh: 'Actualiser',
      online: 'En ligne',
      offline: 'Hors ligne',
      systemStatus: 'État du système',
      performance: 'Performance'
    }
  };

  const currentT = t[currentLanguage];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardMetrics language={currentLanguage} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TankLevelDisplay language={currentLanguage} />
              <SalesTrendsChart language={currentLanguage} />
            </div>
          </div>
        );
      case 'tanks':
        return <TankManagement language={currentLanguage} />;
      case 'pumps':
        return <PumpManagement language={currentLanguage} />;
      case 'fuel':
        return <FuelManagement language={currentLanguage} />;
      case 'store':
        return <StoreManagement language={currentLanguage} />;
      case 'credits':
        return <CreditManagement language={currentLanguage} />;
      case 'workers':
        return <WorkerManagement language={currentLanguage} />;
      case 'taxes':
        return <TaxManagement language={currentLanguage} />;
      case 'reports':
        return <Reports language={currentLanguage} />;
      case 'settings':
        return <Settings language={currentLanguage} />;
      default:
        return <DashboardMetrics language={currentLanguage} />;
    }
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen bg-slate-50 ${isRTL ? 'rtl' : 'ltr'} ${isDarkMode ? 'dark' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex h-screen">
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            language={currentLanguage}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Enhanced Professional Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-lg backdrop-blur-sm">
              <div className="px-6 py-3">
                <div className="flex items-center justify-between">
                  {/* Left Section - Search and Status */}
                  <div className="flex items-center gap-6">
                    {/* Enhanced Search with Suggestions */}
                    <div className="relative group">
                      <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors`} />
                      <Input
                        type="text"
                        placeholder={currentT.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 w-96 border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white shadow-sm hover:shadow-md`}
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* System Status Indicators */}
                    <div className="hidden xl:flex items-center gap-4">
                      {/* Connection Status */}
                      <div className="flex items-center gap-2">
                        {isOnline ? (
                          <Wifi className="h-4 w-4 text-green-500" />
                        ) : (
                          <WifiOff className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                          {isOnline ? currentT.online : currentT.offline}
                        </span>
                      </div>

                      {/* Current Time */}
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-mono">
                          {currentTime.toLocaleTimeString(isRTL ? 'ar-SA' : 'fr-FR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Enhanced Actions */}
                  <div className="flex items-center gap-1">
                    {/* System Performance Indicator */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="w-64">
                        <div className="space-y-2">
                          <p className="font-medium">{currentT.systemStatus}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>CPU</span>
                              <span>{systemStatus.cpu}%</span>
                            </div>
                            <Progress value={systemStatus.cpu} className="h-1" />
                            <div className="flex justify-between text-xs">
                              <span>Memory</span>
                              <span>{systemStatus.memory}%</span>
                            </div>
                            <Progress value={systemStatus.memory} className="h-1" />
                            <div className="flex justify-between text-xs">
                              <span>Storage</span>
                              <span>{systemStatus.storage}%</span>
                            </div>
                            <Progress value={systemStatus.storage} className="h-1" />
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Refresh Button */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentT.refresh}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Fullscreen Toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleFullscreen}
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isFullscreen ? currentT.exitFullscreen : currentT.fullscreen}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Backup with Animation */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleBackup}
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentT.backup}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Restore with Animation */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleRestore}
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{currentT.restore}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Enhanced Help Dialog */}
                    <Dialog open={showHelp} onOpenChange={setShowHelp}>
                      <DialogTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                            >
                              <HelpCircle className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{currentT.help}</p>
                          </TooltipContent>
                        </Tooltip>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-500" />
                            {currentT.helpTitle}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {currentT.helpContent}
                          </p>
                          <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" size="sm" className="justify-start gap-2 hover:bg-blue-50 hover:border-blue-200">
                              <Shield className="h-4 w-4 text-blue-500" />
                              دليل المستخدم
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start gap-2 hover:bg-green-50 hover:border-green-200">
                              <Info className="h-4 w-4 text-green-500" />
                              الأسئلة الشائعة
                            </Button>
                            <Button variant="outline" size="sm" className="justify-start gap-2 hover:bg-purple-50 hover:border-purple-200">
                              <Zap className="h-4 w-4 text-purple-500" />
                              تواصل مع الدعم
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Enhanced Theme Toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleTheme}
                          className="h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                        >
                          {isDarkMode ? 
                            <Sun className="h-4 w-4 text-yellow-500 animate-pulse" /> : 
                            <Moon className="h-4 w-4 text-blue-500" />
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isDarkMode ? currentT.lightMode : currentT.darkMode}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-600 mx-2" />

                    {/* Enhanced Notifications */}
                    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                      <DropdownMenuTrigger asChild>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="relative h-9 px-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                            >
                              <Bell className="h-4 w-4" />
                              {unreadCount > 0 && (
                                <Badge 
                                  variant="destructive" 
                                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium animate-bounce"
                                >
                                  {unreadCount}
                                </Badge>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{currentT.notifications} ({unreadCount})</p>
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto shadow-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">{currentT.notifications}</h3>
                          {notifications.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearAllNotifications}
                              className="text-xs hover:bg-white/50"
                            >
                              {currentT.clearAll}
                            </Button>
                          )}
                        </div>
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            {currentT.noNotifications}
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <DropdownMenuItem 
                              key={notification.id} 
                              className={`p-4 cursor-pointer border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3 w-full">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{notification.title}</p>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
                                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {notification.time}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                                )}
                              </div>
                            </DropdownMenuItem>
                          ))
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Enhanced Language Toggle */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={toggleLanguage}
                          className="h-9 px-3 gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-slate-100 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                        >
                          <Languages className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {currentLanguage === 'ar' ? 'عربي' : 'FR'}
                          </span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>تبديل اللغة / Changer la langue</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Enhanced Profile Dropdown */}
                    <DropdownMenu open={showProfile} onOpenChange={setShowProfile}>
                      <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-3 ml-3 pl-3 border-l border-slate-200 dark:border-slate-600 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg p-2 transition-all duration-200">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{currentT.admin}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">محمد أحمد</p>
                          </div>
                          <div className="relative">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-9 w-9 p-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-700 dark:from-blue-900 dark:to-indigo-900 dark:hover:from-blue-800 dark:hover:to-indigo-800 dark:text-blue-300 shadow-sm"
                            >
                              <User className="h-4 w-4" />
                            </Button>
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                          </div>
                          <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 shadow-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-700 dark:text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">محمد أحمد</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">admin@gasstation.com</p>
                              <Badge variant="outline" className="text-xs mt-1">مدير النظام</Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenuItem className="cursor-pointer p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <User className="h-4 w-4 mr-3 text-blue-500" />
                          {currentT.editProfile}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <SettingsIcon className="h-4 w-4 mr-3 text-slate-500" />
                          {currentT.accountSettings}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                          onClick={() => setActiveTab('settings')}
                        >
                          <SettingsIcon className="h-4 w-4 mr-3 text-slate-500" />
                          {currentT.settings}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="cursor-pointer p-3 text-red-600 focus:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          {currentT.logout}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
              <div className="p-6">
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value={activeTab} className="mt-0">
                    {renderTabContent()}
                  </TabsContent>
                </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}