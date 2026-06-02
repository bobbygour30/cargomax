"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart,
  RefreshCw,
  BoxesIcon,
  Building2,
  Bus,
  Calendar,
  ClipboardList,
  Clock,
  LayoutDashboard,
  LifeBuoy,
  Mail,
  Map,
  MessageCircle,
  Navigation,
  PackagePlus,
  PlusSquare,
  RotateCcw,
  Scroll,
  Settings,
  ShieldCheck,
  Ticket,
  Truck,
  UserCog,
  Users,
  Warehouse,
  FolderTree,
  FileText,
  GitBranch,
  CalendarDays,
  DollarSign,
  Gift,
  Receipt,
  BarChart3,
  ChevronDown,
  X,
  TrendingUp,
  Gauge,
  BookOpen,
  FileCheck,
  Handshake,
  Landmark,
  PiggyBank,
  ReceiptText,
  FileSpreadsheet,
  FileBarChart,
  FileOutput,
  IndianRupee,
  Wrench,
  FileX,
  CalendarX,
  History,
  Upload,
  AlertCircle,
  AlertTriangle,
  Search,
  Printer,
  Menu,
  Lock,
  Sliders,
  Database,
  MapPin,
  ShoppingCart,
  Wallet,
  CreditCard,
  Route,
  Merge,
  Calculator,
  Car,
  Fuel,
  MessageSquare,
  MapPinned,
  Building,
  BadgeIndianRupee,
  FileWarning,
  Shield,
  Network,
  Zap,
  Layers,
  Package,
  Send,
  Eye,
  Radar,
  GaugeCircle,
  Wifi,
  Signal,
  Globe,
  Crosshair,
  Route as RouteIcon,
  Split,
  GitMerge,
  TrendingUp as TrendingUpIcon,
  AlertOctagon,
  ActivitySquare,
  Cpu,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  selectedModule: string;
  onModuleSelect: (module: string) => void;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: NavItem[];
}

interface NavGroup {
  title: string;
  icon: React.ElementType;
  items: NavItem[];
}

// Common groups - Help & Support will be added at the end
const commonNavGroups: NavGroup[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", icon: LayoutDashboard, href: "/" },
      { title: "Live Shipment Map", icon: Map, href: "/dashboard/map" },
      { title: "Fleet Status", icon: Activity, href: "/dashboard/fleet-status" },
    ],
  },
];

// Recursive component to render nested navigation items
const RenderNavItems = ({
  items,
  pathname,
  toggleSidebar,
  level = 0,
  openDropdowns,
  toggleNestedDropdown
}: {
  items: NavItem[];
  pathname: string;
  toggleSidebar: () => void;
  level?: number;
  openDropdowns: Record<string, boolean>;
  toggleNestedDropdown: (title: string) => void;
}) => {
  return (
    <>
      {items.map((item) => (
        <div key={item.title}>
          {item.href && !item.children && (
            <Link
              href={item.href}
              onClick={toggleSidebar}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                pathname === item.href && "bg-accent text-accent-foreground",
                level === 0 ? "text-xs" : "text-[11px]",
                level === 0 ? "font-medium" : "font-normal"
              )}
            >
              <item.icon className={cn("flex-shrink-0", level === 0 ? "h-3.5 w-3.5" : "h-3 w-3")} />
              <span className="truncate">{item.title}</span>
            </Link>
          )}

          {item.children && (
            <div className="space-y-1">
              <button
                onClick={() => toggleNestedDropdown(item.title)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 transition-all",
                  "hover:bg-accent hover:text-accent-foreground",
                  openDropdowns[item.title] && "bg-accent/50",
                  level === 0 ? "text-xs font-medium" : "text-[11px] font-normal"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("flex-shrink-0", level === 0 ? "h-3.5 w-3.5" : "h-3 w-3")} />
                  <span className="truncate">{item.title}</span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200 flex-shrink-0",
                    openDropdowns[item.title] && "rotate-180"
                  )}
                />
              </button>

              {openDropdowns[item.title] && (
                <div className={cn("space-y-1", level === 0 ? "ml-4 pl-2 border-l-2 border-muted" : "ml-3")}>
                  <RenderNavItems
                    items={item.children}
                    pathname={pathname}
                    toggleSidebar={toggleSidebar}
                    level={level + 1}
                    openDropdowns={openDropdowns}
                    toggleNestedDropdown={toggleNestedDropdown}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

// Module-specific navigation groups - ORDER CHANGED: Dashboard > Workflow > Setup > Reports
// Tools section REMOVED, its items moved to Reports
const moduleNavGroups: Record<string, NavGroup[]> = {
  Operations: [
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "Booking Computerize GRL", icon: PlusSquare, href: "/operations/transaction/booking-computerize" },
        { title: "Booking GRL Manual", icon: FileText, href: "/operations/transaction/booking-grl-manual" },
        { title: "Change Vehicle In Manifest", icon: Truck, href: "/operations/transaction/change-vehicle-in-manifest" },
        { title: "DDR", icon: FileText, href: "/operations/transaction/ddr" },
        { title: "DR Charge Update", icon: DollarSign, href: "/operations/transaction/dr-charge-update" },
        { title: "Gate Pass Entry", icon: Navigation, href: "/operations/transaction/gate-pass" },
        { title: "Goods Arrival", icon: PackagePlus, href: "/operations/transaction/goods-arrival" },
        { title: "GR Enquiry", icon: ClipboardList, href: "/operations/transaction/gr-enquiry" },
        { title: "Local Manifest", icon: Map, href: "/operations/transaction/local-manifest" },
        { title: "Long Route Manifest GRL", icon: Map, href: "/operations/transaction/long-route-manifest" },
        { title: "Lorry Hire Challan", icon: Truck, href: "/operations/transaction/lhc" },
        { title: "Manifest Enquiry", icon: Search, href: "/operations/transaction/manifest-enquiry" },
        { title: "Pickup Manifest", icon: Map, href: "/operations/transaction/pickup-manifest" },
        { title: "POD Entry", icon: Receipt, href: "/operations/transaction/pod-entry" },
        { title: "POD Upload", icon: Upload, href: "/operations/transaction/pod-upload" },
        { title: "Route Merge Tool", icon: Merge, href: "/operations/transaction/route-merge-tool" },
        { title: "Trip P&L Calculator (Inside Manifest)", icon: Calculator, href: "/operations/transaction/trip-calculator" },
        { title: "Market Vehicle Placement Portal", icon: Truck, href: "/operations/transaction/market-vehicle-placement" },
        { title: "RTO Entry (Reverse Logistics)", icon: RotateCcw, href: "/operations/transaction/rto-entry" },
        { title: "Detention Entry (Auto-Generated But Viewable)", icon: AlertTriangle, href: "/operations/transaction/detention-entry" },
      ],
    },
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "Agency Commission Master", icon: Building2, href: "/operations/agency-commission" },
        { title: "Commission Category Master", icon: BarChart, href: "/operations/commission-category" },
        { title: "Consignment Charges Master", icon: Receipt, href: "/operations/consignment-charges" },
        { title: "Consignor Consignee Master", icon: Users, href: "/operations/consignor-consignee" },
        { title: "Credit Note Reason Master", icon: FileText, href: "/operations/credit-note-reason" },
        { title: "Freight On Master", icon: Truck, href: "/operations/freight-on" },
        { title: "Godown Master", icon: Warehouse, href: "/operations/godown-master" },
        { title: "LHC Enquiry", icon: Search, href: "/operations/lhc-enquiry" },
        { title: "Market Vehicle Master", icon: Bus, href: "/operations/market-vehicle" },
        { title: "Packing Master", icon: PackagePlus, href: "/operations/packing" },
        {
          title: "Transportation Masters",
          icon: Truck,
          children: [
            { title: "Driver Master", icon: UserCog, href: "/operations/driver-master" },
          ]
        },
        { title: "Vehicle Group Master", icon: FolderTree, href: "/operations/vehicle-group" },
        { title: "Vehicle Manufacture Master", icon: Building2, href: "/operations/vehicle-manufacture" },
        { title: "Vehicle Master (New)", icon: Bus, href: "/operations/vehicles-new" },
        { title: "Vehicle Subgroup Master", icon: GitBranch, href: "/operations/vehicle-subgroup" },
        { title: "Vehicle Type Master", icon: Bus, href: "/operations/vehicle-type" },
        { title: "Hub Configuration", icon: Building, href: "/operations/hub-config" },
        { title: "Spoke Configuration", icon: Route, href: "/operations/spoke-config" },
        { title: "Pincode Master", icon: MapPinned, href: "/operations/pincode-master" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        // Original Reports
        { title: "Pending POD Report New", icon: Clock, href: "/operations/reports/pending-pod-new" },
        { title: "Arrival Register Report", icon: ClipboardList, href: "/operations/reports/arrival-register" },
        { title: "Booking Other Charges Report", icon: Receipt, href: "/operations/reports/booking-other-charges" },
        { title: "Booking Summary And Detail Report", icon: BarChart, href: "/operations/reports/booking-summary-detail" },
        { title: "Branch Stock Report", icon: BoxesIcon, href: "/operations/reports/branch-stock" },
        { title: "Branch Stock Report Summary", icon: BarChart, href: "/operations/reports/branch-stock-summary" },
        { title: "Daily Sales Report", icon: BarChart, href: "/operations/reports/daily-sales" },
        { title: "Daily Sales Report (New)", icon: TrendingUp, href: "/operations/reports/daily-sales-new" },
        { title: "Delivery Register Report", icon: ClipboardList, href: "/operations/reports/delivery-register" },
        { title: "Despatch Register Report", icon: Truck, href: "/operations/reports/despatch-register" },
        { title: "Destination Wise Booking Summary Report", icon: Map, href: "/operations/reports/destination-wise-booking" },
        { title: "DRS Register New Report", icon: FileText, href: "/operations/reports/drs-register-new" },
        { title: "GR Register LX", icon: FileText, href: "/operations/reports/gr-register-lx" },
        { title: "LHC Report GRL", icon: Truck, href: "/operations/reports/lhc-report-grl" },
        { title: "LHC Report GRL New", icon: TrendingUp, href: "/operations/reports/lhc-report-grl-new" },
        { title: "Loading Tally", icon: ClipboardList, href: "/operations/reports/loading-tally" },
        { title: "POD Not Uploaded New", icon: AlertCircle, href: "/operations/reports/pod-not-uploaded" },
        { title: "POD Register Report", icon: Receipt, href: "/operations/reports/pod-register" },
        { title: "Short / Excess Report", icon: AlertTriangle, href: "/operations/reports/short-excess" },
        { title: "Undelivery Register Report", icon: Clock, href: "/operations/reports/undelivery-register" },
        { title: "Vehicle Arrival Report", icon: Bus, href: "/operations/reports/vehicle-arrival" },
        // Moved from Tools section
        { title: "GRL Manifest Report", icon: FileText, href: "/utilities/grl-manifest-report" },
        { title: "Manifest", icon: Map, href: "/utilities/manifest" },
      ],
    },
  ],
  Accounts: [
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "Money Receipt", icon: DollarSign, href: "/accounts/transaction/money-receipt" },
        { title: "Reverse Money Receipt", icon: RotateCcw, href: "/accounts/transaction/reverse-mr" },
        { title: "Bank Reconciliation", icon: BarChart, href: "/accounts/transaction/bank-reconciliation" },
        { title: "Freight Memo Payment", icon: Receipt, href: "/accounts/transaction/freight-memo-payment" },
        { title: "Vendor Bill Receipt", icon: DollarSign, href: "/accounts/transaction/vendor-bill-receipt" },
        { title: "Vendor Bill Passing", icon: FileCheck, href: "/accounts/transaction/vendor-bill-passing" },
        { title: "Vendor Bill Payment", icon: Receipt, href: "/accounts/transaction/vendor-bill-payment" },
        { title: "Vendor Bill Search", icon: Search, href: "/accounts/transaction/vendor-bill-enquiry" },
        { title: "Bill Search", icon: Search, href: "/accounts/transaction/bill-enquiry" },
        { title: "LHC Advance Payment", icon: Handshake, href: "/accounts/transaction/lhc-advance-payment" },
        { title: "LHC Balances Payment", icon: PiggyBank, href: "/accounts/transaction/lhc-balance-payment" },
        { title: "Fund Transfer", icon: Landmark, href: "/accounts/transaction/fund-transfer" },
        { title: "Fund Transfer Approval", icon: ShieldCheck, href: "/accounts/transaction/fund-transfer-approval" },
        { title: "Account Adjustment", icon: RotateCcw, href: "/accounts/transaction/on-ac-adjustment" },
        { title: "Operational Expense", icon: PiggyBank, href: "/accounts/transaction/operational-expense" },
        { title: "Vendro Expense Entry", icon: PiggyBank, href: "/accounts/transaction/vendor-operational-expense" },
        { title: "Bank Reconciliation", icon: FileText, href: "/accounts/transaction/" },
        { title: "Voucher Entry", icon: ClipboardList, href: "/accounts/transaction/voucher" },
        { title: "TDS Rate Setup", icon: FileText, href: "/accounts/transaction/tds-rate" },
        { title: "Detention Debit Notes", icon: FileWarning, href: "/accounts/transaction/detention-debit-notes" },
        { title: "Driver Advance Wallet", icon: Wallet, href: "/accounts/transaction/driver-advance-wallet" },
        { title: "Fastag Reconciliation", icon: CreditCard, href: "/accounts/transaction/fastag-reconciliation" },
        { title: "Internal Damage Ledger", icon: Shield, href: "/accounts/transaction/internal-damage-ledger" },
        { title: "RTO Billing", icon: ReceiptText, href: "/accounts/transaction/rto-billing" },
      ],
    },
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "Customer", icon: Users, href: "/accounts/master/customers" },
        { title: "Vendor", icon: Building2, href: "/accounts/master/vendor" },
        { title: "Account Group", icon: FolderTree, href: "/accounts/master/main-group" },
        { title: "Account Sub Group", icon: GitBranch, href: "/accounts/master/sub-group" },
        { title: "Cost Center", icon: GitBranch, href: "/accounts/master/cost-center" },
        { title: "TDS Categories", icon: FileText, href: "/accounts/master/tds-category" },
        { title: "TDS Sections", icon: FileText, href: "/accounts/master/tds-section" },
        { title: "TDS Statuses", icon: FileCheck, href: "/accounts/master/tds-status" },
        { title: "Client Credit Profiles (ENHANCED)", icon: BadgeIndianRupee, href: "/accounts/master/client-credit-profiles" },
        { title: "TDS Rule Engine (SECTION 194C)", icon: FileSpreadsheet, href: "/accounts/master/tds-rule" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "Day Book", icon: BookOpen, href: "/accounts/reports/day-book" },
        { title: "Cash Report", icon: IndianRupee, href: "/accounts/reports/cash" },
        { title: "Ledger Report", icon: FileSpreadsheet, href: "/accounts/reports/ledger" },
        { title: "Bill Register", icon: ReceiptText, href: "/accounts/reports/bill-register-gr-wise" },
        { title: "Billed VS UnBilled", icon: ReceiptText, href: "/accounts/reports/" },
        { title: "Billed UnBilled Counters", icon: FileCheck, href: "/accounts/reports/billed-unbilled-counters" },
        { title: "Cash And Bank Register", icon: IndianRupee, href: "/accounts/reports/cash-bank-mr-register" },
        { title: "Gst 1R Report", icon: FileBarChart, href: "/accounts/reports/gst-1r" },
        { title: "Vendor Bill Register", icon: FileOutput, href: "/accounts/reports/vendor-bill-register" },
        { title: "Funds Transfer Register", icon: Landmark, href: "/accounts/reports/funds-transfer" },
      ],
    },
  ],
  Administrator: [
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "MRN Type", icon: FileText, href: "/administrator/transaction/mrn-type-master" },
        { title: "Query Builder", icon: Database, href: "/administrator/transaction/query-builder" },
        { title: "Reset Data", icon: RotateCcw, href: "/administrator/transaction/reset-data" },
      ],
    },
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "Activate Deactivate User", icon: UserCog, href: "/administrator/master/activate-deactivate-user" },
        {
          title: "System Config",
          icon: Settings,
          children: [
            {
              title: "API Integration Layer",
              icon: Database,
              children: [
                { title: "GST/NIC E-Way Bill API Config", icon: FileBarChart, href: "/administrator/master/admin-other/api-integration/gst-nic-config" },
                { title: "Vahan/Sarathi API Config", icon: Car, href: "/administrator/master/admin-other/api-integration/vahan-sarathi-config" },
                { title: "Fastag API Config", icon: CreditCard, href: "/administrator/master/admin-other/api-integration/fastag-api-config" },
                { title: "WhatsApp Business API Config", icon: MessageSquare, href: "/administrator/master/admin-other/api-integration/whatsapp-api-config" },
                { title: "Fuel Card API Config", icon: Fuel, href: "/administrator/master/admin-other/api-integration/fuel-api-config" },
              ]
            },
            { title: "Company Profile", icon: Building2, href: "/administrator/master/admin-other/company-master" },
            { title: "Accounts Para Setup Master", icon: Settings, href: "/administrator/master/admin-other/acc-para-setup" },
            { title: "Copy Paste Menu", icon: ClipboardList, href: "/administrator/master/admin-other/copy-paste-menu" },
            { title: "Document Cancel/Uncancel", icon: FileX, href: "/administrator/master/admin-other/document-cancel-uncancel" },
            { title: "Document Print Setup Master", icon: Printer, href: "/administrator/master/admin-other/document-print-setup" },
            { title: "Financial Year Closing", icon: CalendarX, href: "/administrator/master/admin-other/financial-year-closing" },
            { title: "Financial Year Master", icon: CalendarDays, href: "/administrator/master/admin-other/financial-year" },
            { title: "Invoice Setup", icon: Receipt, href: "/administrator/master/admin-other/invoice-setup" },
            { title: "Menu Master", icon: Menu, href: "/administrator/master/admin-other/menu-master" },
            { title: "Module Lock", icon: Lock, href: "/administrator/master/admin-other/module-lock" },
            { title: "Parameter Configuration", icon: Settings, href: "/administrator/master/admin-other/parameters" },
            { title: "Parameter Setup", icon: Sliders, href: "/administrator/master/admin-other/parameter-setup" },
            { title: "Product Master", icon: BoxesIcon, href: "/administrator/master/admin-other/product-master" },
          ]
        },
        {
          title: "GST",
          icon: FileBarChart,
          children: [
            { title: "GST Category Master", icon: FolderTree, href: "/administrator/master/gst/gst-category" },
            { title: "GST Configuration Master", icon: Settings, href: "/administrator/master/gst/gst-configuration" },
            { title: "GST Exemption Category Master", icon: FileCheck, href: "/administrator/master/gst/gst-exemption-category" },
          ]
        },
        { title: "Print Copy Type Master", icon: Printer, href: "/administrator/master/print-copy-type" },
        {
          title: "SMS/Email",
          icon: Mail,
          children: [
            { title: "Email Template", icon: Mail, href: "/administrator/master/sms-email/email-template" },
            { title: "SMS Template Master", icon: MessageCircle, href: "/administrator/master/sms-email/sms-template" },
            { title: "SMS/Email Configuration", icon: Settings, href: "/administrator/master/sms-email/sms-email-config" },
            { title: "SMS/Email Master", icon: Mail, href: "/administrator/master/sms-email/sms-email-master" },
          ]
        },
        { title: "SQL Procedure Master", icon: Database, href: "/administrator/master/sql-procedure" },
        {
          title: "Stations",
          icon: Map,
          children: [
            { title: "Hub Office", icon: Building2, href: "/administrator/master/stations/hub-office" },
            { title: "Unschedule Delivery Points", icon: MapPin, href: "/administrator/master/stations/unschedule-delivery-points" },
            { title: "Agency Master", icon: Building2, href: "/administrator/master/stations/agency-master" },
            { title: "Branch Master", icon: Building2, href: "/administrator/master/stations/branch-master" },
            { title: "Zonal Master", icon: Map, href: "/administrator/master/stations/zonal-master" },
          ]
        },
        { title: "Tariff Master", icon: BarChart, href: "/administrator/master/tariff" },
        {
          title: "User & Rights",
          icon: ShieldCheck,
          children: [
            { title: "Right Assignment", icon: ShieldCheck, href: "/administrator/master/user-rights/right-assignment" },
            { title: "Role Master", icon: ShieldCheck, href: "/administrator/master/user-rights/role-master" },
            { title: "User Master", icon: Users, href: "/administrator/master/user-rights/user-master" },
          ]
        },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "Custom Report Builder", icon: BarChart3, href: "/administrator/reports/build-your-own-report" },
        // Moved from Tools section
        { title: "Audit Logs", icon: FileText, href: "/administrator/tools/audit-logs" },
        { title: "Year End Closing", icon: FileText, href: "/administrator/tools/year-end-closing" },
        { title: "Document Control", icon: FileText, href: "/administrator/tools/document-control" },
        { title: "Manifest Details", icon: FileText, href: "/administrator/tools/manifest-details" },
        { title: "Manifest Details New", icon: FileText, href: "/administrator/tools/manifest-details-new" },
      ],
    },
  ],
  Inventory: [
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "Stationery Purchase", icon: ShoppingCart, href: "/inventory/transaction/purchase" },
        { title: "HO Stock Register", icon: Building2, href: "/inventory/transaction/ho-stationery-stock" },
        { title: "Stock Despatch", icon: Truck, href: "/inventory/transaction/despatch" },
        { title: "Branch Stock Issue", icon: GitBranch, href: "/inventory/transaction/stock-issue" },
      ],
    },
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "Stationery Items", icon: BoxesIcon, href: "/inventory/master/items-web" },
        { title: "Materials", icon: PackagePlus, href: "/inventory/master/materials" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "Branch Stock Report", icon: BoxesIcon, href: "/inventory/reports/branch-stationery-stock" },
        { title: "Purchase Register", icon: FileText, href: "/inventory/reports/stationery-purchase-register" },
        // Moved from Tools section
        { title: "Coming Soon", icon: BoxesIcon, href: "/inventory/tools/coming-soon" },
      ],
    },
  ],
  Network: [
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "Inbound at Hub", icon: Package, href: "/network/workflow/inbound-hub" },
        { title: "Floor Allocation", icon: Layers, href: "/network/workflow/floor-allocation" },
        { title: "Digital Bagging", icon: PackagePlus, href: "/network/workflow/digital-bagging" },
        { title: "Bag Dispatch", icon: Send, href: "/network/workflow/bag-dispatch" },
        { title: "Cross Dock Entry", icon: Split, href: "/network/workflow/cross-dock" },
        {
          title: "Hub Transfer",
          icon: Truck,
          children: [
            { title: "Initiate Transfer", icon: Send, href: "/network/workflow/transfer/initiate" },
            { title: "Receive Transfer", icon: Package, href: "/network/workflow/transfer/receive" },
            { title: "Transfer History", icon: History, href: "/network/workflow/transfer/history" },
          ]
        },
        {
          title: "Load Planning",
          icon: ClipboardList,
          children: [
            { title: "Vehicle Loading", icon: Truck, href: "/network/workflow/load/vehicle" },
            { title: "Route Optimization", icon: Navigation, href: "/network/workflow/load/optimization" },
            { title: "Load Manifest", icon: FileText, href: "/network/workflow/load/manifest" },
          ]
        },
      ],
    },
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "Hubs", icon: Building, href: "/network/setup/hubs" },
        { title: "Spokes", icon: GitBranch, href: "/network/setup/spokes" },
        { title: "Pin Code Routing", icon: MapPinned, href: "/network/setup/pincode-routing" },
        { title: "Zone Configuration", icon: Map, href: "/network/setup/zone-configuration" },
        {
          title: "Route Master",
          icon: RouteIcon,
          children: [
            { title: "Primary Routes", icon: Navigation, href: "/network/setup/route-master/primary" },
            { title: "Alternate Routes", icon: GitMerge, href: "/network/setup/route-master/alternate" },
            { title: "Route Mapping", icon: Map, href: "/network/setup/route-master/mapping" },
          ]
        },
        {
          title: "Geofence Management",
          icon: Radar,
          children: [
            { title: "Hub Geofence", icon: Building, href: "/network/setup/geofence/hub" },
            { title: "Spoke Geofence", icon: MapPin, href: "/network/setup/geofence/spoke" },
            { title: "Geofence Rules", icon: Shield, href: "/network/setup/geofence/rules" },
          ]
        },
        {
          title: "Service Level Agreements (SLA)",
          icon: Clock,
          children: [
            { title: "Transit SLA", icon: Truck, href: "/network/setup/sla/transit" },
            { title: "Handling SLA", icon: Package, href: "/network/setup/sla/handling" },
            { title: "Delivery SLA", icon: Navigation, href: "/network/setup/sla/delivery" },
          ]
        },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "Hub Inventory Report", icon: BoxesIcon, href: "/network/insights/hub-inventory" },
        { title: "Network Flow Report", icon: TrendingUpIcon, href: "/network/insights/network-flow" },
        { title: "Geofence Alert Log", icon: AlertOctagon, href: "/network/insights/geofence-alerts" },
        {
          title: "Performance Metrics",
          icon: GaugeCircle,
          children: [
            { title: "Hub Performance", icon: Building, href: "/network/insights/performance/hub" },
            { title: "Route Performance", icon: RouteIcon, href: "/network/insights/performance/route" },
            { title: "SLA Compliance", icon: Clock, href: "/network/insights/performance/sla" },
          ]
        },
        {
          title: "Traffic Analytics",
          icon: ActivitySquare,
          children: [
            { title: "Volume Analysis", icon: BarChart, href: "/network/insights/traffic/volume" },
            { title: "Peak Hours", icon: Clock, href: "/network/insights/traffic/peak-hours" },
            { title: "Bottleneck Detection", icon: AlertTriangle, href: "/network/insights/traffic/bottlenecks" },
          ]
        },
        {
          title: "Real-time Monitoring",
          icon: Wifi,
          children: [
            { title: "Live Network Status", icon: Signal, href: "/network/insights/monitoring/status" },
            { title: "Hub Capacity", icon: Warehouse, href: "/network/insights/monitoring/capacity" },
            { title: "Vehicle Tracking", icon: Car, href: "/network/insights/monitoring/vehicles" },
          ]
        },
        // Moved from Tools section
        { title: "Bag Tracker", icon: Package, href: "/network/tools/bag-tracker" },
        { title: "Network Health Dashboard", icon: Activity, href: "/network/tools/health-dashboard" },
        { title: "Route Simulator", icon: Navigation, href: "/network/tools/route-simulator" },
        { title: "Capacity Planner", icon: BarChart3, href: "/network/tools/capacity-planner" },
        {
          title: "Cost Optimizer",
          icon: Calculator,
          children: [
            { title: "Route Cost Analysis", icon: DollarSign, href: "/network/tools/cost/route" },
            { title: "Hub Operating Cost", icon: Building, href: "/network/tools/cost/hub" },
            { title: "Optimization Suggestions", icon: TrendingUpIcon, href: "/network/tools/cost/suggestions" },
          ]
        },
        {
          title: "Network Simulator",
          icon: Cpu,
          children: [
            { title: "What-If Analysis", icon: GitBranch, href: "/network/tools/simulator/whatif" },
            { title: "Load Testing", icon: Activity, href: "/network/tools/simulator/load" },
            { title: "Disaster Recovery", icon: Shield, href: "/network/tools/simulator/disaster" },
          ]
        },
        {
          title: "Integration Tools",
          icon: Database,
          children: [
            { title: "API Logs", icon: FileText, href: "/network/tools/integration/api-logs" },
            { title: "Webhook Monitor", icon: Globe, href: "/network/tools/integration/webhooks" },
            { title: "Data Sync Status", icon: RefreshCw, href: "/network/tools/integration/sync" },
          ]
        },
      ],
    },
  ],
  Dashboard: [],
};

// Help & Support group - moved to last
const helpAndSupportGroup: NavGroup = {
  title: "Help & Support",
  icon: LifeBuoy,
  items: [
    { title: "Help Center", icon: LifeBuoy, href: "/help" },
    { title: "Support Tickets", icon: Ticket, href: "/help/tickets" },
    { title: "Audit Logs", icon: Scroll, href: "/help/logs" },
    { title: "Contact / Chat", icon: MessageCircle, href: "/contact" },
  ],
};

export function Sidebar({ open, toggleSidebar, selectedModule, onModuleSelect }: SidebarProps) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [openNestedDropdowns, setOpenNestedDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (title: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const toggleNestedDropdown = (title: string) => {
    setOpenNestedDropdowns(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Combine common groups with module-specific groups
  const moduleSpecificGroups = moduleNavGroups[selectedModule] || [];
  // Help & Support is added at the END
  const currentNavGroups = [...commonNavGroups, ...moduleSpecificGroups, helpAndSupportGroup];

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex w-80 flex-col border-r bg-background transition-transform duration-300",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex justify-between items-center border-b px-4 h-16">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Truck className="h-6 w-6 text-primary" />
          <span className="text-xl">CargoMax</span>
        </Link>

        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="overflow-auto py-2">
        {currentNavGroups.map((group) => (
          <div key={group.title} className="px-3 py-1">
            <button
              onClick={() => toggleDropdown(group.title)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-xs font-medium transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                openDropdowns[group.title] && "bg-accent/50"
              )}
            >
              <div className="flex items-center gap-3">
                <group.icon className="h-4 w-4" />
                <span>{group.title}</span>
              </div>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  openDropdowns[group.title] && "rotate-180"
                )}
              />
            </button>

            {openDropdowns[group.title] && (
              <div className="mt-1 ml-2 space-y-1 border-l-2 border-muted pl-2">
                <RenderNavItems
                  items={group.items}
                  pathname={pathname}
                  toggleSidebar={toggleSidebar}
                  level={0}
                  openDropdowns={openNestedDropdowns}
                  toggleNestedDropdown={toggleNestedDropdown}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}