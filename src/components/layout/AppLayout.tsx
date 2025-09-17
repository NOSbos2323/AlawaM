import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Moon,
  Sun,
  Languages,
  LogOut,
  Home,
  Droplet,
  Database,
  ShoppingBag,
  CreditCard,
  Users,
  Calculator,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AppLayoutProps {
  children?: React.ReactNode;
  direction?: "rtl" | "ltr";
}

const AppLayout = ({ children, direction = "rtl" }: AppLayoutProps) => {
  const [isRtl, setIsRtl] = useState(direction === "rtl");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle language direction
  const toggleDirection = () => {
    setIsRtl(!isRtl);
    // In a real implementation, this would also change the language
  };

  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real implementation, this would apply the theme to the document
  };

  // Navigation items
  const navItems = [
    {
      icon: <Home size={20} />,
      label: isRtl ? "لوحة القيادة" : "Dashboard",
      path: "/",
    },
    {
      icon: <Droplet size={20} />,
      label: isRtl ? "الوقود" : "Fuel",
      path: "/fuel",
    },
    {
      icon: <Database size={20} />,
      label: isRtl ? "الخزانات" : "Tanks",
      path: "/tanks",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: isRtl ? "المتجر" : "Store",
      path: "/store",
    },
    {
      icon: <CreditCard size={20} />,
      label: isRtl ? "الديون" : "Credits",
      path: "/credits",
    },
    {
      icon: <Users size={20} />,
      label: isRtl ? "العمال" : "Workers",
      path: "/workers",
    },
    {
      icon: <Calculator size={20} />,
      label: isRtl ? "الضرائب والزكاة" : "Taxes/Zakat",
      path: "/taxes",
    },
    {
      icon: <FileText size={20} />,
      label: isRtl ? "التقارير" : "Reports",
      path: "/reports",
    },
    {
      icon: <Settings size={20} />,
      label: isRtl ? "الإعدادات" : "Settings",
      path: "/settings",
    },
  ];

  return (
    <div
      className={`flex h-screen bg-background ${isDarkMode ? "dark" : ""}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-card border-e shadow-sm h-full flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-center">
            {isRtl ? "محطة الوقود" : "Gas Station"}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-left"
                  asChild
                >
                  <a href={item.path}>
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-4">
          <div>
            <h2 className="text-lg font-medium">
              {isRtl ? "لوحة القيادة" : "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <TooltipProvider>
              {/* Backup button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Database size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRtl ? "نسخ احتياطي" : "Backup"}
                </TooltipContent>
              </Tooltip>

              {/* Theme toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRtl ? "تبديل السمة" : "Toggle theme"}
                </TooltipContent>
              </Tooltip>

              {/* Language toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleDirection}
                  >
                    <Languages size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRtl ? "Français" : "العربية"}
                </TooltipContent>
              </Tooltip>

              {/* Logout button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <LogOut size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRtl ? "تسجيل الخروج" : "Logout"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 bg-background">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
