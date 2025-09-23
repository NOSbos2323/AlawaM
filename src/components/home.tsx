import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
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
  Zap,
} from "lucide-react";
import { useGasStationStore } from "@/store/gasStationStore";

// Import components
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import TankLevelDisplay from "@/components/dashboard/TankLevelDisplay";
import SalesTrendsChart from "@/components/dashboard/SalesTrendsChart";
import FuelManagement from "@/components/fuel/FuelManagement";
import StoreManagement from "@/components/store/StoreManagement";
import CreditManagement from "@/components/credits/CreditManagement";
import WorkerManagement from "@/components/workers/WorkerManagement";
import TaxManagement from "@/components/taxes/TaxManagement";
import Reports from "@/components/reports/Reports";
import Settings from "@/components/settings/Settings";
import Sidebar from "@/components/layout/Sidebar";
import TankManagement from "@/components/fuel/TankManagement";
import PumpManagement from "@/components/fuel/PumpManagement";

interface HomeProps {
  language?: "ar" | "fr";
}

export default function Home({ language = "ar" }: HomeProps) {
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "fr">(language);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "info",
      title: "تحديث النظام",
      message: "تم تحديث النظام بنجاح",
      time: "منذ 5 دقائق",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "مستوى الخزان منخفض",
      message: "خزان الديزل أقل من 30%",
      time: "منذ 15 دقيقة",
      read: false,
    },
    {
      id: 3,
      type: "success",
      title: "نسخة احتياطية",
      message: "تم إنشاء النسخة الاحتياطية",
      time: "منذ ساعة",
      read: true,
    },
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState({
    cpu: 45,
    memory: 62,
    storage: 78,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // استخدام قاعدة البيانات
  const {
    exportData,
    importData,
    getDashboardMetrics,
    tanks,
    storeItems,
    customers,
    workers,
  } = useGasStationStore();

  const isRTL = currentLanguage === "ar";
  const unreadCount = notifications.filter((n) => !n.read).length;

  // تحديث الإشعارات بناءً على البيانات الفعلية
  useEffect(() => {
    const metrics = getDashboardMetrics();
    const lowTanks = tanks.filter(
      (tank) => (tank.currentLevel / tank.capacity) * 100 < 30,
    );
    const lowStockItems = storeItems.filter(
      (item) => item.stock <= (item.minStock || 10),
    );
    const highDebtCustomers = customers.filter(
      (c) => c.currentDebt > c.creditLimit * 0.8,
    );

    const newNotifications = [];

    // تنبيهات الخزانات المنخفضة
    lowTanks.forEach((tank) => {
      const percentage = (tank.currentLevel / tank.capacity) * 100;
      newNotifications.push({
        id: Date.now() + Math.random(),
        type: "warning",
        title: "مستوى خزان منخفض",
        message: `${tank.name} - ${percentage.toFixed(1)}%`,
        time: "الآن",
        read: false,
      });
    });

    // تنبيهات المخزون المنخفض
    if (lowStockItems.length > 0) {
      newNotifications.push({
        id: Date.now() + Math.random(),
        type: "warning",
        title: "مخزون منخفض",
        message: `${lowStockItems.length} منتج يحتاج إعادة تموين`,
        time: "الآن",
        read: false,
      });
    }

    // تنبيهات الديون العالية
    if (highDebtCustomers.length > 0) {
      newNotifications.push({
        id: Date.now() + Math.random(),
        type: "info",
        title: "ديون عالية",
        message: `${highDebtCustomers.length} عميل تجاوز 80% من حد الائتمان`,
        time: "الآن",
        read: false,
      });
    }

    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev.slice(0, 5)]);
    }
  }, [tanks, storeItems, customers, getDashboardMetrics]);

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

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const toggleLanguage = () => {
    setCurrentLanguage((prev) => (prev === "ar" ? "fr" : "ar"));
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.documentElement.classList.toggle("dark", !isDarkMode);
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);

    // Add refresh notification
    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "success",
        title: "تحديث البيانات",
        message: "تم تحديث جميع البيانات بنجاح",
        time: "الآن",
        read: false,
      },
      ...prev,
    ]);
  };

  const handleBackup = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gas-station-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setNotifications((prev) => [
      {
        id: Date.now(),
        type: "success",
        title: "نسخة احتياطية",
        message: "تم إنشاء النسخة الاحتياطية بنجاح",
        time: "الآن",
        read: false,
      },
      ...prev,
    ]);
  };

  const handleRestore = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            importData(data);

            setNotifications((prev) => [
              {
                id: Date.now(),
                type: "success",
                title: "استعادة البيانات",
                message: "تم استعادة البيانات بنجاح",
                time: "الآن",
                read: false,
              },
              ...prev,
            ]);
          } catch (error) {
            setNotifications((prev) => [
              {
                id: Date.now(),
                type: "warning",
                title: "خطأ في الاستعادة",
                message: "فشل في استعادة البيانات",
                time: "الآن",
                read: false,
              },
              ...prev,
            ]);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
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
      search: "البحث في النظام...",
      notifications: "الإشعارات",
      logout: "تسجيل الخروج",
      welcome: "مرحباً بك في نظام إدارة محطة الوقود",
      lastUpdate: "آخر تحديث: منذ دقيقتين",
      profile: "الملف الشخصي",
      settings: "الإعدادات",
      backup: "نسخ احتياطي",
      restore: "استعادة",
      help: "المساعدة",
      darkMode: "الوضع المظلم",
      lightMode: "الوضع المضيء",
      admin: "مدير النظام",
      noNotifications: "لا توجد إشعارات",
      clearAll: "مسح الكل",
      markAsRead: "تم القراءة",
      confirmLogout: "هل أنت متأكد من تسجيل الخروج؟",
      helpTitle: "مركز المساعدة",
      helpContent:
        "مرحباً بك في مركز المساعدة. يمكنك العثور على جميع المعلومات التي تحتاجها هنا.",
      profileTitle: "الملف الشخصي",
      editProfile: "تعديل الملف الشخصي",
      changePassword: "تغيير كلمة المرور",
      accountSettings: "إعدادات الحساب",
      fullscreen: "ملء الشاشة",
      exitFullscreen: "إنهاء ملء الشاشة",
      refresh: "تحديث البيانات",
      online: "متصل",
      offline: "غير متصل",
      systemStatus: "حالة النظام",
      performance: "الأداء",
    },
    fr: {
      search: "Rechercher dans le système...",
      notifications: "Notifications",
      logout: "Déconnexion",
      welcome: "Bienvenue dans le système de gestion de station-service",
      lastUpdate: "Dernière mise à jour: il y a 2 minutes",
      profile: "Profil",
      settings: "Paramètres",
      backup: "Sauvegarde",
      restore: "Restaurer",
      help: "Aide",
      darkMode: "Mode sombre",
      lightMode: "Mode clair",
      admin: "Administrateur",
      noNotifications: "Aucune notification",
      clearAll: "Tout effacer",
      markAsRead: "Marquer comme lu",
      confirmLogout: "Êtes-vous sûr de vouloir vous déconnecter?",
      helpTitle: "Centre d'aide",
      helpContent:
        "Bienvenue au centre d'aide. Vous pouvez trouver toutes les informations dont vous avez besoin ici.",
      profileTitle: "Profil",
      editProfile: "Modifier le profil",
      changePassword: "Changer le mot de passe",
      accountSettings: "Paramètres du compte",
      fullscreen: "Plein écran",
      exitFullscreen: "Quitter plein écran",
      refresh: "Actualiser",
      online: "En ligne",
      offline: "Hors ligne",
      systemStatus: "État du système",
      performance: "Performance",
    },
  };

  const currentT = t[currentLanguage];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardMetrics language={currentLanguage} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TankLevelDisplay language={currentLanguage} />
              <SalesTrendsChart language={currentLanguage} />
            </div>
          </div>
        );
      case "tanks":
        return <TankManagement language={currentLanguage} />;
      case "pumps":
        return <PumpManagement language={currentLanguage} />;
      case "fuel":
        return <FuelManagement language={currentLanguage} />;
      case "store":
        return <StoreManagement language={currentLanguage} />;
      case "credits":
        return <CreditManagement language={currentLanguage} />;
      case "workers":
        return <WorkerManagement language={currentLanguage} />;
      case "taxes":
        return <TaxManagement language={currentLanguage} />;
      case "reports":
        return <Reports language={currentLanguage} />;
      case "settings":
        return <Settings language={currentLanguage} />;
      default:
        return <DashboardMetrics language={currentLanguage} />;
    }
  };

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen bg-slate-50 ${isRTL ? "rtl" : "ltr"} ${isDarkMode ? "dark" : ""}`}
        dir={isRTL ? "rtl" : "ltr"}
      >
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
              <div className="px-6 py-3"></div>
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
