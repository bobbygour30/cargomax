// app/operations/transaction/rto-entry/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  Save,
  RefreshCw,
  Search,
  Printer,
  FileText,
  Eye,
  X,
  Check,
  Truck,
  MapPin,
  User,
  Phone,
  Building,
  Clock,
  Edit,
  PlusCircle,
  Trash2,
  Package,
  Weight,
  FileSpreadsheet,
  Calculator,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Plus,
  History,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Fuel,
  Receipt,
  Users,
  Wrench,
  CreditCard,
  PieChart,
  Navigation,
  Flag,
  Circle,
  Map,
  Route,
  ArrowLeftRight,
  Layers,
  GitMerge,
  RotateCcw,
  FileWarning,
  Shield,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface RTORecord {
  id: number;
  rtoId: string;
  vehicleNo: string;
  driverName: string;
  driverContact: string;
  returnDate: Date;
  returnTime: string;
  originLocation: string;
  destinationLocation: string;
  reasonForReturn: string;
  returnType: "damage" | "misrouted" | "customer_return" | "undelivered" | "other";
  manifestNo: string;
  grNo: string;
  originalDestination: string;
  returnCharge: number;
  penaltyAmount: number;
  compensationAmount: number;
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "partially_paid";
  paymentMode: string;
  transactionId: string;
  remarks: string;
  documents: string[];
  status: "initiated" | "in_transit" | "received" | "completed" | "cancelled";
  processedBy: string;
  processedDate: Date;
  approvedBy: string;
  approvedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface DamageDetail {
  id: number;
  rtoId: string;
  itemName: string;
  damageType: string;
  severity: "low" | "medium" | "high" | "critical";
  estimatedCost: number;
  actualCost: number;
  remarks: string;
}

interface ReturnHistory {
  id: number;
  historyId: string;
  rtoId: string;
  action: string;
  status: string;
  remarks: string;
  performedBy: string;
  actionDate: Date;
}

// Options
const returnReasonOptions = [
  { value: "damage", label: "Goods Damaged", icon: "⚠️" },
  { value: "misrouted", label: "Misrouted Shipment", icon: "🔄" },
  { value: "customer_return", label: "Customer Return", icon: "🏠" },
  { value: "undelivered", label: "Undelivered", icon: "❌" },
  { value: "other", label: "Other", icon: "📝" }
];

const damageTypeOptions = [
  "Physical Damage", "Water Damage", "Theft/Loss", "Package Opened",
  "Wrong Item", "Expired", "Temperature Damage", "Other"
];

const severityOptions = [
  { value: "low", label: "Low", color: "bg-green-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" }
];

const paymentModeOptions = ["Cash", "Cheque", "Bank Transfer", "UPI", "Credit Card"];
const locationOptions = [
  "DELHI", "MUMBAI", "BANGALORE", "CHENNAI", "KOLKATA",
  "AHMEDABAD", "PUNE", "HYDERABAD", "JAIPUR", "LUCKNOW"
];

// Sample Data
const sampleRTOs: RTORecord[] = [
  { id: 1, rtoId: "RTO001", vehicleNo: "UP14AB1234", driverName: "Rajesh Kumar", driverContact: "9876543210", returnDate: new Date("2026-05-28"), returnTime: "10:30", originLocation: "DELHI", destinationLocation: "MUMBAI", reasonForReturn: "damage", returnType: "damage", manifestNo: "M001", grNo: "GR001", originalDestination: "MUMBAI", returnCharge: 5000, penaltyAmount: 2000, compensationAmount: 10000, totalAmount: 17000, paymentStatus: "pending", paymentMode: "", transactionId: "", remarks: "Goods damaged during transit", documents: [], status: "initiated", processedBy: "", processedDate: new Date(), approvedBy: "", approvedDate: new Date(), createdAt: new Date(), updatedAt: new Date() },
  { id: 2, rtoId: "RTO002", vehicleNo: "UP15CD5678", driverName: "Suresh Singh", driverContact: "9876543220", returnDate: new Date("2026-05-29"), returnTime: "14:15", originLocation: "MUMBAI", destinationLocation: "BANGALORE", reasonForReturn: "misrouted", returnType: "misrouted", manifestNo: "M002", grNo: "GR002", originalDestination: "CHENNAI", returnCharge: 3000, penaltyAmount: 1000, compensationAmount: 0, totalAmount: 4000, paymentStatus: "paid", paymentMode: "Bank Transfer", transactionId: "TXN001", remarks: "Wrong destination", documents: [], status: "completed", processedBy: "Admin", processedDate: new Date(), approvedBy: "Manager", approvedDate: new Date(), createdAt: new Date(), updatedAt: new Date() },
];

const sampleHistory: ReturnHistory[] = [
  { id: 1, historyId: "H001", rtoId: "RTO001", action: "RTO Initiated", status: "initiated", remarks: "Return request created", performedBy: "Admin", actionDate: new Date("2026-05-28") },
  { id: 2, historyId: "H002", rtoId: "RTO001", action: "In Transit", status: "in_transit", remarks: "Vehicle enroute to origin", performedBy: "Driver", actionDate: new Date("2026-05-29") },
];

export default function RTOEntry() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"active" | "history">("active");
  
  // Sheet state
  const [isRTOSheetOpen, setIsRTOSheetOpen] = useState(false);
  const [isDamageSheetOpen, setIsDamageSheetOpen] = useState(false);
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<number | null>(null);
  const [selectedRTO, setSelectedRTO] = useState<RTORecord | null>(null);
  
  // RTO Form state
  const [rtoId, setRtoId] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [driverContact, setDriverContact] = useState<string>("");
  const [returnDate, setReturnDate] = useState<Date>(new Date());
  const [returnTime, setReturnTime] = useState<string>("");
  const [originLocation, setOriginLocation] = useState<string>("");
  const [destinationLocation, setDestinationLocation] = useState<string>("");
  const [reasonForReturn, setReasonForReturn] = useState<string>("");
  const [returnType, setReturnType] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [grNo, setGrNo] = useState<string>("");
  const [originalDestination, setOriginalDestination] = useState<string>("");
  const [returnCharge, setReturnCharge] = useState<number>(0);
  const [penaltyAmount, setPenaltyAmount] = useState<number>(0);
  const [compensationAmount, setCompensationAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<string>("pending");
  const [paymentMode, setPaymentMode] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [status, setStatus] = useState<string>("initiated");
  
  // Damage Details
  const [damageDetails, setDamageDetails] = useState<DamageDetail[]>([]);
  const [damageItem, setDamageItem] = useState<string>("");
  const [damageType, setDamageType] = useState<string>("");
  const [damageSeverity, setDamageSeverity] = useState<string>("");
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [actualCost, setActualCost] = useState<number>(0);
  const [damageRemarks, setDamageRemarks] = useState<string>("");
  const [editingDamageId, setEditingDamageId] = useState<number | null>(null);
  
  // Search state
  const [searchRTOs, setSearchRTOs] = useState<RTORecord[]>([]);
  const [searchHistory, setSearchHistory] = useState<ReturnHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchReason, setSearchReason] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  
  const [rtos, setRtos] = useState<RTORecord[]>(sampleRTOs);
  const [returnHistory, setReturnHistory] = useState<ReturnHistory[]>(sampleHistory);
  const [loading, setLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    setSearchRTOs(rtos);
    setSearchHistory(returnHistory);
  }, []);

  // Calculate total amount
  const calculateTotal = () => {
    const total = returnCharge + penaltyAmount + compensationAmount;
    setTotalAmount(total);
    return total;
  };

  // Damage Details CRUD
  const handleAddDamage = () => {
    if (!damageItem) {
      alert("Please enter item name");
      return;
    }
    
    const newDamage: DamageDetail = {
      id: editingDamageId || Date.now(),
      rtoId: rtoId,
      itemName: damageItem,
      damageType: damageType,
      severity: damageSeverity as any,
      estimatedCost: estimatedCost,
      actualCost: actualCost,
      remarks: damageRemarks,
    };
    
    if (editingDamageId) {
      setDamageDetails(damageDetails.map(d => d.id === editingDamageId ? newDamage : d));
      setEditingDamageId(null);
    } else {
      setDamageDetails([...damageDetails, newDamage]);
    }
    
    resetDamageForm();
  };

  const handleEditDamage = (damage: DamageDetail) => {
    setEditingDamageId(damage.id);
    setDamageItem(damage.itemName);
    setDamageType(damage.damageType);
    setDamageSeverity(damage.severity);
    setEstimatedCost(damage.estimatedCost);
    setActualCost(damage.actualCost);
    setDamageRemarks(damage.remarks);
    setIsDamageSheetOpen(true);
  };

  const handleRemoveDamage = (id: number) => {
    if (confirm("Are you sure you want to remove this damage item?")) {
      setDamageDetails(damageDetails.filter(d => d.id !== id));
    }
  };

  const resetDamageForm = () => {
    setDamageItem("");
    setDamageType("");
    setDamageSeverity("");
    setEstimatedCost(0);
    setActualCost(0);
    setDamageRemarks("");
    setIsDamageSheetOpen(false);
    setEditingDamageId(null);
  };

  // RTO CRUD
  const handleAddRTO = () => {
    if (!vehicleNo || !driverName || !originLocation || !destinationLocation) {
      alert("Please fill required fields");
      return;
    }
    
    const newRTO: RTORecord = {
      id: currentEditId || Date.now(),
      rtoId: rtoId || `RTO${String(rtos.length + 1).padStart(3, "0")}`,
      vehicleNo,
      driverName,
      driverContact,
      returnDate,
      returnTime,
      originLocation,
      destinationLocation,
      reasonForReturn,
      returnType: reasonForReturn as any,
      manifestNo,
      grNo,
      originalDestination,
      returnCharge,
      penaltyAmount,
      compensationAmount,
      totalAmount: calculateTotal(),
      paymentStatus: paymentStatus as any,
      paymentMode,
      transactionId,
      remarks,
      documents: [],
      status: status as any,
      processedBy: editMode ? (rtos.find(r => r.id === currentEditId)?.processedBy || "") : "",
      processedDate: editMode ? (rtos.find(r => r.id === currentEditId)?.processedDate || new Date()) : new Date(),
      approvedBy: "",
      approvedDate: new Date(),
      createdAt: editMode ? (rtos.find(r => r.id === currentEditId)?.createdAt || new Date()) : new Date(),
      updatedAt: new Date(),
    };
    
    if (editMode && currentEditId) {
      setRtos(rtos.map(r => r.id === currentEditId ? newRTO : r));
      alert("RTO record updated successfully!");
    } else {
      setRtos([...rtos, newRTO]);
      
      // Add to history
      const newHistory: ReturnHistory = {
        id: returnHistory.length + 1,
        historyId: `H${String(returnHistory.length + 1).padStart(3, "0")}`,
        rtoId: newRTO.rtoId,
        action: "RTO Initiated",
        status: "initiated",
        remarks: "Return request created",
        performedBy: "MAYANK.GRLOGISTICS@GMAIL.COM",
        actionDate: new Date(),
      };
      setReturnHistory([newHistory, ...returnHistory]);
      alert("RTO record saved successfully!");
    }
    
    resetRTOForm();
    setIsRTOSheetOpen(false);
    setSearchRTOs(rtos);
  };

  const handleEditRTO = (rto: RTORecord) => {
    setEditMode(true);
    setCurrentEditId(rto.id);
    setRtoId(rto.rtoId);
    setVehicleNo(rto.vehicleNo);
    setDriverName(rto.driverName);
    setDriverContact(rto.driverContact);
    setReturnDate(rto.returnDate);
    setReturnTime(rto.returnTime);
    setOriginLocation(rto.originLocation);
    setDestinationLocation(rto.destinationLocation);
    setReasonForReturn(rto.reasonForReturn);
    setReturnType(rto.returnType);
    setManifestNo(rto.manifestNo);
    setGrNo(rto.grNo);
    setOriginalDestination(rto.originalDestination);
    setReturnCharge(rto.returnCharge);
    setPenaltyAmount(rto.penaltyAmount);
    setCompensationAmount(rto.compensationAmount);
    setTotalAmount(rto.totalAmount);
    setPaymentStatus(rto.paymentStatus);
    setPaymentMode(rto.paymentMode);
    setTransactionId(rto.transactionId);
    setRemarks(rto.remarks);
    setStatus(rto.status);
    setIsRTOSheetOpen(true);
  };

  const handleUpdateStatus = (rto: RTORecord, newStatus: string) => {
    if (confirm(`Update status to ${newStatus} for RTO ${rto.rtoId}?`)) {
      const updatedRTOs = rtos.map(r => 
        r.id === rto.id ? { ...r, status: newStatus as any, updatedAt: new Date() } : r
      );
      setRtos(updatedRTOs);
      setSearchRTOs(updatedRTOs);
      
      const newHistory: ReturnHistory = {
        id: returnHistory.length + 1,
        historyId: `H${String(returnHistory.length + 1).padStart(3, "0")}`,
        rtoId: rto.rtoId,
        action: `Status Updated to ${newStatus}`,
        status: newStatus,
        remarks: `RTO status changed from ${rto.status} to ${newStatus}`,
        performedBy: "MAYANK.GRLOGISTICS@GMAIL.COM",
        actionDate: new Date(),
      };
      setReturnHistory([newHistory, ...returnHistory]);
      alert(`Status updated to ${newStatus}`);
    }
  };

  const handleDeleteRTO = (id: number) => {
    if (confirm("Are you sure you want to delete this RTO record?")) {
      setRtos(rtos.filter(r => r.id !== id));
      setSearchRTOs(rtos.filter(r => r.id !== id));
      alert("RTO record deleted successfully!");
    }
  };

  const handleViewHistory = (rto: RTORecord) => {
    setSelectedRTO(rto);
    const history = returnHistory.filter(h => h.rtoId === rto.rtoId);
    setSearchHistory(history);
    setIsHistorySheetOpen(true);
  };

  const handleSearch = () => {
    let results = rtos;
    if (searchTerm) {
      results = results.filter(r => 
        r.rtoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (searchStatus !== "all") {
      results = results.filter(r => r.status === searchStatus);
    }
    if (searchReason !== "all") {
      results = results.filter(r => r.reasonForReturn === searchReason);
    }
    setSearchRTOs(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchStatus("all");
    setSearchReason("all");
    setSearchRTOs(rtos);
    setCurrentPage(1);
  };

  const resetRTOForm = () => {
    setRtoId("");
    setVehicleNo("");
    setDriverName("");
    setDriverContact("");
    setReturnDate(new Date());
    setReturnTime("");
    setOriginLocation("");
    setDestinationLocation("");
    setReasonForReturn("");
    setReturnType("");
    setManifestNo("");
    setGrNo("");
    setOriginalDestination("");
    setReturnCharge(0);
    setPenaltyAmount(0);
    setCompensationAmount(0);
    setTotalAmount(0);
    setPaymentStatus("pending");
    setPaymentMode("");
    setTransactionId("");
    setRemarks("");
    setStatus("initiated");
    setDamageDetails([]);
    setEditMode(false);
    setCurrentEditId(null);
  };

  // Stats
  const stats = {
    totalRTOs: rtos.length,
    pending: rtos.filter(r => r.status === "initiated").length,
    inTransit: rtos.filter(r => r.status === "in_transit").length,
    completed: rtos.filter(r => r.status === "completed").length,
    totalAmount: rtos.reduce((sum, r) => sum + r.totalAmount, 0),
    pendingPayment: rtos.filter(r => r.paymentStatus === "pending").reduce((sum, r) => sum + r.totalAmount, 0),
  };

  // Pagination
  const totalPages = Math.ceil(searchRTOs.length / itemsPerPage);
  const paginatedRTOs = searchRTOs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      initiated: { label: "Initiated", color: "bg-blue-100 text-blue-700" },
      in_transit: { label: "In Transit", color: "bg-yellow-100 text-yellow-700" },
      received: { label: "Received", color: "bg-purple-100 text-purple-700" },
      completed: { label: "Completed", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.initiated;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case "paid": return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case "partially_paid": return <Badge className="bg-yellow-100 text-yellow-700">Partially Paid</Badge>;
      default: return <Badge className="bg-red-100 text-red-700">Pending</Badge>;
    }
  };

  const getReasonIcon = (reason: string) => {
    const found = returnReasonOptions.find(r => r.value === reason);
    return found?.icon || "📝";
  };

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">RTO ENTRY (REVERSE LOGISTICS)</h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={() => { resetRTOForm(); setIsRTOSheetOpen(true); }} size="default" className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="mr-2 h-4 w-4" />
            New RTO Entry
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">Total RTOs</p><p className="text-xl font-bold">{stats.totalRTOs}</p></CardContent></Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">Initiated</p><p className="text-xl font-bold">{stats.pending}</p></CardContent></Card>
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">In Transit</p><p className="text-xl font-bold">{stats.inTransit}</p></CardContent></Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">Completed</p><p className="text-xl font-bold">{stats.completed}</p></CardContent></Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">Total Amount</p><p className="text-xl font-bold">₹{stats.totalAmount.toLocaleString()}</p></CardContent></Card>
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white"><CardContent className="p-3"><p className="text-[10px] opacity-90">Pending Payment</p><p className="text-xl font-bold">₹{stats.pendingPayment.toLocaleString()}</p></CardContent></Card>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b bg-white rounded-t-lg">
        <button onClick={() => setMainTab("active")} className={cn("px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2", mainTab === "active" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}><ClipboardList className="h-4 w-4" />RTO Records</button>
        <button onClick={() => setMainTab("history")} className={cn("px-6 py-2.5 text-sm font-medium transition-all rounded-t-lg flex items-center gap-2", mainTab === "history" ? "bg-green-600 text-white shadow-md" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100")}><History className="h-4 w-4" />History</button>
      </div>

      {/* RTO Records Tab */}
      {mainTab === "active" && (
        <>
          <Card><CardHeader className="pb-3"><CardTitle className="text-[11px] font-semibold flex items-center gap-2"><Search className="h-3.5 w-3.5" />Search RTO Records</CardTitle></CardHeader>
          <CardContent><div className="grid grid-cols-1 sm:grid-cols-4 gap-3"><Input placeholder="Search by RTO ID, Vehicle #, Driver..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8 text-xs" /><Select value={searchStatus} onValueChange={setSearchStatus}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="initiated">Initiated</SelectItem><SelectItem value="in_transit">In Transit</SelectItem><SelectItem value="received">Received</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select><Select value={searchReason} onValueChange={setSearchReason}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Reason" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{returnReasonOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select><div className="flex gap-2"><Button onClick={handleSearch} size="sm" className="h-8 text-xs bg-blue-600"><Search className="h-3 w-3 mr-1" />Search</Button><Button onClick={handleClearSearch} variant="outline" size="sm" className="h-8 text-xs"><RefreshCw className="h-3 w-3" /></Button></div></div></CardContent></Card>

          <Card><CardHeader className="pb-2"><div className="flex justify-between items-center"><div className="gap-2 w-full">
                        <Table className="text-gray-500" />
                        <h3 className="text-[15px] font-semibold text-gray-800">RTO Records List</h3></div><div className="text-[10px] text-gray-500">Total: {searchRTOs.length} records</div></div></CardHeader>
          <CardContent><div className="rounded-md border overflow-x-auto"><div className="min-w-[1100px]"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px] w-12">#</TableHead><TableHead className="text-[11px]">RTO ID</TableHead><TableHead className="text-[11px]">Vehicle #</TableHead><TableHead className="text-[11px]">Driver</TableHead><TableHead className="text-[11px]">Return Date</TableHead><TableHead className="text-[11px]">Reason</TableHead><TableHead className="text-[11px] text-right">Amount</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Payment</TableHead><TableHead className="text-[11px] w-32">Actions</TableHead></TableRow></TableHeader>
          <TableBody>{paginatedRTOs.map((r, idx) => (<TableRow key={r.id}><TableCell className="text-center text-xs">{(currentPage-1)*itemsPerPage+idx+1}</TableCell><TableCell className="font-mono text-xs">{r.rtoId}</TableCell><TableCell className="text-xs">{r.vehicleNo}</TableCell><TableCell className="text-xs">{r.driverName}</TableCell><TableCell className="text-xs">{format(r.returnDate, "dd-MM-yyyy")}</TableCell><TableCell><span className="text-sm mr-1">{getReasonIcon(r.reasonForReturn)}</span>{returnReasonOptions.find(opt => opt.value === r.reasonForReturn)?.label}</TableCell><TableCell className="text-right text-xs">₹{r.totalAmount.toLocaleString()}</TableCell><TableCell>{getStatusBadge(r.status)}</TableCell><TableCell>{getPaymentStatusBadge(r.paymentStatus)}</TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="sm" onClick={() => handleEditRTO(r)} className="h-7 w-7 p-0 text-blue-500"><Edit className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleViewHistory(r)} className="h-7 w-7 p-0 text-purple-500"><History className="h-3.5 w-3.5" /></Button><Button variant="ghost" size="sm" onClick={() => handleDeleteRTO(r.id)} className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button></div></TableCell></TableRow>))}</TableBody></Table></div></div>
          {totalPages > 1 && (<div className="flex justify-center gap-1 mt-4"><Button variant="outline" size="sm" onClick={() => goToPage(currentPage-1)} disabled={currentPage===1} className="h-7 text-[10px]">Previous</Button><span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span><Button variant="outline" size="sm" onClick={() => goToPage(currentPage+1)} disabled={currentPage===totalPages} className="h-7 text-[10px]">Next</Button></div>)}</CardContent></Card>
        </>
      )}

      {/* History Tab */}
      {mainTab === "history" && (
        <Card><CardHeader className="pb-2"><div className="flex justify-between items-center"><div className="flex items-center gap-2"><History className="h-3.5 w-3.5 text-gray-500" /><h3 className="text-[15px] font-semibold">RTO History</h3></div><div className="text-[10px] text-gray-500">Total: {returnHistory.length} records</div></div></CardHeader>
        <CardContent><div className="rounded-md border overflow-x-auto"><div className="min-w-[800px]"><Table><TableHeader><TableRow className="bg-gray-50"><TableHead className="text-[11px] w-12">#</TableHead><TableHead className="text-[11px]">History ID</TableHead><TableHead className="text-[11px]">RTO ID</TableHead><TableHead className="text-[11px]">Action</TableHead><TableHead className="text-[11px]">Status</TableHead><TableHead className="text-[11px]">Remarks</TableHead><TableHead className="text-[11px]">Performed By</TableHead><TableHead className="text-[11px]">Date</TableHead></TableRow></TableHeader>
        <TableBody>{returnHistory.map((h, idx) => (<TableRow key={h.id}><TableCell className="text-center text-xs">{idx+1}</TableCell><TableCell className="font-mono text-xs">{h.historyId}</TableCell><TableCell className="font-mono text-xs">{h.rtoId}</TableCell><TableCell className="text-xs">{h.action}</TableCell><TableCell>{getStatusBadge(h.status)}</TableCell><TableCell className="text-xs">{h.remarks}</TableCell><TableCell className="text-xs">{h.performedBy}</TableCell><TableCell className="text-xs">{format(h.actionDate, "dd-MM-yyyy HH:mm")}</TableCell></TableRow>))}</TableBody></Table></div></div></CardContent></Card>
      )}

      {/* RTO Entry Sheet */}
      <Sheet open={isRTOSheetOpen} onOpenChange={setIsRTOSheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto"><SheetHeader className="mb-4"><SheetTitle className="flex items-center gap-2">{editMode ? "Edit RTO Entry" : "New RTO Entry"} <RotateCcw className="h-4 w-4 text-blue-600" /></SheetTitle></SheetHeader>
        <div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Vehicle # *</Label><Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Driver Name *</Label><Input value={driverName} onChange={(e) => setDriverName(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Driver Contact</Label><Input value={driverContact} onChange={(e) => setDriverContact(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Return Date/Time</Label><div className="flex gap-2"><Popover><PopoverTrigger asChild><Button variant="outline" className="h-8 flex-1 text-xs"><CalendarIcon className="mr-1 h-3 w-3" />{format(returnDate, "dd-MM-yyyy")}</Button></PopoverTrigger><PopoverContent><Calendar mode="single" selected={returnDate} onSelect={(d) => d && setReturnDate(d)} /></PopoverContent></Popover><Input type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} className="h-8 w-24 text-xs" /></div></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Origin Location *</Label><Input value={originLocation} onChange={(e) => setOriginLocation(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Destination Location *</Label><Input value={destinationLocation} onChange={(e) => setDestinationLocation(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Manifest #</Label><Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">GR #</Label><Input value={grNo} onChange={(e) => setGrNo(e.target.value)} className="h-8 text-xs" /></div></div>
        <div className="space-y-1"><Label className="text-xs">Reason for Return *</Label><Select value={reasonForReturn} onValueChange={setReasonForReturn}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Reason" /></SelectTrigger><SelectContent>{returnReasonOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}><span className="mr-2">{opt.icon}</span>{opt.label}</SelectItem>))}</SelectContent></Select></div>
        
        {/* Damage Details Section */}
        <div className="border rounded-md"><div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center"><h3 className="text-sm font-semibold">Damage / Claim Details</h3><Button onClick={() => setIsDamageSheetOpen(true)} variant="ghost" size="sm" className="h-7 text-xs"><PlusCircle className="mr-1 h-3 w-3" />Add Item</Button></div>
        {damageDetails.length > 0 ? (<div className="p-3"><div className="rounded-md border overflow-x-auto"><Table className="text-[10px]"><TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Type</TableHead><TableHead>Severity</TableHead><TableHead className="text-right">Est. Cost</TableHead><TableHead className="text-right">Actual</TableHead><TableHead className="w-12">Action</TableHead></TableRow></TableHeader>
        <TableBody>{damageDetails.map(d => (<TableRow key={d.id}><TableCell>{d.itemName}</TableCell><TableCell>{d.damageType}</TableCell><TableCell><Badge className={severityOptions.find(s => s.value === d.severity)?.color}>{d.severity}</Badge></TableCell><TableCell className="text-right">₹{d.estimatedCost}</TableCell><TableCell className="text-right">₹{d.actualCost}</TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => handleEditDamage(d)} className="h-6 w-6 p-0 text-blue-500"><Edit className="h-3 w-3" /></Button></TableCell></TableRow>))}</TableBody></Table></div></div>) : (<p className="text-xs text-gray-400 text-center py-4">No damage items added</p>)}</div>

        <div className="grid grid-cols-3 gap-3"><div className="space-y-1"><Label className="text-xs">Return Charge</Label><Input type="number" value={returnCharge} onChange={(e) => { setReturnCharge(Number(e.target.value)); setTimeout(calculateTotal, 0); }} className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Penalty Amount</Label><Input type="number" value={penaltyAmount} onChange={(e) => { setPenaltyAmount(Number(e.target.value)); setTimeout(calculateTotal, 0); }} className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Compensation</Label><Input type="number" value={compensationAmount} onChange={(e) => { setCompensationAmount(Number(e.target.value)); setTimeout(calculateTotal, 0); }} className="h-8 text-xs" /></div></div>
        
        <div className="bg-gray-50 p-3 rounded-md"><div className="flex justify-between items-center"><span className="text-sm font-semibold">Total Amount</span><span className="text-xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</span></div></div>
        
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Payment Status</Label><Select value={paymentStatus} onValueChange={setPaymentStatus}><SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="partially_paid">Partially Paid</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent></Select></div>
        <div className="space-y-1"><Label className="text-xs">Payment Mode</Label><Select value={paymentMode} onValueChange={setPaymentMode}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{paymentModeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div></div>
        
        <div className="space-y-1"><Label className="text-xs">Transaction ID</Label><Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="text-xs" /></div>
        
        <div className="flex justify-end gap-3 pt-4 border-t"><Button variant="outline" onClick={() => setIsRTOSheetOpen(false)} className="h-8 text-xs">Cancel</Button><Button onClick={handleAddRTO} className="h-8 text-xs bg-blue-600">{editMode ? "Update" : "Save"}</Button></div></div></SheetContent>
      </Sheet>

      {/* Damage Item Sheet */}
      <Sheet open={isDamageSheetOpen} onOpenChange={setIsDamageSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto"><SheetHeader className="mb-4"><SheetTitle>{editingDamageId ? "Edit Damage Item" : "Add Damage Item"}</SheetTitle></SheetHeader>
        <div className="space-y-4"><div className="space-y-1"><Label className="text-xs">Item Name *</Label><Input value={damageItem} onChange={(e) => setDamageItem(e.target.value)} className="h-8 text-xs" /></div>
        <div className="space-y-1"><Label className="text-xs">Damage Type</Label><Select value={damageType} onValueChange={setDamageType}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{damageTypeOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-1"><Label className="text-xs">Severity</Label><Select value={damageSeverity} onValueChange={setDamageSeverity}><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{severityOptions.map(opt => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent></Select></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-1"><Label className="text-xs">Estimated Cost</Label><Input type="number" value={estimatedCost} onChange={(e) => setEstimatedCost(Number(e.target.value))} className="h-8 text-xs" /></div><div className="space-y-1"><Label className="text-xs">Actual Cost</Label><Input type="number" value={actualCost} onChange={(e) => setActualCost(Number(e.target.value))} className="h-8 text-xs" /></div></div>
        <div className="space-y-1"><Label className="text-xs">Remarks</Label><Textarea value={damageRemarks} onChange={(e) => setDamageRemarks(e.target.value)} rows={2} className="text-xs" /></div>
        <div className="flex justify-end gap-3 pt-4"><Button variant="outline" onClick={() => setIsDamageSheetOpen(false)} className="h-8 text-xs">Cancel</Button><Button onClick={handleAddDamage} className="h-8 text-xs bg-blue-600">{editingDamageId ? "Update" : "Add"}</Button></div></div></SheetContent>
      </Sheet>

      {/* History View Sheet */}
      <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto"><SheetHeader className="mb-4"><SheetTitle>RTO History - {selectedRTO?.rtoId}</SheetTitle></SheetHeader>
        <div className="space-y-3">{searchHistory.map((h, idx) => (<div key={h.id} className="border-l-4 border-blue-500 pl-3 py-2"><div className="flex justify-between items-start"><div><p className="text-sm font-semibold">{h.action}</p><p className="text-xs text-gray-500">{h.remarks}</p></div>{getStatusBadge(h.status)}</div><div className="flex justify-between mt-1"><p className="text-xs text-gray-400">By: {h.performedBy}</p><p className="text-xs text-gray-400">{format(h.actionDate, "dd-MM-yyyy HH:mm")}</p></div></div>))}</div>
        <div className="flex justify-end pt-4"><Button variant="outline" onClick={() => setIsHistorySheetOpen(false)}>Close</Button></div></SheetContent>
      </Sheet>
    </div>
  );
}