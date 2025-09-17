import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Moon, Sun, User, LogOut } from "lucide-react";
import { useGasStationStore } from "@/store/gasStationStore";

// Import all the new components
import DashboardMetrics from "./dashboard/DashboardMetrics";
import TankLevelDisplay from "./dashboard/TankLevelDisplay";
import SalesTrendsChart from "./dashboard/SalesTrendsChart";
import FuelManagement from "./fuel/FuelManagement";
import StoreManagement from "./store/StoreManagement";
import CreditManagement from "./credits/CreditManagement";
import WorkerManagement from "./workers/WorkerManagement";
import TaxManagement from "./taxes/TaxManagement";
import Reports from "./reports/Reports";
import Settings from "./settings/Settings";

const sidebarItems = [
  {
    id: "dashboard",
    label: { ar: "لوحة القيادة", fr: "Tableau de bord" },
    icon: "home",
  },
  { id: "fuel", label: { ar: "الوقود", fr: "Carburant" }, icon: "droplet" },
  {
    id: "tanks",
    label: { ar: "الخزانات", fr: "Réservoirs" },
    icon: "database",
  },
  { id: "store", label: { ar: "المتجر", fr: "Magasin" }, icon: "shopping-bag" },
  {
    id: "credits",
    label: { ar: "الديون", fr: "Crédits" },
    icon: "credit-card",
  },
  { id: "workers", label: { ar: "العمال", fr: "Travailleurs" }, icon: "users" },
  {
    id: "taxes",
    label: { ar: "الضرائب والزكاة", fr: "Taxes et Zakat" },
    icon: "percent",
  },
  {
    id: "reports",
    label: { ar: "التقارير", fr: "Rapports" },
    icon: "file-text",
  },
  {
    id: "settings",
    label: { ar: "الإعدادات", fr: "Paramètres" },
    icon: "settings",
  },
];

interface HomeProps {
  language?: "ar" | "fr";
  theme?: "light" | "dark";
}

const Home: React.FC<HomeProps> = ({ language: propLanguage, theme: propTheme }) => {
  const { settings, updateSettings, getDashboardMetrics } = useGasStationStore();
  
  const [currentLanguage, setCurrentLanguage] = useState<"ar" | "fr">(propLanguage || settings.language);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(propTheme || settings.theme);
  const [activeTab, setActiveTab] = useState("dashboard");

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "ar" ? "fr" : "ar";
    setCurrentLanguage(newLanguage);
    updateSettings({ language: newLanguage });
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const isRTL = currentLanguage === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  // Get dashboard metrics from store
  const dashboardMetrics = getDashboardMetrics();

  return (
    <div
      className={`flex h-screen bg-background ${currentTheme === "dark" ? "dark" : ""}`}
      dir={dir}
      style={{
        backgroundColor: currentTheme === "dark" ? "#0F172A" : "#F9FAFB",
      }}
    >
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h1
            className={`text-2xl font-bold ${isRTL ? "text-right" : "text-left"}`}
          >
            {isRTL ? "محطة الوقود" : "Station-service"}
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-${isRTL ? "end" : "start"} ${isRTL ? "flex-row-reverse" : ""}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className={`${isRTL ? "mr-2" : "mr-2"}`}>
                    {item.label[currentLanguage]}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <h2 className="text-xl font-semibold">
            {
              sidebarItems.find((item) => item.id === activeTab)?.label[
                currentLanguage
              ]
            }
          </h2>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
              <span className="sr-only">
                {isRTL ? "تبديل اللغة" : "Changer de langue"}
              </span>
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {currentTheme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <span className="sr-only">
                {isRTL ? "تبديل السمة" : "Changer de thème"}
              </span>
            </Button>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">
                {isRTL ? "الملف الشخصي" : "Profil"}
              </span>
            </Button>
            <Button variant="outline" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">
                {isRTL ? "تسجيل الخروج" : "Déconnexion"}
              </span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6 p-6">
              <DashboardMetrics 
                language={currentLanguage}
                fuelSold={`${dashboardMetrics.dailyFuelSales.toLocaleString()} L`}
                profits={`${dashboardMetrics.dailyProfit.toFixed(2)} SAR`}
                debts={`${dashboardMetrics.totalDebts.toFixed(2)} SAR`}
                storeSales={`${dashboardMetrics.dailyStoreSales.toFixed(2)} SAR`}
                fuelTrend={5}
                profitsTrend={12}
                debtsTrend={-3}
                storeTrend={8}
              />
              <TankLevelDisplay language={currentLanguage} tanks={dashboardMetrics.tankLevels} />
              <SalesTrendsChart language={currentLanguage} />
            </div>
          )}

          {activeTab === "fuel" && (
            <FuelManagement language={currentLanguage} />
          )}

          {activeTab === "tanks" && (
            <div className="p-6">
              <TankLevelDisplay language={currentLanguage} tanks={dashboardMetrics.tankLevels} />
            </div>
          )}

          {activeTab === "store" && (
            <StoreManagement language={currentLanguage} />
          )}

          {activeTab === "credits" && (
            <CreditManagement language={currentLanguage} />
          )}

          {activeTab === "workers" && (
            <WorkerManagement language={currentLanguage} />
          )}

          {activeTab === "taxes" && (
            <TaxManagement language={currentLanguage} />
          )}

          {activeTab === "reports" && (
            <Reports language={currentLanguage} />
          )}

          {activeTab === "settings" && (
            <Settings 
              language={currentLanguage} 
              onLanguageChange={setCurrentLanguage}
              onThemeChange={setCurrentTheme}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;