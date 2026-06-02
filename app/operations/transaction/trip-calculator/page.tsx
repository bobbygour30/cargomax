// app/operations/transaction/trip-calculator/page.tsx
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Types
interface ExpenseItem {
  id: number;
  category: string;
  subCategory: string;
  description: string;
  amount: number;
  paidBy: string;
  paymentMode: string;
  receiptNo: string;
  date: Date;
  remarks: string;
}

interface IncomeItem {
  id: number;
  source: string;
  description: string;
  amount: number;
  receivedFrom: string;
  paymentMode: string;
  receiptNo: string;
  date: Date;
  remarks: string;
}

interface TripDetail {
  id: number;
  tripId: string;
  manifestNo: string;
  vehicleNo: string;
  driverName: string;
  startDate: Date;
  endDate: Date;
  origin: string;
  destination: string;
  totalDistance: number;
  fuelConsumed: number;
  fuelCost: number;
  tollCharges: number;
  driverSalary: number;
  helperSalary: number;
  loadingCharges: number;
  unloadingCharges: number;
  maintenanceCost: number;
  insuranceCost: number;
  permitCost: number;
  otherExpenses: ExpenseItem[];
  freightIncome: IncomeItem[];
  totalExpense: number;
  totalIncome: number;
  netProfit: number;
  profitMargin: number;
  status: "completed" | "in-progress" | "planned";
  createdAt: Date;
  updatedAt: Date;
}

// Options
const expenseCategories = [
  "Fuel", "Toll Tax", "Driver Salary", "Helper Salary", "Loading Charges",
  "Unloading Charges", "Maintenance", "Insurance", "Permit", "Food & Stay",
  "Vehicle Repair", "Tyre Change", "Oil Change", "Parking Charges",
  "Police Challan", "Other"
];

const incomeSources = [
  "Freight Charges", "Loading Charges", "Unloading Charges", "Demurrage Charges",
  "Detention Charges", "Other Income"
];

const paymentModes = ["Cash", "Cheque", "Bank Transfer", "UPI", "Credit Card"];
const paidByOptions = ["Self", "Company", "Driver", "Customer", "Broker"];

// Sample Data
const sampleTripData: TripDetail[] = [
  {
    id: 1, tripId: "TRP001", manifestNo: "M001", vehicleNo: "UP14AB1234",
    driverName: "Rajesh Kumar", startDate: new Date("2026-05-28"), endDate: new Date("2026-05-30"),
    origin: "DELHI", destination: "MUMBAI", totalDistance: 1420, fuelConsumed: 280,
    fuelCost: 28000, tollCharges: 4500, driverSalary: 5000, helperSalary: 3000,
    loadingCharges: 2000, unloadingCharges: 2000, maintenanceCost: 1500,
    insuranceCost: 800, permitCost: 500, otherExpenses: [],
    freightIncome: [], totalExpense: 0, totalIncome: 0, netProfit: 0, profitMargin: 0,
    status: "completed", createdAt: new Date(), updatedAt: new Date()
  },
  {
    id: 2, tripId: "TRP002", manifestNo: "M002", vehicleNo: "UP15CD5678",
    driverName: "Suresh Singh", startDate: new Date("2026-05-29"), endDate: new Date("2026-05-31"),
    origin: "MUMBAI", destination: "BANGALORE", totalDistance: 980, fuelConsumed: 190,
    fuelCost: 19000, tollCharges: 3200, driverSalary: 5000, helperSalary: 3000,
    loadingCharges: 1500, unloadingCharges: 1500, maintenanceCost: 1000,
    insuranceCost: 600, permitCost: 500, otherExpenses: [],
    freightIncome: [], totalExpense: 0, totalIncome: 0, netProfit: 0, profitMargin: 0,
    status: "in-progress", createdAt: new Date(), updatedAt: new Date()
  },
];

export default function TripProfitLossCalculator() {
  // Main Tab state
  const [mainTab, setMainTab] = useState<"calculator" | "history">("calculator");
  
  // Sheet state
  const [isCalculatorSheetOpen, setIsCalculatorSheetOpen] = useState(false);
  const [isExpenseSheetOpen, setIsExpenseSheetOpen] = useState(false);
  const [isIncomeSheetOpen, setIsIncomeSheetOpen] = useState(false);
  
  // Trip selection state
  const [selectedTrip, setSelectedTrip] = useState<TripDetail | null>(null);
  
  // Form state
  const [tripId, setTripId] = useState<string>("");
  const [manifestNo, setManifestNo] = useState<string>("");
  const [vehicleNo, setVehicleNo] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [fuelConsumed, setFuelConsumed] = useState<number>(0);
  const [fuelCost, setFuelCost] = useState<number>(0);
  const [tollCharges, setTollCharges] = useState<number>(0);
  const [driverSalary, setDriverSalary] = useState<number>(0);
  const [helperSalary, setHelperSalary] = useState<number>(0);
  const [loadingCharges, setLoadingCharges] = useState<number>(0);
  const [unloadingCharges, setUnloadingCharges] = useState<number>(0);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  const [insuranceCost, setInsuranceCost] = useState<number>(0);
  const [permitCost, setPermitCost] = useState<number>(0);
  
  // Dynamic expenses and income
  const [otherExpenses, setOtherExpenses] = useState<ExpenseItem[]>([]);
  const [freightIncome, setFreightIncome] = useState<IncomeItem[]>([]);
  
  // Expense/Income form states
  const [expenseCategory, setExpenseCategory] = useState<string>("");
  const [expenseSubCategory, setExpenseSubCategory] = useState<string>("");
  const [expenseDescription, setExpenseDescription] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expensePaidBy, setExpensePaidBy] = useState<string>("");
  const [expensePaymentMode, setExpensePaymentMode] = useState<string>("");
  const [expenseReceiptNo, setExpenseReceiptNo] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<Date>(new Date());
  const [expenseRemarks, setExpenseRemarks] = useState<string>("");
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  
  const [incomeSource, setIncomeSource] = useState<string>("");
  const [incomeDescription, setIncomeDescription] = useState<string>("");
  const [incomeAmount, setIncomeAmount] = useState<number>(0);
  const [incomeReceivedFrom, setIncomeReceivedFrom] = useState<string>("");
  const [incomePaymentMode, setIncomePaymentMode] = useState<string>("");
  const [incomeReceiptNo, setIncomeReceiptNo] = useState<string>("");
  const [incomeDate, setIncomeDate] = useState<Date>(new Date());
  const [incomeRemarks, setIncomeRemarks] = useState<string>("");
  const [editingIncomeId, setEditingIncomeId] = useState<number | null>(null);
  
  // Search state
  const [searchTripId, setSearchTripId] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("all");
  const [searchResults, setSearchResults] = useState<TripDetail[]>([]);
  const [historyResults, setHistoryResults] = useState<TripDetail[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState<number>(1);
  const itemsPerPage: number = 10;
  
  const [trips, setTrips] = useState<TripDetail[]>(sampleTripData);
  const [loading, setLoading] = useState(false);
  const [calculatedProfit, setCalculatedProfit] = useState(0);
  const [calculatedMargin, setCalculatedMargin] = useState(0);

  // Load trips on mount
  useEffect(() => {
    setSearchResults(trips);
    setHistoryResults(trips);
  }, []);

  const calculateTotals = () => {
    const totalExpenses = 
      fuelCost + tollCharges + driverSalary + helperSalary +
      loadingCharges + unloadingCharges + maintenanceCost +
      insuranceCost + permitCost + otherExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const totalIncome = freightIncome.reduce((sum, i) => sum + i.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
    
    setCalculatedProfit(netProfit);
    setCalculatedMargin(profitMargin);
    
    return { totalExpenses, totalIncome, netProfit, profitMargin };
  };

  const handleFetchTrip = () => {
    if (!tripId && !manifestNo) {
      alert("Please enter Trip ID or Manifest #");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const trip = trips.find(t => t.tripId === tripId || t.manifestNo === manifestNo);
      if (trip) {
        setSelectedTrip(trip);
        setManifestNo(trip.manifestNo);
        setVehicleNo(trip.vehicleNo);
        setDriverName(trip.driverName);
        setStartDate(trip.startDate);
        setEndDate(trip.endDate);
        setOrigin(trip.origin);
        setDestination(trip.destination);
        setTotalDistance(trip.totalDistance);
        setFuelConsumed(trip.fuelConsumed);
        setFuelCost(trip.fuelCost);
        setTollCharges(trip.tollCharges);
        setDriverSalary(trip.driverSalary);
        setHelperSalary(trip.helperSalary);
        setLoadingCharges(trip.loadingCharges);
        setUnloadingCharges(trip.unloadingCharges);
        setMaintenanceCost(trip.maintenanceCost);
        setInsuranceCost(trip.insuranceCost);
        setPermitCost(trip.permitCost);
        setOtherExpenses(trip.otherExpenses || []);
        setFreightIncome(trip.freightIncome || []);
        setIsCalculatorSheetOpen(true);
      } else {
        alert("Trip not found");
      }
      setLoading(false);
    }, 500);
  };

  const handleAddExpense = () => {
    if (!expenseCategory) {
      alert("Please select expense category");
      return;
    }
    if (expenseAmount <= 0) {
      alert("Please enter valid amount");
      return;
    }
    
    const newExpense: ExpenseItem = {
      id: editingExpenseId || Date.now(),
      category: expenseCategory,
      subCategory: expenseSubCategory,
      description: expenseDescription,
      amount: expenseAmount,
      paidBy: expensePaidBy,
      paymentMode: expensePaymentMode,
      receiptNo: expenseReceiptNo,
      date: expenseDate,
      remarks: expenseRemarks,
    };
    
    if (editingExpenseId) {
      setOtherExpenses(otherExpenses.map(e => e.id === editingExpenseId ? newExpense : e));
      setEditingExpenseId(null);
    } else {
      setOtherExpenses([...otherExpenses, newExpense]);
    }
    
    resetExpenseForm();
    calculateTotals();
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpenseId(expense.id);
    setExpenseCategory(expense.category);
    setExpenseSubCategory(expense.subCategory);
    setExpenseDescription(expense.description);
    setExpenseAmount(expense.amount);
    setExpensePaidBy(expense.paidBy);
    setExpensePaymentMode(expense.paymentMode);
    setExpenseReceiptNo(expense.receiptNo);
    setExpenseDate(expense.date);
    setExpenseRemarks(expense.remarks);
    setIsExpenseSheetOpen(true);
  };

  const handleRemoveExpense = (id: number) => {
    if (confirm("Are you sure you want to remove this expense?")) {
      setOtherExpenses(otherExpenses.filter(e => e.id !== id));
      calculateTotals();
    }
  };

  const handleAddIncome = () => {
    if (!incomeSource) {
      alert("Please select income source");
      return;
    }
    if (incomeAmount <= 0) {
      alert("Please enter valid amount");
      return;
    }
    
    const newIncome: IncomeItem = {
      id: editingIncomeId || Date.now(),
      source: incomeSource,
      description: incomeDescription,
      amount: incomeAmount,
      receivedFrom: incomeReceivedFrom,
      paymentMode: incomePaymentMode,
      receiptNo: incomeReceiptNo,
      date: incomeDate,
      remarks: incomeRemarks,
    };
    
    if (editingIncomeId) {
      setFreightIncome(freightIncome.map(i => i.id === editingIncomeId ? newIncome : i));
      setEditingIncomeId(null);
    } else {
      setFreightIncome([...freightIncome, newIncome]);
    }
    
    resetIncomeForm();
    calculateTotals();
  };

  const handleEditIncome = (income: IncomeItem) => {
    setEditingIncomeId(income.id);
    setIncomeSource(income.source);
    setIncomeDescription(income.description);
    setIncomeAmount(income.amount);
    setIncomeReceivedFrom(income.receivedFrom);
    setIncomePaymentMode(income.paymentMode);
    setIncomeReceiptNo(income.receiptNo);
    setIncomeDate(income.date);
    setIncomeRemarks(income.remarks);
    setIsIncomeSheetOpen(true);
  };

  const handleRemoveIncome = (id: number) => {
    if (confirm("Are you sure you want to remove this income?")) {
      setFreightIncome(freightIncome.filter(i => i.id !== id));
      calculateTotals();
    }
  };

  const resetExpenseForm = () => {
    setExpenseCategory("");
    setExpenseSubCategory("");
    setExpenseDescription("");
    setExpenseAmount(0);
    setExpensePaidBy("");
    setExpensePaymentMode("");
    setExpenseReceiptNo("");
    setExpenseDate(new Date());
    setExpenseRemarks("");
    setIsExpenseSheetOpen(false);
  };

  const resetIncomeForm = () => {
    setIncomeSource("");
    setIncomeDescription("");
    setIncomeAmount(0);
    setIncomeReceivedFrom("");
    setIncomePaymentMode("");
    setIncomeReceiptNo("");
    setIncomeDate(new Date());
    setIncomeRemarks("");
    setIsIncomeSheetOpen(false);
  };

  const handleSaveTrip = () => {
    if (!tripId && !manifestNo) {
      alert("Please enter Trip ID or Manifest #");
      return;
    }
    
    const { totalExpenses, totalIncome, netProfit, profitMargin } = calculateTotals();
    
    const tripData: TripDetail = {
      id: selectedTrip?.id || Date.now(),
      tripId: tripId || `TRP${String(trips.length + 1).padStart(3, "0")}`,
      manifestNo,
      vehicleNo,
      driverName,
      startDate,
      endDate,
      origin,
      destination,
      totalDistance,
      fuelConsumed,
      fuelCost,
      tollCharges,
      driverSalary,
      helperSalary,
      loadingCharges,
      unloadingCharges,
      maintenanceCost,
      insuranceCost,
      permitCost,
      otherExpenses,
      freightIncome,
      totalExpense: totalExpenses,
      totalIncome: totalIncome,
      netProfit: netProfit,
      profitMargin: profitMargin,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (selectedTrip) {
      setTrips(trips.map(t => t.id === selectedTrip.id ? tripData : t));
      alert("Trip updated successfully!");
    } else {
      setTrips([...trips, tripData]);
      alert("Trip saved successfully!");
    }
    
    setIsCalculatorSheetOpen(false);
    setSearchResults(trips);
  };

  const handleSearch = () => {
    let results = trips;
    if (searchTripId) {
      results = results.filter(t => 
        t.tripId.toLowerCase().includes(searchTripId.toLowerCase()) ||
        t.manifestNo.toLowerCase().includes(searchTripId.toLowerCase())
      );
    }
    if (searchStatus !== "all") {
      results = results.filter(t => t.status === searchStatus);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchTripId("");
    setSearchStatus("all");
    setSearchResults(trips);
    setCurrentPage(1);
  };

  const handleViewTrip = (trip: TripDetail) => {
    setSelectedTrip(trip);
    setTripId(trip.tripId);
    setManifestNo(trip.manifestNo);
    setVehicleNo(trip.vehicleNo);
    setDriverName(trip.driverName);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
    setOrigin(trip.origin);
    setDestination(trip.destination);
    setTotalDistance(trip.totalDistance);
    setFuelConsumed(trip.fuelConsumed);
    setFuelCost(trip.fuelCost);
    setTollCharges(trip.tollCharges);
    setDriverSalary(trip.driverSalary);
    setHelperSalary(trip.helperSalary);
    setLoadingCharges(trip.loadingCharges);
    setUnloadingCharges(trip.unloadingCharges);
    setMaintenanceCost(trip.maintenanceCost);
    setInsuranceCost(trip.insuranceCost);
    setPermitCost(trip.permitCost);
    setOtherExpenses(trip.otherExpenses || []);
    setFreightIncome(trip.freightIncome || []);
    setIsCalculatorSheetOpen(true);
  };

  const handlePrintReport = () => {
    if (!selectedTrip) {
      alert("No trip selected");
      return;
    }
    window.print();
  };

  // Stats
  const stats = {
    totalTrips: trips.length,
    completed: trips.filter(t => t.status === "completed").length,
    inProgress: trips.filter(t => t.status === "in-progress").length,
    totalProfit: trips.reduce((sum, t) => sum + t.netProfit, 0),
  };

  // Pagination
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const totalExpense = fuelCost + tollCharges + driverSalary + helperSalary +
    loadingCharges + unloadingCharges + maintenanceCost + insuranceCost +
    permitCost + otherExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = freightIncome.reduce((sum, i) => sum + i.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return (
    <div className="space-y-4 p-3 md:p-4 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                TRIP P&L CALCULATOR (INSIDE MANIFEST)
              </h1>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500">
              <span>🏢 Company: GOLDEN ROADWAYS & LOGISTICS PVT LTD</span>
              <span>👤 Login: MAYANK.GRLOGISTICS@GMAIL.COM</span>
              <span>📍 Branch: CORPORATE OFFICE</span>
              <span>📅 Financial Year: 2026-2027</span>
            </div>
          </div>
          <Button onClick={handlePrintReport} variant="outline" size="sm" className="h-8 text-xs" disabled={!selectedTrip}>
            <Printer className="mr-1 h-3.5 w-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Trips</p>
                <p className="text-2xl font-bold">{stats.totalTrips}</p>
              </div>
              <Truck className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Profit</p>
                <p className="text-2xl font-bold">₹{stats.totalProfit.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Trips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Trip ID / Manifest #</Label>
              <Input
                placeholder="Enter Trip ID or Manifest #"
                value={searchTripId}
                onChange={(e) => setSearchTripId(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Status</Label>
              <Select value={searchStatus} onValueChange={setSearchStatus}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} size="default" className="h-9 bg-blue-600 hover:bg-blue-700">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button onClick={handleClearSearch} variant="outline" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                Clear
              </Button>
              <Button onClick={handleFetchTrip} size="default" className="h-9 bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                New Trip
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Table className="h-3.5 w-3.5 text-gray-500" />
              <h3 className="text-[11px] font-semibold text-gray-800">Trips List</h3>
            </div>
            <div className="text-[10px] text-gray-500">Total: {searchResults.length} records</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-12 text-center">#</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Trip ID</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Manifest #</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Vehicle #</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 min-w-[100px]">Route</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Income</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Expense</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-[80px] text-right">Profit</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-20 text-center">Status</TableHead>
                    <TableHead className="text-[11px] font-semibold py-2 px-2 w-24 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                        <Truck className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        No trips found. Click "New Trip" to create one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedResults.map((record, idx) => (
                      <TableRow key={record.id} className="hover:bg-gray-50">
                        <TableCell className="py-2 px-2 text-center text-xs">
                          {(currentPage - 1) * itemsPerPage + idx + 1}
                        </TableCell>
                        <TableCell className="py-2 px-2 font-mono font-semibold text-xs">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-[11px]">
                            {record.tripId}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.manifestNo}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.vehicleNo}</TableCell>
                        <TableCell className="py-2 px-2 text-xs">{record.origin} → {record.destination}</TableCell>
                        <TableCell className="py-2 px-2 text-right text-xs text-green-600">
                          ₹{record.totalIncome.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-right text-xs text-red-600">
                          ₹{record.totalExpense.toLocaleString()}
                        </TableCell>
                        <TableCell className={cn(
                          "py-2 px-2 text-right text-xs font-semibold",
                          record.netProfit >= 0 ? "text-green-600" : "text-red-600"
                        )}>
                          ₹{record.netProfit.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          {record.status === "completed" ? (
                            <Badge className="bg-green-100 text-green-700 text-[10px]">Completed</Badge>
                          ) : record.status === "in-progress" ? (
                            <Badge className="bg-yellow-100 text-yellow-700 text-[10px]">In Progress</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-700 text-[10px]">Planned</Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-2 px-2 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTrip(record)}
                            className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="View & Edit"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-[10px] text-gray-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, searchResults.length)} of {searchResults.length} entries
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="h-7 text-[10px]">
                  <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                </Button>
                <span className="px-3 py-1 text-[10px]">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="h-7 text-[10px]">
                  Next <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trip P&L Calculator Sheet */}
      <Sheet open={isCalculatorSheetOpen} onOpenChange={setIsCalculatorSheetOpen}>
        <SheetContent className="w-full sm:max-w-3xl overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <Calculator className="h-4 w-4 text-blue-600" />
              Trip P&L Calculator - {selectedTrip?.tripId || "New Trip"}
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Trip Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Trip ID</Label>
                <Input value={tripId} onChange={(e) => setTripId(e.target.value)} placeholder="Auto generated" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Manifest #</Label>
                <Input value={manifestNo} onChange={(e) => setManifestNo(e.target.value)} placeholder="Enter Manifest #" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Vehicle #</Label>
                <Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} placeholder="Enter Vehicle #" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Driver Name</Label>
                <Input value={driverName} onChange={(e) => setDriverName(e.target.value)} placeholder="Enter Driver Name" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(startDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={(d) => d && setStartDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="h-8 w-full text-xs">
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {format(endDate, "dd-MM-yyyy")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={(d) => d && setEndDate(d)} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Origin</Label>
                <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Origin" className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Destination</Label>
                <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Destination" className="h-8 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-medium">Total Distance (km)</Label>
                <Input type="number" value={totalDistance} onChange={(e) => setTotalDistance(Number(e.target.value))} className="h-8 text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-medium">Fuel Consumed (Ltr)</Label>
                <Input type="number" value={fuelConsumed} onChange={(e) => setFuelConsumed(Number(e.target.value))} className="h-8 text-xs" />
              </div>
            </div>

            {/* Expenses Section */}
            <div className="border rounded-md">
              <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-red-500" />
                  Expenses
                </h3>
                <Button onClick={() => setIsExpenseSheetOpen(true)} variant="ghost" size="sm" className="h-7 text-xs">
                  <PlusCircle className="mr-1 h-3 w-3" /> Add Expense
                </Button>
              </div>
              <div className="p-3 space-y-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-xs">Fuel Cost</Label><Input type="number" value={fuelCost} onChange={(e) => setFuelCost(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Toll Charges</Label><Input type="number" value={tollCharges} onChange={(e) => setTollCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Driver Salary</Label><Input type="number" value={driverSalary} onChange={(e) => setDriverSalary(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Helper Salary</Label><Input type="number" value={helperSalary} onChange={(e) => setHelperSalary(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Loading Charges</Label><Input type="number" value={loadingCharges} onChange={(e) => setLoadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Unloading Charges</Label><Input type="number" value={unloadingCharges} onChange={(e) => setUnloadingCharges(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Maintenance Cost</Label><Input type="number" value={maintenanceCost} onChange={(e) => setMaintenanceCost(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Insurance Cost</Label><Input type="number" value={insuranceCost} onChange={(e) => setInsuranceCost(Number(e.target.value))} className="h-8 text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs">Permit Cost</Label><Input type="number" value={permitCost} onChange={(e) => setPermitCost(Number(e.target.value))} className="h-8 text-xs" /></div>
                </div>

                {/* Other Expenses Table */}
                {otherExpenses.length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-xs font-semibold mb-2">Other Expenses</h4>
                    <div className="rounded-md border overflow-x-auto">
                      <Table className="text-[10px]">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-12">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {otherExpenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{expense.category}</TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell className="text-right">₹{expense.amount.toLocaleString()}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" onClick={() => handleEditExpense(expense)} className="h-6 w-6 p-0 text-blue-500">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Income Section */}
            <div className="border rounded-md">
              <div className="bg-gray-50 px-3 py-2 border-b flex justify-between items-center">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  Income
                </h3>
                <Button onClick={() => setIsIncomeSheetOpen(true)} variant="ghost" size="sm" className="h-7 text-xs">
                  <PlusCircle className="mr-1 h-3 w-3" /> Add Income
                </Button>
              </div>
              <div className="p-3">
                {freightIncome.length > 0 ? (
                  <div className="rounded-md border overflow-x-auto">
                    <Table className="text-[10px]">
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead>Source</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-12">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {freightIncome.map((income) => (
                          <TableRow key={income.id}>
                            <TableCell>{income.source}</TableCell>
                            <TableCell>{income.description}</TableCell>
                            <TableCell className="text-right">₹{income.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleEditIncome(income)} className="h-6 w-6 p-0 text-blue-500">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No income added. Click "Add Income" to add freight charges.</p>
                )}
              </div>
            </div>

            {/* P&L Summary */}
            <div className="border rounded-md bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="p-3">
                <h3 className="text-sm font-semibold mb-3">Profit & Loss Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500">Total Income</p>
                    <p className="text-lg font-bold text-green-600">₹{totalIncome.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500">Total Expense</p>
                    <p className="text-lg font-bold text-red-600">₹{totalExpense.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500">Net Profit</p>
                    <p className={cn("text-lg font-bold", netProfit >= 0 ? "text-green-600" : "text-red-600")}>
                      ₹{netProfit.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-gray-500">Profit Margin</p>
                    <p className={cn("text-lg font-bold", profitMargin >= 0 ? "text-green-600" : "text-red-600")}>
                      {profitMargin.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCalculatorSheetOpen(false)} className="h-8 text-xs">
                <X className="mr-1 h-3 w-3" /> Cancel
              </Button>
              <Button onClick={handleSaveTrip} size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
                <Save className="mr-1 h-3 w-3" />
                Save Trip
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Expense Sheet */}
      <Sheet open={isExpenseSheetOpen} onOpenChange={setIsExpenseSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-red-600" />
              {editingExpenseId ? "Edit Expense" : "Add Expense"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Category <span className="text-red-500">*</span></Label>
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Sub Category</Label>
              <Input value={expenseSubCategory} onChange={(e) => setExpenseSubCategory(e.target.value)} className="h-8 text-xs" placeholder="e.g., Diesel, Petrol, etc." />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Description</Label>
              <Input value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} className="h-8 text-xs" placeholder="Enter description" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Amount (₹) <span className="text-red-500">*</span></Label>
              <Input type="number" value={expenseAmount} onChange={(e) => setExpenseAmount(Number(e.target.value))} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Paid By</Label>
              <Select value={expensePaidBy} onValueChange={setExpensePaidBy}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{paidByOptions.map(opt => (<SelectItem key={opt} value={opt}>{opt}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Payment Mode</Label>
              <Select value={expensePaymentMode} onValueChange={setExpensePaymentMode}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{paymentModes.map(mode => (<SelectItem key={mode} value={mode}>{mode}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Receipt #</Label>
              <Input value={expenseReceiptNo} onChange={(e) => setExpenseReceiptNo(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(expenseDate, "dd-MM-yyyy")}</Button>
                </PopoverTrigger>
                <PopoverContent><Calendar mode="single" selected={expenseDate} onSelect={(d) => d && setExpenseDate(d)} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Remarks</Label>
              <Textarea value={expenseRemarks} onChange={(e) => setExpenseRemarks(e.target.value)} rows={2} className="text-xs" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsExpenseSheetOpen(false)} className="h-8 text-xs">Cancel</Button>
              <Button onClick={handleAddExpense} className="h-8 text-xs bg-red-600 hover:bg-red-700">Add Expense</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Income Sheet */}
      <Sheet open={isIncomeSheetOpen} onOpenChange={setIsIncomeSheetOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-green-600" />
              {editingIncomeId ? "Edit Income" : "Add Income"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Source <span className="text-red-500">*</span></Label>
              <Select value={incomeSource} onValueChange={setIncomeSource}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select Source" /></SelectTrigger>
                <SelectContent>{incomeSources.map(src => (<SelectItem key={src} value={src}>{src}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Description</Label>
              <Input value={incomeDescription} onChange={(e) => setIncomeDescription(e.target.value)} className="h-8 text-xs" placeholder="Enter description" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Amount (₹) <span className="text-red-500">*</span></Label>
              <Input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(Number(e.target.value))} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Received From</Label>
              <Input value={incomeReceivedFrom} onChange={(e) => setIncomeReceivedFrom(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Payment Mode</Label>
              <Select value={incomePaymentMode} onValueChange={setIncomePaymentMode}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{paymentModes.map(mode => (<SelectItem key={mode} value={mode}>{mode}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Receipt #</Label>
              <Input value={incomeReceiptNo} onChange={(e) => setIncomeReceiptNo(e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-8 w-full text-xs"><CalendarIcon className="mr-2 h-3 w-3" />{format(incomeDate, "dd-MM-yyyy")}</Button>
                </PopoverTrigger>
                <PopoverContent><Calendar mode="single" selected={incomeDate} onSelect={(d) => d && setIncomeDate(d)} /></PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium">Remarks</Label>
              <Textarea value={incomeRemarks} onChange={(e) => setIncomeRemarks(e.target.value)} rows={2} className="text-xs" />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsIncomeSheetOpen(false)} className="h-8 text-xs">Cancel</Button>
              <Button onClick={handleAddIncome} className="h-8 text-xs bg-green-600 hover:bg-green-700">Add Income</Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Missing imports
import { CheckCircle } from "lucide-react";