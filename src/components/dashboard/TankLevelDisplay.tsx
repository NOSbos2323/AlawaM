import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TankData {
  id: string;
  name: string;
  currentLevel: number;
  capacity: number;
  fuelType: string;
  color: string;
}

interface TankLevelDisplayProps {
  language?: 'ar' | 'fr';
  tanks?: TankData[];
}

const TankLevelDisplay = ({ 
  language = 'ar',
  tanks = defaultTanks 
}: TankLevelDisplayProps) => {
  const texts = {
    ar: {
      tankLevels: "مستويات الخزانات",
      tank: "خزان",
      currentLevel: "المستوى الحالي",
      capacity: "السعة",
      gasoline91: "بنزين 91",
      gasoline95: "بنزين 95", 
      diesel: "ديزل",
      kerosene: "كيروسين",
    },
    fr: {
      tankLevels: "Niveaux des réservoirs",
      tank: "Réservoir",
      currentLevel: "Niveau actuel",
      capacity: "Capacité",
      gasoline91: "Essence 91",
      gasoline95: "Essence 95",
      diesel: "Diesel", 
      kerosene: "Kérosène",
    },
  };

  const t = texts[language];

  const getFuelTypeName = (fuelType: string) => {
    const fuelNames = {
      'Gasoline 91': { ar: 'بنزين 91', fr: 'Essence 91' },
      'Gasoline 95': { ar: 'بنزين 95', fr: 'Essence 95' },
      'Diesel': { ar: 'ديزل', fr: 'Diesel' },
      'Kerosene': { ar: 'كيروسين', fr: 'Kérosène' },
    };
    return fuelNames[fuelType as keyof typeof fuelNames]?.[language] || fuelType;
  };

  return (
    <div className="w-full bg-background p-4">
      <h2 className="text-2xl font-bold mb-4">{t.tankLevels}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tanks.map((tank) => (
          <Card key={tank.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{t.tank} {tank.name}</span>
                <span className="text-sm font-normal">{getFuelTypeName(tank.fuelType)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <div className="relative h-32 w-full border-2 border-muted rounded-md overflow-hidden">
                  {/* Tank visualization */}
                  <div
                    className="absolute bottom-0 w-full transition-all duration-500 ease-in-out"
                    style={{
                      height: `${(tank.currentLevel / tank.capacity) * 100}%`,
                      backgroundColor: tank.color,
                    }}
                  />
                  {/* Tank level lines */}
                  <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                    <div className="border-t border-dashed border-muted-foreground/30 w-full h-0" />
                    <div className="border-t border-dashed border-muted-foreground/30 w-full h-0" />
                    <div className="border-t border-dashed border-muted-foreground/30 w-full h-0" />
                    <div className="border-t border-dashed border-muted-foreground/30 w-full h-0" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t.currentLevel}</span>
                  <span className="font-medium">
                    {tank.currentLevel.toLocaleString()} L
                  </span>
                </div>
                <Progress
                  value={(tank.currentLevel / tank.capacity) * 100}
                  className="h-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0 L</span>
                  <span>{`${((tank.currentLevel / tank.capacity) * 100).toFixed(1)}%`}</span>
                  <span>{tank.capacity.toLocaleString()} L</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Default tank data for preview
const defaultTanks: TankData[] = [
  {
    id: "tank-a",
    name: "A",
    currentLevel: 12500,
    capacity: 20000,
    fuelType: "Gasoline 91",
    color: "#3b82f6",
  },
  {
    id: "tank-b",
    name: "B",
    currentLevel: 8000,
    capacity: 15000,
    fuelType: "Gasoline 95",
    color: "#10b981",
  },
  {
    id: "tank-c",
    name: "C",
    currentLevel: 3000,
    capacity: 10000,
    fuelType: "Diesel",
    color: "#f59e0b",
  },
  {
    id: "tank-d",
    name: "D",
    currentLevel: 5000,
    capacity: 10000,
    fuelType: "Kerosene",
    color: "#6366f1",
  },
];

export default TankLevelDisplay;