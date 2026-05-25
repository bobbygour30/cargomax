"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  DollarSign,
  ShieldCheck,
  BoxesIcon,
  LifeBuoy,
  Menu,
  X,
  Bell,
  User,
  Search,
  ChevronDown,
  Network, // Added Network icon
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

interface TopBarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  selectedModule: string;
  onModuleSelect: (module: string) => void;
}

// Removed Dashboard and Help & Support from topbar modules
const modules = [
  { id: "Operations", name: "Operations", icon: Settings },
  { id: "Accounts", name: "Accounts", icon: DollarSign },
  { id: "Administrator", name: "Administrator", icon: ShieldCheck },
  { id: "Inventory", name: "Inventory", icon: BoxesIcon },
  { id: "Network", name: "Network", icon: Network }, // Added Network module
];

export function TopBar({ toggleSidebar, sidebarOpen, selectedModule, onModuleSelect }: TopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // If selectedModule is Dashboard or Help & Support, default to Operations
  const effectiveSelectedModule = selectedModule === "Dashboard" || selectedModule === "Help & Support" 
    ? "Operations" 
    : selectedModule;
  
  const selectedModuleData = modules.find(m => m.id === effectiveSelectedModule) || modules[0];

  // Update parent if needed
  if (effectiveSelectedModule !== selectedModule) {
    onModuleSelect(effectiveSelectedModule);
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        
        {/* Desktop Dropdown Module Selector */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
              "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            )}
          >
            <selectedModuleData.icon className="h-4 w-4" />
            <span>{selectedModuleData.name}</span>
            <ChevronDown className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")} />
          </button>
          
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute left-0 top-full mt-2 z-50 w-56 rounded-md border bg-background shadow-lg">
                {modules.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      onModuleSelect(module.id);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                      effectiveSelectedModule === module.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <module.icon className="h-4 w-4" />
                    <span>{module.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Mobile Module Select */}
        <div className="md:hidden">
          <select
            value={effectiveSelectedModule}
            onChange={(e) => onModuleSelect(e.target.value)}
            className="flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-md pl-8"
          />
        </div>
        
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden text-sm font-medium md:inline-block">Admin User</span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
        </div>
      </div>
    </header>
  );
}