import React, { useState } from "react";
import {
  BarChart3,
  Fuel,
  Store,
  DollarSign,
  Users,
  Calculator,
  FileText,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Home,
  TrendingUp,
  Gauge,
  CreditCard,
  UserCheck,
  Receipt,
  Cog,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  language?: "ar" | "fr";
  className?: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  language = "ar",
  className = "",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isRTL = language === "ar";

  const navigationItems = [
    {
      id: "dashboard",
      label: isRTL ? "لوحة التحكم" : "Tableau de bord",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      activeColor: "bg-blue-600 text-white",
      badge: null,
    },
    {
      id: "tanks",
      label: isRTL ? "إدارة الخزانات" : "Gestion Réservoirs",
      icon: Fuel,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      activeColor: "bg-green-600 text-white",
      badge: null,
    },
    {
      id: "pumps",
      label: isRTL ? "إدارة المضخات" : "Gestion Pompes",
      icon: Gauge,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      hoverColor: "hover:bg-emerald-100",
      activeColor: "bg-emerald-600 text-white",
      badge: null,
    },
    {
      id: "store",
      label: isRTL ? "إدارة المتجر" : "Gestion Magasin",
      icon: Store,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      activeColor: "bg-purple-600 text-white",
      badge: null,
    },
    {
      id: "credits",
      label: isRTL ? "الديون والائتمان" : "Crédits & Dettes",
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      activeColor: "bg-orange-600 text-white",
      badge: null,
    },
    {
      id: "workers",
      label: isRTL ? "إدارة العمال" : "Gestion Personnel",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      hoverColor: "hover:bg-indigo-100",
      activeColor: "bg-indigo-600 text-white",
      badge: null,
    },
    {
      id: "taxes",
      label: isRTL ? "الضرائب والفواتير" : "Taxes & Factures",
      icon: Calculator,
      color: "text-red-600",
      bgColor: "bg-red-50",
      hoverColor: "hover:bg-red-100",
      activeColor: "bg-red-600 text-white",
      badge: null,
    },
    {
      id: "reports",
      label: isRTL ? "التقارير" : "Rapports",
      icon: FileText,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      hoverColor: "hover:bg-teal-100",
      activeColor: "bg-teal-600 text-white",
      badge: null,
    },
  ];

  const settingsItem = {
    id: "settings",
    label: isRTL ? "الإعدادات" : "Paramètres",
    icon: SettingsIcon,
    color: "text-gray-600",
    bgColor: "bg-gray-50",
    hoverColor: "hover:bg-gray-100",
    activeColor: "bg-gray-600 text-white",
    badge: null,
  };

  const quickStats = [
    {
      label: isRTL ? "المبيعات اليوم" : "Ventes aujourd'hui",
      value: "15,240",
      unit: isRTL ? "ر.س" : "SAR",
      trend: "+12%",
      color: "text-green-600",
    },
    {
      label: isRTL ? "العملاء النشطون" : "Clients actifs",
      value: "48",
      unit: "",
      trend: "+5",
      color: "text-blue-600",
    },
  ];

  const renderNavItem = (item: any) => {
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => {
          onTabChange(item.id);
          setIsMobileOpen(false);
        }}
        className={`
          w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
          transition-all duration-200 group relative
          ${
            isActive
              ? item.activeColor + " shadow-lg shadow-black/10"
              : `${item.color} ${item.hoverColor} hover:shadow-md`
          }
          ${isCollapsed ? "justify-center px-2" : ""}
        `}
      >
        <div
          className={`
            flex items-center justify-center w-8 h-8 rounded-lg
            ${isActive ? "bg-white/20" : item.bgColor}
            transition-all duration-200
          `}
        >
          <item.icon
            className={`h-4 w-4 ${isActive ? "text-white" : item.color}`}
          />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 text-right">
              <div
                className={`font-medium ${isActive ? "text-white" : "text-slate-900"}`}
              >
                {item.label}
              </div>
            </div>

            {item.badge && (
              <Badge
                variant="secondary"
                className={`
                  text-xs px-2 py-0.5
                  ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : "bg-white text-slate-700 border-slate-200"
                  }
                `}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
        {isActive && (
          <div
            className={`
              absolute ${isRTL ? "right-0" : "left-0"} top-0 bottom-0 w-1 
              bg-white rounded-r-full
            `}
          />
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Gauge className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">
                  {isRTL ? "محطة الوقود" : "Station Service"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isRTL ? "نظام الإدارة" : "Système de gestion"}
                </p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-slate-100"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-2">{navigationItems.map(renderNavItem)}</div>

        <Separator className="my-4" />

        <div className="space-y-2">{renderNavItem(settingsItem)}</div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && <div className="p-4 border-t border-slate-200"></div>}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 p-0 bg-white shadow-lg border"
      >
        <Menu className="h-5 w-5" />
      </Button>
      {/* Desktop Sidebar */}
      <div
        className={`
        hidden md:flex flex-col h-screen sticky top-0 z-40
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-20" : "w-80"}
        ${className}
      `}
      >
        {sidebarContent}
      </div>
      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div
            className={`
            absolute top-0 ${isRTL ? "right-0" : "left-0"} h-full w-80 
            transform transition-transform duration-300 ease-in-out
          `}
          >
            <div className="relative h-full">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 z-10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}