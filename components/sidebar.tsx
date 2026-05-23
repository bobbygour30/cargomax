"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart,
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

  // ✅ Newly Added Icons
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

// Common groups that show on every module
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
  {
    title: "Help & Support",
    icon: LifeBuoy,
    items: [
      { title: "Help Center", icon: LifeBuoy, href: "/help" },
      { title: "Support Tickets", icon: Ticket, href: "/help/tickets" },
      { title: "Audit Logs", icon: Scroll, href: "/help/logs" },
      { title: "Contact / Chat", icon: MessageCircle, href: "/contact" },
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

// Module-specific navigation groups
const moduleNavGroups: Record<string, NavGroup[]> = {
  Operations: [
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "AGENCY COMMISSION MASTER", icon: Building2, href: "/operations/agency-commission" },
        { title: "COMMISSION CATEGORY MASTER", icon: BarChart, href: "/operations/commission-category" },
        { title: "CONSIGNMENT CHARGES MASTER", icon: Receipt, href: "/operations/consignment-charges" },
        { title: "CONSIGNOR CONSIGNEE MASTER", icon: Users, href: "/operations/consignor-consignee" },
        { title: "CREDIT NOTE REASON MASTER", icon: FileText, href: "/operations/credit-note-reason" },
        { title: "FREIGHT ON MASTER", icon: Truck, href: "/operations/freight-on" },
        { title: "GODOWN MASTER", icon: Warehouse, href: "/operations/godown-master" },
        { title: "LHC ENQUIRY", icon: Search, href: "/operations/lhc-enquiry" },
        { title: "MARKET VEHICLE MASTER", icon: Bus, href: "/operations/market-vehicle" },
        { title: "PACKING MASTER", icon: PackagePlus, href: "/operations/packing" },
        {
          title: "TRANSPORTATION MASTERS",
          icon: Truck,
          children: [
            { title: "DRIVER MASTER", icon: UserCog, href: "/operations/driver-master" },
          ]
        },
        { title: "VEHICLE GROUP MASTER", icon: FolderTree, href: "/operations/vehicle-group" },
        { title: "VEHICLE MANUFACTURE MASTER", icon: Building2, href: "/operations/vehicle-manufacture" },
        { title: "VEHICLE MASTER (NEW)", icon: Bus, href: "/operations/vehicles-new" },
        { title: "VEHICLE SUBGROUP MASTER", icon: GitBranch, href: "/operations/vehicle-subgroup" },
        { title: "VEHICLE TYPE MASTER", icon: Bus, href: "/operations/vehicle-type" },
        {
          title: "HUB CONFIGURATION",
          icon: Building,
          href: "/operations/hub-confi"
        },

        {
          title: "SPOKE CONFIGURATION",
          icon: Route,
          href: "/operations/spoke-confi"
        },

        {
          title: "PIN CODE MASTER",
          icon: MapPinned,
          href: "/operations/pincode-master"
        },
      ],
    },
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "BOOKING COMPUTERIZE GRL", icon: PlusSquare, href: "/operations/transaction/booking-computerize" },
        { title: "BOOKING GRL MANUAL", icon: FileText, href: "/operations/transaction/booking-grl-manual" },
        { title: "CHANGE VEHICLE IN MANIFEST", icon: Truck, href: "/operations/transaction/change-vehicle-in-manifest" },
        { title: "DDR", icon: FileText, href: "/operations/transaction/ddr" },
        { title: "DR CHARGE UPDATE", icon: DollarSign, href: "/operations/transaction/dr-charge-update" },
        { title: "GATE PASS ENTRY", icon: Navigation, href: "/operations/transaction/gate-pass" },
        { title: "GOODS ARRIVAL", icon: PackagePlus, href: "/operations/transaction/goods-arrival" },
        { title: "GR ENQUIRY", icon: ClipboardList, href: "/operations/transaction/gr-enquiry" },
        { title: "LOCAL MANIFEST", icon: Map, href: "/operations/transaction/local-manifest" },
        { title: "LONG ROUTE MANIFEST GRL", icon: Map, href: "/operations/transaction/long-route-manifest" },
        { title: "LORRY HIRE CHALLAN", icon: Truck, href: "/operations/transaction/lhc" },
        { title: "MANIFEST ENQUIRY", icon: Search, href: "/operations/transaction/manifest-enquiry" },
        { title: "PICKUP MANIFEST", icon: Map, href: "/operations/transaction/pickup-manifest" },
        { title: "POD ENTRY", icon: Receipt, href: "/operations/transaction/pod-entry" },
        { title: "POD UPLOAD", icon: Upload, href: "/operations/transaction/pod-upload" },
        {
          title: "ROUTE MERGE TOOL",
          icon: Merge,
          href: "/operations/transaction/route-merge-tool"
        },

        {
          title: "TRIP P&L CALCULATOR (INSIDE MANIFEST)",
          icon: Calculator,
          href: "/operations/transaction/trip-calculator"
        },

        {
          title: "MARKET VEHICLE PLACEMENT PORTAL",
          icon: Truck,
          href: "/operations/transaction/market-vehicle-placement"
        },

        {
          title: "RTO ENTRY (REVERSE LOGISTICS)",
          icon: RotateCcw,
          href: "/operations/transaction/rto-entry"
        },

        {
          title: "DETENTION ENTRY (AUTO-GENERATED BUT VIEWABLE)",
          icon: AlertTriangle,
          href: "/operations/transaction/detention-entry"
        },

      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "PENDING POD REPORT NEW", icon: Clock, href: "/operations/reports/pending-pod-new" },
        { title: "ARRIVAL REGISTER REPORT", icon: ClipboardList, href: "/operations/reports/arrival-register" },
        { title: "BOOKING OTHER CHARGES REPORT", icon: Receipt, href: "/operations/reports/booking-other-charges" },
        { title: "BOOKING SUMMARY AND DETAIL REPORT", icon: BarChart, href: "/operations/reports/booking-summary-detail" },
        { title: "BRANCH STOCK REPORT", icon: BoxesIcon, href: "/operations/reports/branch-stock" },
        { title: "BRANCH STOCK REPORT SUMMARY", icon: BarChart, href: "/operations/reports/branch-stock-summary" },
        { title: "DAILY SALES REPORT", icon: BarChart, href: "/operations/reports/daily-sales" },
        { title: "DAILY SALES REPORT (NEW)", icon: TrendingUp, href: "/operations/reports/daily-sales-new" },
        { title: "DELIVERY REGISTER REPORT", icon: ClipboardList, href: "/operations/reports/delivery-register" },
        { title: "DESPATCH REGISTER REPORT", icon: Truck, href: "/operations/reports/despatch-register" },
        { title: "DESTINATION WISE BOOKING SUMMARY REPORT", icon: Map, href: "/operations/reports/destination-wise-booking" },
        { title: "DRS REGISTER NEW REPORT", icon: FileText, href: "/operations/reports/drs-register-new" },
        { title: "GR REGISTER LX", icon: FileText, href: "/operations/reports/gr-register-lx" },
        { title: "LHC REPORT GRL", icon: Truck, href: "/operations/reports/lhc-report-grl" },
        { title: "LHC REPORT GRL NEW", icon: TrendingUp, href: "/operations/reports/lhc-report-grl-new" },
        { title: "LOADING TALLY", icon: ClipboardList, href: "/operations/reports/loading-tally" },
        { title: "POD NOT UPLOADED NEW", icon: AlertCircle, href: "/operations/reports/pod-not-uploaded" },
        { title: "POD REGISTER REPORT", icon: Receipt, href: "/operations/reports/pod-register" },
        { title: "SHORT / EXCESS REPORT", icon: AlertTriangle, href: "/operations/reports/short-excess" },
        { title: "UNDELIVERY REGISTER REPORT", icon: Clock, href: "/operations/reports/undelivery-register" },
        { title: "VEHICLE ARRIVAL REPORT", icon: Bus, href: "/operations/reports/vehicle-arrival" },
      ],
    },
    {
      title: "Tools",
      icon: Wrench,
      items: [
        { title: "GRL MANIFEST REPORT", icon: FileText, href: "/utilities/grl-manifest-report" },
        { title: "MANIFEST", icon: Map, href: "/utilities/manifest" },
      ],
    },
  ],
  Accounts: [
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "CUSTOMER", icon: Users, href: "/accounts/master/customers" },
        { title: "VENDOR", icon: Building2, href: "/accounts/master/vendor" },
        { title: "ACCOUNT GROUP", icon: FolderTree, href: "/accounts/master/main-group" },  //MAIN GROUP
        { title: "ACCOUNT SUB GROUP", icon: GitBranch, href: "/accounts/master/sub-group" },
        { title: "COST CENTER", icon: GitBranch, href: "/accounts/master/cost-center" },
        { title: "TDS CATEGORIES", icon: FileText, href: "/accounts/master/tds-category" },
        { title: "TDS SECTIONS", icon: FileText, href: "/accounts/master/tds-section" },
        { title: "TDS STATUSES", icon: FileCheck, href: "/accounts/master/tds-status" },
        {
          title: "CLIENT CREDIT PROFILES (ENHANCED)",
          icon: BadgeIndianRupee,
          href: "/accounts/master/client-credit-profiles"
        },

        {
          title: "TDS RULE ENGINE (SECTION 194C)",
          icon: FileSpreadsheet,
          href: "/accounts/master/tds-rule"
        },

      ],
    },
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "MONEY RECEIPT", icon: DollarSign, href: "/accounts/transaction/money-receipt" },
        { title: "REVERSE MONEY RECEIPT", icon: RotateCcw, href: "/accounts/transaction/reverse-mr" },
        { title: "BANK RECONCILIATION", icon: BarChart, href: "/accounts/transaction/bank-reconciliation" },
        { title: "FREIGHT MEMO PAYMENT", icon: Receipt, href: "/accounts/transaction/freight-memo-payment" },
        { title: "VENDOR BILL RECEIPT", icon: DollarSign, href: "/accounts/transaction/vendor-bill-receipt" },
        { title: "VENDOR BILL PASSING", icon: FileCheck, href: "/accounts/transaction/vendor-bill-passing" },
        { title: "VENDOR BILL PAYMENT", icon: Receipt, href: "/accounts/transaction/vendor-bill-payment" },
        { title: "VENDOR BILL SEARCH", icon: Search, href: "/accounts/transaction/vendor-bill-enquiry" },
        { title: "BILL SEARCH", icon: Search, href: "/accounts/transaction/bill-enquiry" },
        { title: "LHC ADVANCE PAYMENT", icon: Handshake, href: "/accounts/transaction/lhc-advance-payment" },
        { title: "LHC BALANCE PAYMENT", icon: PiggyBank, href: "/accounts/transaction/lhc-balance-payment" },
        { title: "FUND TRANSFER", icon: Landmark, href: "/accounts/transaction/fund-transfer" },
        { title: "FUND TRANSFER APPROVAL", icon: ShieldCheck, href: "/accounts/transaction/fund-transfer-approval" },
        { title: "ACCOUNT ADJUSTMENT", icon: RotateCcw, href: "/accounts/transaction/on-ac-adjustment" },
        { title: "OPERATIONAL EXPENSE", icon: PiggyBank, href: "/accounts/transaction/operational-expense" },
        { title: "VENDOR EXPENSE ENTRY", icon: PiggyBank, href: "/accounts/transaction/vendor-operational-expense" },
        // { title: "UPDATE LEDGER OP BALANCE", icon: FileText, href: "/accounts/transaction/update-ledger-op-balance" },
        { title: "BANK RECONCILIATION", icon: FileText, href: "/accounts/transaction/" },
        { title: "VOUCHER ENTRY", icon: ClipboardList, href: "/accounts/transaction/voucher" },
        { title: "TDS RATE SETUP", icon: FileText, href: "/accounts/transaction/tds-rate" },
        {
          title: "DETENTION DEBIT NOTES",
          icon: FileWarning,
          href: "/accounts/transaction/detention-debit-notes"
        },

        {
          title: "DRIVER ADVANCE WALLET",
          icon: Wallet,
          href: "/accounts/transaction/driver-advance-wallet"
        },

        {
          title: "FASTAG RECONCILIATION",
          icon: CreditCard,
          href: "/accounts/transaction/fastag-reconciliation"
        },

        {
          title: "INTERNAL DAMAGE LEDGER",
          icon: Shield,
          href: "/accounts/transaction/internal-damage-ledger"
        },

        {
          title: "RTO BILLING",
          icon: ReceiptText,
          href: "/accounts/transaction/rto-billing"
        },


      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "DAY BOOK", icon: BookOpen, href: "/accounts/reports/day-book" },
        { title: "CASH REPORT", icon: IndianRupee, href: "/accounts/reports/cash" },
        { title: "LEDGER REPORT", icon: FileSpreadsheet, href: "/accounts/reports/ledger" },
        { title: "BILL REGISTER", icon: ReceiptText, href: "/accounts/reports/bill-register-gr-wise" },
        { title: "BILLED VS UNBILLED", icon: ReceiptText, href: "/accounts/reports/" },
        { title: "BILLED UNBILLED COUNTERS", icon: FileCheck, href: "/accounts/reports/billed-unbilled-counters" },
        { title: "CASH AND BANK REGISTER", icon: IndianRupee, href: "/accounts/reports/cash-bank-mr-register" },
        { title: "GST 1R REPORT", icon: FileBarChart, href: "/accounts/reports/gst-1r" },
        { title: "VENDOR BILL REGISTER", icon: FileOutput, href: "/accounts/reports/vendor-bill-register" },
        { title: "FUNDS TRANSFER REGISTER", icon: Landmark, href: "/accounts/reports/funds-transfer" },
        // { title: "FINANCIAL MIS", icon: BookOpen, href: "/accounts/reports/financial-mis" },
        // { title: "LHC PENDING PAYMENT REPORTS", icon: FileSpreadsheet, href: "/accounts/reports/lhc-pending-payment-reports" },
        // { title: "VENDOR OUTSTANDING AGEING REPORT", icon: FileOutput, href: "/accounts/reports/vendor-outstanding-ageing" },
        // { title: "VENDOR OUTSTANDING AGEING REPORT NEW", icon: FileOutput, href: "/accounts/reports/vendor-outstanding-new" },
        // { title: "VENDOR OUTSTANDING PAYMENT REPORT", icon: FileOutput, href: "/accounts/reports/vendor-outstanding-payment-reports" },


      ],
    },
    {
      title: "Tools",
      icon: Wrench,
      items: [
        { title: "COMMING SOON", icon: BookOpen, href: "/accounts/reports/" },
      ],
    },
  ],
  Administrator: [
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        { title: "ACTIVATE DEACTIVATE USER", icon: UserCog, href: "/administrator/master/activate-deactivate-user" },
        {
          title: "SYSTEM CONFIG",
          icon: Settings,
          children: [
            {
              title: "API INTERGRATION LAYER",
              icon: Database,
              children: [
                {
                  title: "GST/NIC E-WAY BILL API CONFIG",
                  icon: FileBarChart,
                  href: "/administrator/master/admin-other/api-integration/gst-nic-config"
                },
                {
                  title: "VAHAN/SARATHI API CONFIG",
                  icon: Car,
                  href: "/administrator/master/admin-other/api-integration/vahan-sarathi-config"
                },
                {
                  title: "FASTAG API CONFIG",
                  icon: CreditCard,
                  href: "/administrator/master/admin-other/api-integration/fastag-api-config"
                },
                {
                  title: "WHATSAPP BUSINESS API CONFIG",
                  icon: MessageSquare,
                  href: "/administrator/master/admin-other/api-integration/whatsapp-api-config"
                },
                {
                  title: "FUEL CARD API CONFIG",
                  icon: Fuel,
                  href: "/administrator/master/admin-other/api-integration/fuel-api-config"
                },
              ]
            },
            { title: "COMPANY Profile", icon: Building2, href: "/administrator/master/admin-other/company-master" },
            { title: "ACC PARA SETUP MASTER", icon: Settings, href: "/administrator/master/admin-other/acc-para-setup" },
            { title: "COPY PASTE MENU", icon: ClipboardList, href: "/administrator/master/admin-other/copy-paste-menu" },
            { title: "DOCUMENT CANCEL/UNCANCEL", icon: FileX, href: "/administrator/master/admin-other/document-cancel-uncancel" },
            { title: "DOCUMENT PRINT SETUP MASTER", icon: Printer, href: "/administrator/master/admin-other/document-print-setup" },
            { title: "FINANCIAL YEAR CLOSING", icon: CalendarX, href: "/administrator/master/admin-other/financial-year-closing" },
            { title: "FINANCIAL YEAR MASTER", icon: CalendarDays, href: "/administrator/master/admin-other/financial-year" },
            { title: "INVOICE SETUP", icon: Receipt, href: "/administrator/master/admin-other/invoice-setup" },
            { title: "MENU MASTER", icon: Menu, href: "/administrator/master/admin-other/menu-master" },
            { title: "MODULE LOCK", icon: Lock, href: "/administrator/master/admin-other/module-lock" },
            { title: "PARAMETER CONFIGURATION", icon: Settings, href: "/administrator/master/admin-other/parameters" },
            { title: "PARAMETER SETUP", icon: Sliders, href: "/administrator/master/admin-other/parameter-setup" },
            { title: "PRODUCT MASTER", icon: BoxesIcon, href: "/administrator/master/admin-other/product-master" },

          ]
        },
        {
          title: "GST",
          icon: FileBarChart,
          children: [
            { title: "GST CATEGORY MASTER", icon: FolderTree, href: "/administrator/master/gst/gst-category" },
            { title: "GST CONFIGURATION MASTER", icon: Settings, href: "/administrator/master/gst/gst-configuration" },
            { title: "GST EXEMPTION CATEGORY MASTER", icon: FileCheck, href: "/administrator/master/gst/gst-exemption-category" },
          ]
        },
        { title: "PRINT COPY TYPE MASTER", icon: Printer, href: "/administrator/master/print-copy-type" },
        {
          title: "SMS/EMAIL",
          icon: Mail,
          children: [
            { title: "EMAIL TEMPLATE", icon: Mail, href: "/administrator/master/sms-email/email-template" },
            { title: "SMS TEMPLATE MASTER", icon: MessageCircle, href: "/administrator/master/sms-email/sms-template" },
            { title: "SMS/EMAIL CONFIGURATION", icon: Settings, href: "/administrator/master/sms-email/sms-email-config" },
            { title: "SMS/EMAIL MASTER", icon: Mail, href: "/administrator/master/sms-email/sms-email-master" },
          ]
        },
        { title: "SQL PROCEDURE MASTER", icon: Database, href: "/administrator/master/sql-procedure" },
        {
          title: "STATIONS",
          icon: Map,
          children: [
            { title: "HUB OFFICE", icon: Building2, href: "/administrator/master/stations/hub-office" },
            { title: "UNSCHEDULE DELIVERY POINTS", icon: MapPin, href: "/administrator/master/stations/unschedule-delivery-points" },
            { title: "AGENCY MASTER", icon: Building2, href: "/administrator/master/stations/agency-master" },
            { title: "BRANCH MASTER", icon: Building2, href: "/administrator/master/stations/branch-master" },
            { title: "ZONAL MASTER", icon: Map, href: "/administrator/master/stations/zonal-master" },
          ]
        },
        { title: "TARIFF MASTER", icon: BarChart, href: "/administrator/master/tariff" },
        {
          title: "USER & RIGHTS",
          icon: ShieldCheck,
          children: [
            { title: "RIGHT ASSIGNMENT", icon: ShieldCheck, href: "/administrator/master/user-rights/right-assignment" },
            { title: "ROLE MASTER", icon: ShieldCheck, href: "/administrator/master/user-rights/role-master" },
            { title: "USER MASTER", icon: Users, href: "/administrator/master/user-rights/user-master" },
          ]
        },
      ],
    },
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "MRN TYPE", icon: FileText, href: "/administrator/transaction/mrn-type-master" },
        { title: "QUERY BUILDER", icon: Database, href: "/administrator/transaction/query-builder" },
        { title: "RESET DATA", icon: RotateCcw, href: "/administrator/transaction/reset-data" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "CUSTOM REPORT BUILDER", icon: BarChart3, href: "/administrator/reports/build-your-own-report" },
      ],
    },
    {
      title: "Tools",
      icon: Wrench,
      items: [
        { title: "AUDIT LOGS", icon: FileText, href: "/admin/" },
        { title: "YEAR-END CLOSING", icon: FileText, href: "/admin/" },
        { title: "DOCUMENT CONTROL", icon: FileText, href: "/admin/" },
        { title: "MANIFEST DETAIL'S", icon: FileText, href: "/admin/manifest-details" },
        { title: "MANIFEST DETAIL'S NEW", icon: FileText, href: "/admin/manifest-details-new" },
      ],
    },
  ],
  Inventory: [
    {
      title: "Setup",
      icon: FolderTree,
      items: [
        // { title: "MATERIALS", icon: PackagePlus, href: "/inventory/master/" },
        { title: "STATIONERY ITEMS", icon: BoxesIcon, href: "/inventory/master/items-web" },
        { title: "MATERIALS", icon: PackagePlus, href: "/inventory/master/materials" },
      ],
    },
    {
      title: "Workflow",
      icon: ClipboardList,
      items: [
        { title: "STATIONERY PURCHASE", icon: ShoppingCart, href: "/inventory/transaction/purchase" },
        { title: "HO STOCK REGISTER", icon: Building2, href: "/inventory/transaction/ho-stationery-stock" },
        { title: "STOCK DESPATCH", icon: Truck, href: "/inventory/transaction/despatch" },
        { title: "BRANCH STOCK ISSUE", icon: GitBranch, href: "/inventory/transaction/stock-issue" },
        // { title: "ITEM DESPATCH RECEIVE", icon: Truck, href: "/inventory/transaction/item-despatch-receive" },
      ],
    },
    {
      title: "Reports",
      icon: BarChart3,
      items: [
        { title: "BRANCH STOCK REPORT", icon: BoxesIcon, href: "/inventory/reports/branch-stationery-stock" },
        { title: "PURCHASE REGISTER", icon: FileText, href: "/inventory/reports/stationery-purchase-register" },
      ],
    },
    {
      title: "Tools",
      icon: Wrench,
      items: [
        // Field is empty as per requirements
        { title: "COMMING SOON", icon: BoxesIcon, href: "/inventory/reports/" },

      ],
    },
  ],
  Dashboard: [],
  "Help & Support": [],
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
  const currentNavGroups = [...commonNavGroups, ...moduleSpecificGroups];

  return (
    <div
      className={cn(
        // Increased sidebar width from w-64 (16rem/256px) to w-80 (20rem/320px)
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

// Also update the main layout file to use the new width (ml-80 instead of ml-64)
// In your DashboardShellClient.tsx, update the ml class:
// <div className="flex flex-1 flex-col ml-0 lg:ml-80">